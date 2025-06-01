
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserBrand } from './useUserBrand';

export interface OutreachActivity {
  outreach_id: string;
  campaign_id: string;
  influencer_id: string;
  brand_id: string;
  outreach_method: string;
  ai_agent_name?: string;
  status: string;
  last_updated_status_at: string;
  initiated_at: string;
  next_follow_up_at?: string;
  notes_and_alerts?: string;
  created_at: string;
  updated_at: string;
}

export const useOutreachActivities = (campaignId?: string) => {
  const { userBrand } = useUserBrand();
  const queryClient = useQueryClient();

  const {
    data: outreachActivities,
    isLoading,
    error
  } = useQuery({
    queryKey: ['outreachActivities', userBrand?.brand_id, campaignId],
    queryFn: async (): Promise<OutreachActivity[]> => {
      if (!userBrand?.brand_id) return [];
      
      let query = supabase
        .from('outreach_activities')
        .select('*')
        .eq('brand_id', userBrand.brand_id);

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userBrand?.brand_id
  });

  const createOutreachMutation = useMutation({
    mutationFn: async (outreachData: Omit<OutreachActivity, 'outreach_id' | 'created_at' | 'updated_at' | 'last_updated_status_at' | 'initiated_at'>) => {
      const { data, error } = await supabase
        .from('outreach_activities')
        .insert([outreachData])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreachActivities', userBrand?.brand_id] });
    }
  });

  const updateOutreachMutation = useMutation({
    mutationFn: async ({ outreachId, updates }: { 
      outreachId: string; 
      updates: Partial<Omit<OutreachActivity, 'outreach_id' | 'brand_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('outreach_activities')
        .update({
          ...updates,
          last_updated_status_at: new Date().toISOString()
        })
        .eq('outreach_id', outreachId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreachActivities', userBrand?.brand_id] });
    }
  });

  return {
    outreachActivities,
    isLoading,
    error,
    createOutreach: createOutreachMutation.mutate,
    updateOutreach: updateOutreachMutation.mutate,
    isCreatingOutreach: createOutreachMutation.isPending,
    isUpdatingOutreach: updateOutreachMutation.isPending
  };
};
