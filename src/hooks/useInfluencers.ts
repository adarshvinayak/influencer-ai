
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Influencer {
  influencer_id: string;
  full_name: string;
  username_handle?: string;
  profile_picture_url?: string;
  bio_description?: string;
  active_since_year?: number;
  location_city?: string;
  location_state_india?: string;
  primary_niches?: string[];
  overall_follower_count_estimate?: number;
  average_engagement_rate_estimate?: number;
  primary_content_types_offered?: string[];
  past_collaborations_summary?: string;
  availability_status?: string;
  verification_status?: string;
  preferred_communication_languages?: string[];
}

export interface PlatformAccount {
  platform_account_id: string;
  influencer_id: string;
  platform_name: string;
  profile_url: string;
  username_on_platform: string;
  follower_count?: number;
  engagement_rate_on_platform?: number;
}

export const useInfluencers = (filters?: {
  niche?: string;
  minFollowers?: number;
  maxFollowers?: number;
  location?: string;
  platforms?: string[];
}) => {
  const {
    data: influencers,
    isLoading,
    error
  } = useQuery({
    queryKey: ['influencers', filters],
    queryFn: async (): Promise<Influencer[]> => {
      let query = supabase
        .from('influencers')
        .select('*');

      // Apply filters
      if (filters?.niche) {
        query = query.contains('primary_niches', [filters.niche]);
      }
      
      if (filters?.minFollowers) {
        query = query.gte('overall_follower_count_estimate', filters.minFollowers);
      }
      
      if (filters?.maxFollowers) {
        query = query.lte('overall_follower_count_estimate', filters.maxFollowers);
      }
      
      if (filters?.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_state_india.ilike.%${filters.location}%`);
      }

      const { data, error } = await query.order('overall_follower_count_estimate', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    }
  });

  return {
    influencers,
    isLoading,
    error
  };
};

export const useInfluencerById = (influencerId: string) => {
  const {
    data: influencer,
    isLoading,
    error
  } = useQuery({
    queryKey: ['influencer', influencerId],
    queryFn: async (): Promise<Influencer | null> => {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('influencer_id', influencerId)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!influencerId
  });

  return {
    influencer,
    isLoading,
    error
  };
};

export const usePlatformAccounts = (influencerId: string) => {
  const {
    data: platformAccounts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['platformAccounts', influencerId],
    queryFn: async (): Promise<PlatformAccount[]> => {
      const { data, error } = await supabase
        .from('platform_accounts')
        .select('*')
        .eq('influencer_id', influencerId)
        .order('follower_count', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!influencerId
  });

  return {
    platformAccounts,
    isLoading,
    error
  };
};
