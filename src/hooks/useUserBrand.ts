
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserBrand } from '@/types/supabase-custom';
import { useAuth } from './useAuth';

export const useUserBrand = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userBrand,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userBrand', user?.id],
    queryFn: async (): Promise<UserBrand | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - brand profile doesn't exist yet
          return null;
        }
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  const createBrandMutation = useMutation({
    mutationFn: async (brandData: Omit<UserBrand, 'brand_id' | 'auth_user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('brands')
        .insert([{
          ...brandData,
          auth_user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBrand', user?.id] });
    }
  });

  const updateBrandMutation = useMutation({
    mutationFn: async (brandData: Partial<Omit<UserBrand, 'brand_id' | 'auth_user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user?.id || !userBrand?.brand_id) throw new Error('User not authenticated or brand not found');
      
      const { data, error } = await supabase
        .from('brands')
        .update(brandData)
        .eq('brand_id', userBrand.brand_id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBrand', user?.id] });
    }
  });

  return {
    userBrand,
    isLoading,
    error,
    createBrand: createBrandMutation.mutate,
    updateBrand: updateBrandMutation.mutate,
    isCreatingBrand: createBrandMutation.isPending,
    isUpdatingBrand: updateBrandMutation.isPending
  };
};
