
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserBrand } from './useUserBrand';

export interface DealContract {
  deal_id: string;
  outreach_id: string;
  campaign_id: string;
  influencer_id: string;
  brand_id: string;
  agreed_rate_amount: number;
  agreed_rate_currency: string;
  agreed_deliverables: string;
  agreed_timeline?: string;
  contract_document_url?: string;
  e_signature_provider?: string;
  e_signature_status: string;
  contract_sent_at?: string;
  contract_signed_by_influencer_at?: string;
  contract_signed_by_brand_at?: string;
  deal_finalized_at: string;
  created_at: string;
  updated_at: string;
}

export const useDealsContracts = (campaignId?: string) => {
  const { userBrand } = useUserBrand();
  const queryClient = useQueryClient();

  const {
    data: deals,
    isLoading,
    error
  } = useQuery({
    queryKey: ['deals', userBrand?.brand_id, campaignId],
    queryFn: async (): Promise<DealContract[]> => {
      if (!userBrand?.brand_id) return [];
      
      let query = supabase
        .from('deals_contracts')
        .select('*')
        .eq('brand_id', userBrand.brand_id);

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query.order('deal_finalized_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userBrand?.brand_id
  });

  const createDealMutation = useMutation({
    mutationFn: async (dealData: Omit<DealContract, 'deal_id' | 'created_at' | 'updated_at' | 'deal_finalized_at'>) => {
      const { data, error } = await supabase
        .from('deals_contracts')
        .insert([{
          ...dealData,
          deal_finalized_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', userBrand?.brand_id] });
    }
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ dealId, updates }: { 
      dealId: string; 
      updates: Partial<Omit<DealContract, 'deal_id' | 'brand_id' | 'created_at' | 'updated_at' | 'deal_finalized_at'>>
    }) => {
      const { data, error } = await supabase
        .from('deals_contracts')
        .update(updates)
        .eq('deal_id', dealId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', userBrand?.brand_id] });
    }
  });

  return {
    deals,
    isLoading,
    error,
    createDeal: createDealMutation.mutate,
    updateDeal: updateDealMutation.mutate,
    isCreatingDeal: createDealMutation.isPending,
    isUpdatingDeal: updateDealMutation.isPending
  };
};
