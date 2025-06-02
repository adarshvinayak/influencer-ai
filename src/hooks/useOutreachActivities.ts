import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { simulatePhoneCall } from '@/services/callSimulationService';

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
    mutationFn: async (activityData: Omit<OutreachActivity, 'outreach_id' | 'created_at' | 'updated_at' | 'brand_id' | 'initiated_at' | 'last_updated_status_at'> & {
      influencerName?: string;
      campaignName?: string;
      brandName?: string;
    }) => {
      console.log('Starting outreach activity creation with data:', activityData);
      
      // Get the current user's brand_id from the brands table
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('brand_id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (brandError || !brandData) {
        console.error('Brand lookup error:', brandError);
        throw new Error('Brand not found. Please ensure your profile is set up correctly.');
      }

      console.log('Found brand:', brandData);

      // Check if outreach already exists for this combination
      const { data: existingOutreach, error: checkError } = await supabase
        .from('outreach_activities')
        .select('outreach_id, status')
        .eq('campaign_id', activityData.campaign_id)
        .eq('influencer_id', activityData.influencer_id)
        .eq('outreach_method', activityData.outreach_method)
        .eq('brand_id', brandData.brand_id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing outreach:', checkError);
        throw new Error(`Failed to check existing outreach: ${checkError.message}`);
      }

      if (existingOutreach) {
        console.log('Existing outreach found:', existingOutreach);
        throw new Error(`Outreach already exists for this influencer and campaign via ${activityData.outreach_method}. Current status: ${existingOutreach.status}`);
      }

      // Prepare data for database insertion - only include valid database columns
      const dbData = {
        campaign_id: activityData.campaign_id,
        influencer_id: activityData.influencer_id,
        outreach_method: activityData.outreach_method,
        ai_agent_name: activityData.ai_agent_name,
        status: activityData.status,
        notes_and_alerts: activityData.notes_and_alerts,
        brand_id: brandData.brand_id,
        initiated_at: new Date().toISOString(),
        last_updated_status_at: new Date().toISOString()
      };

      console.log('Inserting outreach activity with data:', dbData);

      const { data, error } = await supabase
        .from('outreach_activities')
        .insert([dbData])
        .select()
        .single();
      
      if (error) {
        console.error('Database insertion error:', error);
        throw new Error(`Failed to create outreach activity: ${error.message}`);
      }

      console.log('Successfully created outreach activity:', data);

      // Automatically simulate call if it's a phone outreach
      if (data.outreach_method === 'phone' && activityData.influencerName && activityData.campaignName && activityData.brandName) {
        try {
          console.log('Starting phone call simulation for outreach:', data.outreach_id);
          await simulatePhoneCall(
            data.outreach_id,
            activityData.influencerName,
            activityData.campaignName,
            activityData.brandName
          );
          console.log('Phone call simulation completed successfully');
        } catch (error) {
          console.error('Failed to simulate call:', error);
          // Don't throw here as the outreach was created successfully
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreachActivities'] });
      queryClient.invalidateQueries({ queryKey: ['communicationLogs'] });
    },
    onError: (error) => {
      console.error('Outreach activity creation failed:', error);
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
    isUpdatingOutreachActivity: updateOutreachActivityMutation.isPending,
    addOutreachActivityAsync: addOutreachActivityMutation.mutateAsync
  };
};
