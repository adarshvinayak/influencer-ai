
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SimulationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ElevenLabsResponse {
  messages?: SimulationMessage[];
  transcript?: string;
  conversation_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { outreachId, influencerName, campaignName, brandName } = await req.json();
    
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Mock agent ID - in production, you'd create actual agents in ElevenLabs
    const agentId = 'mock-agent-id';
    
    // Create a mock simulation response since we can't use the actual ElevenLabs SDK in Edge Functions
    // In production, you would make the actual API call to ElevenLabs
    const mockSimulationResponse: ElevenLabsResponse = {
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam from ${brandName}. I hope you're having a great day! I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`,
          timestamp: new Date().toISOString()
        },
        {
          role: 'user', 
          content: `Hi Sam! Thank you for reaching out. I'm interested to hear more about this collaboration opportunity. Could you tell me more about the ${campaignName} campaign?`,
          timestamp: new Date(Date.now() + 5000).toISOString()
        },
        {
          role: 'assistant',
          content: `Absolutely! Our ${campaignName} campaign is focused on authentic partnerships with creators like yourself. We're looking for someone who can create engaging content that resonates with their audience while showcasing our brand values. Would you be interested in discussing the details further?`,
          timestamp: new Date(Date.now() + 10000).toISOString()
        },
        {
          role: 'user',
          content: `That sounds really interesting! I'd love to learn more about the specific requirements and compensation. Could we schedule a follow-up call to discuss this in detail?`,
          timestamp: new Date(Date.now() + 15000).toISOString()
        },
        {
          role: 'assistant',
          content: `Perfect! I'm excited about the possibility of working together. I'll send you an email with all the campaign details and we can schedule a follow-up call to discuss everything in detail. Thank you for your time today, ${influencerName}!`,
          timestamp: new Date(Date.now() + 20000).toISOString()
        }
      ]
    };

    // Format transcript from messages
    const transcript = mockSimulationResponse.messages?.map(msg => 
      `${msg.role === 'assistant' ? 'AI Agent (Sam)' : influencerName}: ${msg.content}`
    ).join('\n\n') || '';

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store the conversation in communication_logs
    if (mockSimulationResponse.messages) {
      for (const message of mockSimulationResponse.messages) {
        await supabase
          .from('communication_logs')
          .insert({
            outreach_id: outreachId,
            channel: 'phone',
            direction: message.role === 'assistant' ? 'outbound' : 'inbound',
            subject_or_summary: message.role === 'assistant' ? 'AI Agent Call' : 'Influencer Response',
            content_transcript: message.content,
            timestamp: message.timestamp || new Date().toISOString(),
            ai_models_used: message.role === 'assistant' ? ['gpt-4o'] : null
          });
      }
    }

    // Update outreach status to show call was made
    await supabase
      .from('outreach_activities')
      .update({
        status: 'Waiting for Response',
        notes_and_alerts: 'Initial call completed successfully. Positive engagement received.',
        last_updated_status_at: new Date().toISOString()
      })
      .eq('outreach_id', outreachId);

    return new Response(JSON.stringify({ 
      transcript,
      success: true,
      messages: mockSimulationResponse.messages 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in simulate-call function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
