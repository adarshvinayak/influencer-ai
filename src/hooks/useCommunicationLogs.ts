
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CommunicationLog {
  log_id: string;
  outreach_id: string;
  channel: string;
  direction: string;
  subject_or_summary?: string;
  content_transcript?: string;
  timestamp: string;
  ai_models_used?: string[];
  metadata?: any;
  created_at: string;
}

export const useCommunicationLogs = (outreachId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: communicationLogs,
    isLoading,
    error
  } = useQuery({
    queryKey: ['communicationLogs', outreachId],
    queryFn: async (): Promise<CommunicationLog[]> => {
      if (!outreachId) return [];
      
      // Validate that outreachId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(outreachId)) {
        console.warn('Invalid UUID format for outreachId:', outreachId);
        return [];
      }
      
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('outreach_id', outreachId)
        .order('timestamp', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!outreachId
  });

  const addLogMutation = useMutation({
    mutationFn: async (logData: Omit<CommunicationLog, 'log_id' | 'created_at' | 'timestamp'>) => {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert([{
          ...logData,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communicationLogs'] });
    }
  });

  return {
    communicationLogs,
    isLoading,
    error,
    addLog: addLogMutation.mutate,
    isAddingLog: addLogMutation.isPending
  };
};
