
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OutreachActivity {
  outreach_id: string;
  brand_id: string;
  influencer_id: string;
  campaign_id: string;
  outreach_method: string;
  ai_agent_name?: string;
  status: string;
  notes_and_alerts?: string;
  initiated_at: string;
  last_updated_status_at: string;
  next_follow_up_at?: string;
  created_at: string;
  updated_at: string;
}

export const useOutreachActivities = (filters?: {
  campaignId?: string;
  influencerId?: string;
  status?: string;
  method?: string;
}) => {
  const queryClient = useQueryClient();

  const {
    data: outreachActivities,
    isLoading,
    error
  } = useQuery({
    queryKey: ['outreachActivities', filters],
    queryFn: async (): Promise<OutreachActivity[]> => {
      let query = supabase
        .from('outreach_activities')
        .select('*')
        .order('last_updated_status_at', { ascending: false });

      if (filters?.campaignId) {
        query = query.eq('campaign_id', filters.campaignId);
      }
      if (filters?.influencerId) {
        query = query.eq('influencer_id', filters.influencerId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.method) {
        query = query.eq('outreach_method', filters.method);
      }

      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data || [];
    }
  });

  const addOutreachActivityMutation = useMutation({
    mutationFn: async (activityData: Omit<OutreachActivity, 'outreach_id' | 'created_at' | 'updated_at' | 'brand_id' | 'initiated_at' | 'last_updated_status_at'>) => {
      // Get the current user's brand_id from the brands table
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('brand_id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (brandError || !brandData) throw new Error('Brand not found');

      const { data, error } = await supabase
        .from('outreach_activities')
        .insert([{
          ...activityData,
          brand_id: brandData.brand_id,
          initiated_at: new Date().toISOString(),
          last_updated_status_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreachActivities'] });
    }
  });

  const updateOutreachActivityMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<OutreachActivity> }) => {
      const { data, error } = await supabase
        .from('outreach_activities')
        .update({
          ...updates,
          last_updated_status_at: new Date().toISOString()
        })
        .eq('outreach_id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreachActivities'] });
    }
  });

  return {
    outreachActivities,
    isLoading,
    error,
    addOutreachActivity: addOutreachActivityMutation.mutate,
    isAddingOutreachActivity: addOutreachActivityMutation.isPending,
    updateOutreachActivity: updateOutreachActivityMutation.mutate,
    isUpdatingOutreachActivity: updateOutreachActivityMutation.isPending
  };
};
