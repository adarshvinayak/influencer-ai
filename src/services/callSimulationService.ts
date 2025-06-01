
import { supabase } from '@/integrations/supabase/client';

export interface CallSimulationResult {
  transcript: string;
  success: boolean;
  error?: string;
}

export const simulatePhoneCall = async (
  outreachId: string,
  influencerName: string,
  campaignName: string,
  brandName: string
): Promise<CallSimulationResult> => {
  try {
    // Call the Supabase Edge Function for call simulation
    const { data, error } = await supabase.functions.invoke('simulate-call', {
      body: {
        outreachId,
        influencerName,
        campaignName,
        brandName
      }
    });

    if (error) {
      console.error('Error simulating call:', error);
      return {
        transcript: '',
        success: false,
        error: error.message
      };
    }

    return {
      transcript: data.transcript || '',
      success: true
    };
  } catch (error) {
    console.error('Error in simulatePhoneCall:', error);
    return {
      transcript: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
