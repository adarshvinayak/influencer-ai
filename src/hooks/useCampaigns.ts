
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/types/supabase-custom';
import { useUserBrand } from './useUserBrand';

export const useCampaigns = () => {
  const { userBrand } = useUserBrand();
  const queryClient = useQueryClient();

  const {
    data: campaigns,
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaigns', userBrand?.brand_id],
    queryFn: async (): Promise<Campaign[]> => {
      if (!userBrand?.brand_id) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('brand_id', userBrand.brand_id)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userBrand?.brand_id
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: Omit<Campaign, 'campaign_id' | 'brand_id' | 'created_at' | 'updated_at'>) => {
      if (!userBrand?.brand_id) throw new Error('Brand not found');
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          brand_id: userBrand.brand_id
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', userBrand?.brand_id] });
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, updates }: { 
      campaignId: string; 
      updates: Partial<Omit<Campaign, 'campaign_id' | 'brand_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('campaign_id', campaignId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', userBrand?.brand_id] });
    }
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('campaign_id', campaignId);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', userBrand?.brand_id] });
    }
  });

  return {
    campaigns,
    isLoading,
    error,
    createCampaign: createCampaignMutation.mutate,
    updateCampaign: updateCampaignMutation.mutate,
    deleteCampaign: deleteCampaignMutation.mutate,
    isCreatingCampaign: createCampaignMutation.isPending,
    isUpdatingCampaign: updateCampaignMutation.isPending,
    isDeletingCampaign: deleteCampaignMutation.isPending
  };
};
