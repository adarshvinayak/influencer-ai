
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserBrand } from './useUserBrand';

export interface Notification {
  notification_id: string;
  brand_id: string;
  title: string;
  message: string;
  type?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at?: string;
}

export const useNotifications = () => {
  const { userBrand } = useUserBrand();
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications', userBrand?.brand_id],
    queryFn: async (): Promise<Notification[]> => {
      if (!userBrand?.brand_id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('brand_id', userBrand.brand_id)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!userBrand?.brand_id
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('notification_id', notificationId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userBrand?.brand_id] });
    }
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return {
    notifications,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    unreadCount
  };
};
