
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

interface ElevenLabsConversationTurn {
  role: 'user' | 'agent';
  message: string | null;
  tool_calls: any[];
  tool_results: any[];
  feedback: any;
  llm_override: any;
  time_in_call_secs: number;
  conversation_turn_metrics: any;
  rag_retrieval_info: any;
  llm_usage: any;
}

interface ElevenLabsResponse {
  status: string;
  conversation_id?: string;
  messages?: ElevenLabsMessage[];
  transcript?: string;
}

// Define different conversation scenarios
const getRandomConversationScenario = (influencerName: string, campaignName: string, brandName: string) => {
  const scenarios = [
    // Scenario 1: Positive Interest (original)
    {
      status: 'Response - Positive Interest',
      notes: 'Initial call completed successfully. Strong positive engagement received. Follow-up call scheduled for next day. Influencer showed interest in $2,500 campaign package.',
      messages: [
        {
          role: 'assistant' as const,
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user' as const, 
          content: `Hi Sam! No, not at all, this is actually perfect timing. Thank you so much for reaching out. I'm really interested to hear more about this collaboration opportunity. Could you tell me more details about the ${campaignName} campaign?`
        },
        {
          role: 'assistant' as const,
          content: `Absolutely! I'm so excited to share this with you. Our ${campaignName} campaign is all about authentic partnerships with creators like yourself who truly connect with their audience. We're looking for someone who can create engaging content that resonates naturally while showcasing our brand values. The campaign would involve creating 3-4 pieces of content over the next month, and we're offering competitive compensation that reflects the value you bring.`
        },
        {
          role: 'user' as const,
          content: `That sounds really interesting and aligns well with what I do! I love working with brands that value authenticity. Could you share more specifics about the content requirements, timeline, and compensation? I'd also love to know more about the creative freedom I'd have.`
        },
        {
          role: 'assistant' as const,
          content: `I love your enthusiasm! For creative freedom, we believe in letting creators do what they do best - we'll provide brand guidelines but you'll have full creative control over the content style and presentation. As for compensation, we're looking at $2,500 for the full campaign package. I'd love to schedule a follow-up call tomorrow where I can share the detailed brief and answer any other questions you might have. Would that work for you?`
        },
        {
          role: 'user' as const,
          content: `Perfect! That compensation sounds fair and I really appreciate the creative freedom approach. Yes, let's definitely schedule a follow-up call for tomorrow. Could we do sometime in the afternoon? And could you send me the brief beforehand so I can review it?`
        },
        {
          role: 'assistant' as const,
          content: `Absolutely! How does 2 PM tomorrow sound? I'll send you the detailed campaign brief within the next hour, along with our media kit and some examples of previous successful collaborations. I'm really excited about the possibility of working together, ${influencerName}. I think this is going to be an amazing partnership!`
        }
      ]
    },
    
    // Scenario 2: Not Interested
    {
      status: 'Response - Not Interested',
      notes: 'Influencer politely declined. Not interested in brand collaborations at this time. Focusing on personal content. Marked as not interested for future reference.',
      messages: [
        {
          role: 'assistant' as const,
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user' as const,
          content: `Hi Sam, thanks for reaching out. I appreciate that you've been following my content. However, I have to be honest - I'm not really looking for brand partnerships right now. I'm focusing on creating more personal, authentic content and taking a break from collaborations.`
        },
        {
          role: 'assistant' as const,
          content: `I completely understand, ${influencerName}. Authenticity is so important, and I really respect that you're being selective about partnerships. Would you be open to me reaching out again in a few months when you might be more interested in collaborations?`
        },
        {
          role: 'user' as const,
          content: `I appreciate the understanding, Sam. To be honest, I'm not sure when I'll be ready for brand partnerships again. I'm really trying to focus on my personal brand right now. Maybe it's best if I reach out to you guys when I'm ready instead?`
        },
        {
          role: 'assistant' as const,
          content: `Absolutely, that makes total sense. I'll make a note in our system that you're focusing on personal content right now. Please don't hesitate to reach out whenever you feel ready - we'd love to work with you in the future. Thanks for being so honest and upfront with me, ${influencerName}. Have a great day!`
        }
      ]
    },

    // Scenario 3: Negotiation
    {
      status: 'Response - In Negotiation',
      notes: 'Active negotiation in progress. Influencer interested but wants higher compensation ($4,000 vs offered $2,500) and more creative control. Counter-proposal received.',
      messages: [
        {
          role: 'assistant' as const,
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user' as const,
          content: `Hi Sam! Thanks for calling. I'm definitely interested in hearing about this opportunity. I've actually been looking to work with more brands in this space. Tell me more about what you have in mind.`
        },
        {
          role: 'assistant' as const,
          content: `Great to hear! Our ${campaignName} campaign involves creating 3-4 pieces of content over the next month. We're looking for authentic storytelling that resonates with your audience. The compensation we're offering is $2,500 for the full package, and we'd provide brand guidelines while giving you creative freedom within those parameters.`
        },
        {
          role: 'user' as const,
          content: `Okay, the concept sounds interesting and aligns with my content style. However, I have some concerns about the compensation and creative control. Based on my engagement rates and the scope of work, I typically charge around $4,000 for a campaign like this. Also, I'd need complete creative control - I know my audience best and what resonates with them.`
        },
        {
          role: 'assistant' as const,
          content: `I appreciate you being upfront about your rates, ${influencerName}. Your engagement is definitely impressive, and I can see why you command those rates. Let me talk to my team about the budget - we might have some flexibility there. As for creative control, I'd love to understand more about what that looks like for you. Could we schedule a follow-up call to discuss the details?`
        },
        {
          role: 'user' as const,
          content: `Absolutely! I'm happy to discuss this further. Just to be clear, complete creative control means I choose the format, style, and messaging as long as it aligns with the campaign goals. I won't do anything that feels forced or inauthentic to my brand. Let's schedule that call and see if we can find a middle ground that works for both of us.`
        }
      ]
    },

    // Scenario 4: Deal Accepted
    {
      status: 'Deal - Terms Agreed',
      notes: 'Excellent! Deal successfully negotiated and accepted. Final terms: $3,200 compensation, 4 pieces of content, full creative control. Contract to be sent within 24 hours.',
      messages: [
        {
          role: 'assistant' as const,
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user' as const,
          content: `Hi Sam! Perfect timing actually. I've been looking for meaningful brand partnerships that align with my values. I'd love to hear more about this opportunity.`
        },
        {
          role: 'assistant' as const,
          content: `Wonderful! Our ${campaignName} campaign is focused on authentic storytelling and genuine connection with audiences. We're looking for 3-4 pieces of content over the next month, and we're offering $3,200 for the full package. We believe in giving creators complete creative control because you know your audience best.`
        },
        {
          role: 'user' as const,
          content: `That sounds fantastic! I love that you're prioritizing authenticity and creative freedom - that's exactly what I look for in partnerships. The compensation is fair for the scope of work. What's the timeline looking like, and what are the next steps?`
        },
        {
          role: 'assistant' as const,
          content: `I'm so excited you're interested! The timeline is flexible - we'd like to launch in about 2 weeks, but we can work around your schedule. Next steps would be sending you the detailed brief and contract. We'd need the content delivered over 4 weeks, with the first piece going live in 2 weeks. Does that timeline work for you?`
        },
        {
          role: 'user' as const,
          content: `Yes, that timeline works perfectly! I'm really excited about this collaboration. Please send over the contract and brief - I'm ready to move forward. This sounds like exactly the kind of authentic partnership I want to be part of.`
        },
        {
          role: 'assistant' as const,
          content: `Amazing! I'll have the contract and detailed brief sent to you within the next 24 hours. Welcome to the ${brandName} family, ${influencerName}! I have a feeling this is going to be an incredible collaboration. I'll also send you our brand kit and previous campaign examples. Looking forward to seeing what you create!`
        }
      ]
    },

    // Scenario 5: Need More Information
    {
      status: 'Response - Needs More Information',
      notes: 'Influencer interested but requires detailed information about brand values, campaign goals, and deliverables before making decision. Follow-up scheduled with marketing team.',
      messages: [
        {
          role: 'assistant' as const,
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user' as const,
          content: `Hi Sam, thanks for reaching out. I'm always open to hearing about potential collaborations, but I'm quite selective about the brands I work with. Could you tell me more about ${brandName}'s values and what this campaign is really trying to achieve?`
        },
        {
          role: 'assistant' as const,
          content: `Absolutely, I completely understand being selective - it shows you care about your audience. ${brandName} is focused on sustainability and authentic lifestyle choices. Our ${campaignName} campaign aims to showcase how our products integrate naturally into everyday life. We're offering $2,500 for 3-4 pieces of content.`
        },
        {
          role: 'user' as const,
          content: `Okay, sustainability is definitely important to me and my audience. But I need to understand more specifics. What exactly are the deliverables? What's the messaging framework? How does this align with your company's broader mission? I don't want to promote anything that doesn't genuinely align with my values.`
        },
        {
          role: 'assistant' as const,
          content: `Those are excellent questions, and I really appreciate how thoughtful you are about partnerships. I'd love to set up a more detailed call with our marketing director who can walk you through our brand mission, specific campaign goals, and deliverable requirements. Would you be open to a 30-minute call this week?`
        },
        {
          role: 'user' as const,
          content: `Yes, that would be perfect. I'd really like to speak with someone who can give me the full picture of what you're trying to achieve and how it aligns with my content. I'm genuinely interested, but I need to make sure it's the right fit before committing to anything.`
        }
      ]
    }
  ];

  // Randomly select a scenario
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

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
      // Make real ElevenLabs API call
      console.log('Making real ElevenLabs API call...');
      
      const agentId = 'agent_01jwhcwysyf7xtzqr9bq7nt34t';
      
      // Create simulation specification with correct structure
      const requestBody = {
        simulation_specification: {
          simulated_user_config: {
            prompt: {
              prompt: `You are ${influencerName}, a content creator who has been contacted by ${brandName} about their ${campaignName} campaign. You are interested but want to negotiate and ask questions about compensation, creative freedom, timeline, and brand alignment. Be realistic and professional but also show some enthusiasm for good opportunities.`,
              llm: 'gpt-4o',
              temperature: 0.7,
            },
          },
        },
        extra_evaluation_criteria: [
          {
            id: 'engagement_check',
            name: 'Engagement Check',
            conversation_goal_prompt: 'The conversation resulted in positive engagement from the influencer.',
            use_knowledge_base: false,
          },
        ],
      };

      console.log('Sending request to ElevenLabs with body:', JSON.stringify(requestBody, null, 2));

      const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}/simulate-conversation`, {
        method: 'POST',
        headers: {
          'Xi-Api-Key': elevenlabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text();
        console.error('ElevenLabs API error:', elevenLabsResponse.status, errorText);
        throw new Error(`ElevenLabs API error: ${elevenLabsResponse.status}`);
      }

      const elevenLabsData: ElevenLabsConversationTurn[] = await elevenLabsResponse.json();
      console.log('ElevenLabs API response received, processing conversation...');
      console.log('Raw ElevenLabs response:', JSON.stringify(elevenLabsData, null, 2));

      // Process the ElevenLabs response to extract messages
      const processedMessages: ElevenLabsMessage[] = [];
      
      for (const turn of elevenLabsData) {
        // Skip turns with no message (like tool calls without content)
        if (!turn.message || turn.message.trim() === '') {
          continue;
        }

        // Convert ElevenLabs format to our format
        const processedMessage: ElevenLabsMessage = {
          role: turn.role === 'agent' ? 'assistant' : 'user',
          content: turn.message.trim()
        };

        processedMessages.push(processedMessage);
      }

      console.log(`Processed ${processedMessages.length} messages from ElevenLabs response`);

      simulationResponse = {
        status: 'completed',
        conversation_id: `elevenlabs_conv_${Date.now()}`,
        messages: processedMessages
      };

    } catch (elevenLabsError) {
      console.log('ElevenLabs API call failed, using enhanced mock simulation:', elevenLabsError);
      
      // Fallback to enhanced mock simulation with diverse scenarios
      const scenario = getRandomConversationScenario(influencerName, campaignName, brandName);
      console.log('Selected scenario:', scenario.status);
      
      simulationResponse = {
        status: 'completed',
        conversation_id: `mock_conv_${Date.now()}`,
        messages: scenario.messages
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

    // Determine status and notes based on the scenario used
    let finalStatus = 'Response - Positive Interest';
    let finalNotes = 'Initial call completed successfully. AI outreach generated realistic conversation flow.';
    let nextFollowUp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
    
    // If using mock simulation, get the scenario details
    if (simulationResponse.conversation_id?.startsWith('mock_conv_')) {
      const scenario = getRandomConversationScenario(influencerName, campaignName, brandName);
      finalStatus = scenario.status;
      finalNotes = scenario.notes;
      
      // Adjust follow-up timing based on status
      if (scenario.status.includes('Not Interested')) {
        nextFollowUp = null; // No follow-up needed
      } else if (scenario.status.includes('Deal - Terms Agreed')) {
        nextFollowUp = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours for contract
      }
    }

    // Update outreach status with the determined outcome
    console.log('Updating outreach status to:', finalStatus);
    const updateData: any = {
      status: finalStatus,
      notes_and_alerts: finalNotes,
      last_updated_status_at: new Date().toISOString()
    };
    
    if (nextFollowUp) {
      updateData.next_follow_up_at = nextFollowUp;
    }

    const { error: updateError } = await supabase
      .from('outreach_activities')
      .update(updateData)
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
      conversation_id: simulationResponse.conversation_id,
      final_status: finalStatus
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
