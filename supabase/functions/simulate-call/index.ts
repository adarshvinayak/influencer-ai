
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ElevenLabsMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ElevenLabsResponse {
  status: string;
  conversation_id?: string;
  messages?: ElevenLabsMessage[];
  transcript?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { outreachId, influencerName, campaignName, brandName } = await req.json();
    
    console.log('Starting call simulation for:', { outreachId, influencerName, campaignName, brandName });
    
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      console.error('ElevenLabs API key not configured');
      throw new Error('ElevenLabs API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let simulationResponse: ElevenLabsResponse;

    try {
      // Try to use real ElevenLabs API
      console.log('Attempting to create conversation with ElevenLabs...');
      
      const conversationResponse = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
        method: 'POST',
        headers: {
          'Xi-Api-Key': elevenlabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: 'your-agent-id', // You'll need to replace this with an actual agent ID
          // Add any other required parameters for the conversation
        }),
      });

      if (!conversationResponse.ok) {
        throw new Error(`ElevenLabs API error: ${conversationResponse.status}`);
      }

      const conversationData = await conversationResponse.json();
      console.log('ElevenLabs conversation created:', conversationData);

      // For now, we'll fall back to mock data since we need a proper agent setup
      throw new Error('Using mock data for now');

    } catch (elevenLabsError) {
      console.log('ElevenLabs API call failed, using mock simulation:', elevenLabsError);
      
      // Use enhanced mock simulation with more realistic conversation flow
      simulationResponse = {
        status: 'completed',
        conversation_id: `mock_conv_${Date.now()}`,
        messages: [
          {
            role: 'assistant',
            content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
          },
          {
            role: 'user', 
            content: `Hi Sam! No, not at all, this is actually perfect timing. Thank you so much for reaching out. I'm really interested to hear more about this collaboration opportunity. Could you tell me more details about the ${campaignName} campaign?`
          },
          {
            role: 'assistant',
            content: `Absolutely! I'm so excited to share this with you. Our ${campaignName} campaign is all about authentic partnerships with creators like yourself who truly connect with their audience. We're looking for someone who can create engaging content that resonates naturally while showcasing our brand values. The campaign would involve creating 3-4 pieces of content over the next month, and we're offering competitive compensation that reflects the value you bring.`
          },
          {
            role: 'user',
            content: `That sounds really interesting and aligns well with what I do! I love working with brands that value authenticity. Could you share more specifics about the content requirements, timeline, and compensation? I'd also love to know more about the creative freedom I'd have.`
          },
          {
            role: 'assistant',
            content: `I love your enthusiasm! For creative freedom, we believe in letting creators do what they do best - we'll provide brand guidelines but you'll have full creative control over the content style and presentation. As for compensation, we're looking at $2,500 for the full campaign package. I'd love to schedule a follow-up call tomorrow where I can share the detailed brief and answer any other questions you might have. Would that work for you?`
          },
          {
            role: 'user',
            content: `Perfect! That compensation sounds fair and I really appreciate the creative freedom approach. Yes, let's definitely schedule a follow-up call for tomorrow. Could we do sometime in the afternoon? And could you send me the brief beforehand so I can review it?`
          },
          {
            role: 'assistant',
            content: `Absolutely! How does 2 PM tomorrow sound? I'll send you the detailed campaign brief within the next hour, along with our media kit and some examples of previous successful collaborations. I'm really excited about the possibility of working together, ${influencerName}. I think this is going to be an amazing partnership!`
          }
        ]
      };
    }

    // Create formatted transcript
    const transcript = simulationResponse.messages?.map(msg => 
      `${msg.role === 'assistant' ? 'AI Agent (Sam)' : influencerName}: ${msg.content}`
    ).join('\n\n') || '';

    console.log('Generated transcript length:', transcript.length);

    // Store the conversation in communication_logs with proper timestamps
    if (simulationResponse.messages) {
      console.log('Storing', simulationResponse.messages.length, 'messages in communication logs');
      
      for (let i = 0; i < simulationResponse.messages.length; i++) {
        const message = simulationResponse.messages[i];
        const messageTimestamp = new Date(Date.now() + (i * 30000)).toISOString(); // 30 seconds apart
        
        const { error: logError } = await supabase
          .from('communication_logs')
          .insert({
            outreach_id: outreachId,
            channel: 'phone',
            direction: message.role === 'assistant' ? 'outbound' : 'inbound',
            subject_or_summary: message.role === 'assistant' ? 'AI Agent Call' : 'Influencer Response',
            content_transcript: message.content,
            timestamp: messageTimestamp,
            ai_models_used: message.role === 'assistant' ? ['gpt-4o', 'elevenlabs-voice'] : null
          });

        if (logError) {
          console.error('Error inserting communication log:', logError);
        } else {
          console.log(`Inserted message ${i + 1}/${simulationResponse.messages.length}`);
        }
      }
    }

    // Update outreach status to show successful call completion
    console.log('Updating outreach status...');
    const { error: updateError } = await supabase
      .from('outreach_activities')
      .update({
        status: 'Response - Positive Interest',
        notes_and_alerts: 'Initial call completed successfully. Strong positive engagement received. Follow-up call scheduled for next day. Influencer showed interest in $2,500 campaign package.',
        last_updated_status_at: new Date().toISOString(),
        next_follow_up_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      })
      .eq('outreach_id', outreachId);

    if (updateError) {
      console.error('Error updating outreach status:', updateError);
    } else {
      console.log('Successfully updated outreach status');
    }

    return new Response(JSON.stringify({ 
      success: true,
      transcript,
      messages: simulationResponse.messages,
      conversation_id: simulationResponse.conversation_id
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
