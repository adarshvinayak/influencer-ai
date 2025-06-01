
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
  initiated_at?: string;
  last_updated_status_at?: string;
  next_follow_up_at?: string;
  notes_and_alerts?: string;
}

export interface CommunicationLog {
  log_id: string;
  outreach_id: string;
  timestamp: string;
  direction: string;
  channel: string;
  subject_or_summary?: string;
  content_transcript?: string;
  ai_models_used?: string[];
  metadata?: any;
}

export const useOutreachActivities = () => {
  const { userBrand } = useUserBrand();
  const queryClient = useQueryClient();

  const {
    data: outreachActivities,
    isLoading,
    error
  } = useQuery({
    queryKey: ['outreachActivities', userBrand?.brand_id],
    queryFn: async (): Promise<OutreachActivity[]> => {
      if (!userBrand?.brand_id) return [];
      
      const { data, error } = await supabase
        .from('outreach_activities')
        .select('*')
        .eq('brand_id', userBrand.brand_id)
        .order('initiated_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userBrand?.brand_id
  });

  const createOutreachMutation = useMutation({
    mutationFn: async (outreachData: Omit<OutreachActivity, 'outreach_id' | 'brand_id' | 'initiated_at' | 'last_updated_status_at'>) => {
      if (!userBrand?.brand_id) throw new Error('Brand not found');
      
      const { data, error } = await supabase
        .from('outreach_activities')
        .insert([{
          ...outreachData,
          brand_id: userBrand.brand_id
        }])
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
      updates: Partial<Omit<OutreachActivity, 'outreach_id' | 'brand_id'>>
    }) => {
      const { data, error } = await supabase
        .from('outreach_activities')
        .update(updates)
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

export const useCommunicationLogs = (outreachId: string) => {
  const {
    data: communicationLogs,
    isLoading,
    error
  } = useQuery({
    queryKey: ['communicationLogs', outreachId],
    queryFn: async (): Promise<CommunicationLog[]> => {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('outreach_id', outreachId)
        .order('timestamp', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!outreachId
  });

  return {
    communicationLogs,
    isLoading,
    error
  };
};
