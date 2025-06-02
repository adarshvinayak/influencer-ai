
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationScenario {
  status: string;
  notes: string;
  messages: ConversationMessage[];
  nextFollowUpHours?: number;
}

// Expanded conversation scenarios with more diverse outcomes
const getRandomConversationScenario = (influencerName: string, campaignName: string, brandName: string): ConversationScenario => {
  const scenarios: ConversationScenario[] = [
    // Scenario 1: Positive Response
    {
      status: 'Response - Positive Interest',
      notes: 'Initial call completed successfully. Strong positive engagement received. Follow-up call scheduled for next day. Influencer showed interest in $2,500 campaign package.',
      nextFollowUpHours: 24,
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
        }
      ]
    },

    // Scenario 2: Not Interested
    {
      status: 'Response - Not Interested',
      notes: 'Influencer politely declined. Not interested in brand collaborations at this time. Focusing on personal content. Marked as not interested for future reference.',
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam, thanks for reaching out. I appreciate that you've been following my content. However, I have to be honest - I'm not really looking for brand partnerships right now. I'm focusing on creating more personal, authentic content and taking a break from collaborations.`
        },
        {
          role: 'assistant',
          content: `I completely understand, ${influencerName}. Authenticity is so important, and I really respect that you're being selective about partnerships. Would you be open to me reaching out again in a few months when you might be more interested in collaborations?`
        },
        {
          role: 'user',
          content: `I appreciate the understanding, Sam. To be honest, I'm not sure when I'll be ready for brand partnerships again. I'm really trying to focus on my personal brand right now. Maybe it's best if I reach out to you guys when I'm ready instead?`
        },
        {
          role: 'assistant',
          content: `Absolutely, that makes total sense. I'll make a note in our system that you're focusing on personal content right now. Please don't hesitate to reach out whenever you feel ready - we'd love to work with you in the future. Thanks for being so honest and upfront with me, ${influencerName}. Have a great day!`
        }
      ]
    },

    // Scenario 3: In Negotiation
    {
      status: 'Response - In Negotiation',
      notes: 'Active negotiation in progress. Influencer interested but wants higher compensation ($4,000 vs offered $2,500) and more creative control. Counter-proposal received.',
      nextFollowUpHours: 48,
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam! Thanks for calling. I'm definitely interested in hearing about this opportunity. I've actually been looking to work with more brands in this space. Tell me more about what you have in mind.`
        },
        {
          role: 'assistant',
          content: `Great to hear! Our ${campaignName} campaign involves creating 3-4 pieces of content over the next month. We're looking for authentic storytelling that resonates with your audience. The compensation we're offering is $2,500 for the full package, and we'd provide brand guidelines while giving you creative freedom within those parameters.`
        },
        {
          role: 'user',
          content: `Okay, the concept sounds interesting and aligns with my content style. However, I have some concerns about the compensation and creative control. Based on my engagement rates and the scope of work, I typically charge around $4,000 for a campaign like this. Also, I'd need complete creative control - I know my audience best and what resonates with them.`
        },
        {
          role: 'assistant',
          content: `I appreciate you being upfront about your rates, ${influencerName}. Your engagement is definitely impressive, and I can see why you command those rates. Let me talk to my team about the budget - we might have some flexibility there. As for creative control, I'd love to understand more about what that looks like for you. Could we schedule a follow-up call to discuss the details?`
        },
        {
          role: 'user',
          content: `Absolutely! I'm happy to discuss this further. Just to be clear, complete creative control means I choose the format, style, and messaging as long as it aligns with the campaign goals. I won't do anything that feels forced or inauthentic to my brand. Let's schedule that call and see if we can find a middle ground that works for both of us.`
        }
      ]
    },

    // Scenario 4: Payment Link Sent
    {
      status: 'Payment Link Sent',
      notes: 'Terms agreed! Payment link sent for $3,200 campaign. Waiting for payment confirmation to proceed with contract and brief delivery.',
      nextFollowUpHours: 12,
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam! Perfect timing actually. I've been looking for meaningful brand partnerships that align with my values. I'd love to hear more about this opportunity.`
        },
        {
          role: 'assistant',
          content: `Wonderful! Our ${campaignName} campaign is focused on authentic storytelling and genuine connection with audiences. We're looking for 3-4 pieces of content over the next month, and we're offering $3,200 for the full package. We believe in giving creators complete creative control because you know your audience best.`
        },
        {
          role: 'user',
          content: `That sounds fantastic! I love that you're prioritizing authenticity and creative freedom - that's exactly what I look for in partnerships. The compensation is fair for the scope of work. What's the timeline looking like, and what are the next steps?`
        },
        {
          role: 'assistant',
          content: `I'm so excited you're interested! The timeline is flexible - we'd like to launch in about 2 weeks, but we can work around your schedule. Next steps would be sending you the payment link so we can get started, then I'll send the detailed brief and contract. We'd need the content delivered over 4 weeks, with the first piece going live in 2 weeks. Does that work?`
        },
        {
          role: 'user',
          content: `Yes, that timeline works perfectly! I'm ready to move forward. Please send over the payment link and I'll take care of it right away. I'm really excited about this collaboration!`
        },
        {
          role: 'assistant',
          content: `Amazing! I'll send you the secure payment link within the next hour along with all the campaign details. Once payment is confirmed, you'll receive the full brief and contract. Welcome to the ${brandName} family, ${influencerName}! This is going to be incredible!`
        }
      ]
    },

    // Scenario 5: Human Intervention Needed
    {
      status: 'Issue: AI Needs Human Help',
      notes: 'Complex pricing negotiation beyond AI parameters. Influencer requesting custom package with additional deliverables and performance bonuses. Requires human sales team intervention.',
      nextFollowUpHours: 4,
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam! Thanks for reaching out. I'm definitely interested, but I work with some pretty specific terms and custom packages. I typically require performance-based bonuses, exclusive category rights, and a tiered pricing structure based on engagement metrics. Can you accommodate that?`
        },
        {
          role: 'assistant',
          content: `That's really interesting, ${influencerName}. You clearly have a sophisticated approach to partnerships. I appreciate you sharing those requirements upfront. Some of what you're mentioning - like performance bonuses and exclusive category rights - might need approval from our partnerships team since they're outside our standard campaign structure.`
        },
        {
          role: 'user',
          content: `I understand. I also require a minimum guaranteed engagement rate clause, the right to approve all brand messaging before posting, and a custom content calendar that aligns with my editorial schedule. Plus, I'd need usage rights limitations - the content can only be used for 6 months maximum. These are non-negotiables for me.`
        },
        {
          role: 'assistant',
          content: `I really appreciate you being so detailed about your requirements, ${influencerName}. You're clearly very professional about your partnerships. These are quite specific terms that I'd need to discuss with our senior partnerships team to see what we can accommodate. Would you be open to a call with our director of partnerships who can properly address these custom requirements?`
        },
        {
          role: 'user',
          content: `Absolutely, that would be perfect. I'm used to working with decision-makers on these types of arrangements. Just make sure they understand that I'm looking for a true partnership, not just a standard influencer deal. My audience trusts me, so any collaboration needs to reflect that level of authenticity and mutual respect.`
        }
      ]
    },

    // Scenario 6: Contract Signed
    {
      status: 'Contract Signed',
      notes: 'Excellent progress! Contract successfully signed electronically. Payment confirmed. Campaign brief delivered. Content creation phase begins. First deliverable due in 5 days.',
      nextFollowUpHours: 120,
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam! Great timing. I'm always interested in hearing about new collaboration opportunities, especially with brands that approach partnerships thoughtfully.`
        },
        {
          role: 'assistant',
          content: `That's exactly our approach! Our ${campaignName} campaign is all about authentic storytelling. We're offering $2,800 for 4 pieces of content over the next month. What makes this special is we give you complete creative control - you know your audience best, and we trust your expertise.`
        },
        {
          role: 'user',
          content: `I love that approach! Creative control is so important to me. The compensation sounds reasonable for the scope. What's the approval process like, and how quickly can we get started if we move forward?`
        },
        {
          role: 'assistant',
          content: `We keep it simple - you create content in your style, we review to make sure it hits the key campaign messages, and then you're good to post. The whole process usually takes 24-48 hours max. If you're ready to move forward, I can send you the contract and brief today, and we could have you started by early next week.`
        },
        {
          role: 'user',
          content: `That sounds perfect! I'm definitely ready to move forward. This feels like exactly the kind of authentic partnership I want to be part of. Send over the contract and I'll review and sign it today.`
        },
        {
          role: 'assistant',
          content: `Fantastic! I'm sending the contract and campaign brief now. Once you sign, payment will be processed within 24 hours and we'll schedule a brief kickoff call to align on the creative direction. This is going to be an amazing collaboration, ${influencerName}!`
        }
      ]
    },

    // Scenario 7: Deal Finalized
    {
      status: 'Deal Finalized',
      notes: 'Campaign successfully completed! All 4 content pieces delivered and published. Excellent performance metrics achieved. Payment processed. Post-campaign review scheduled.',
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam! Perfect timing. I'm always open to discussing good partnership opportunities. Tell me more about what you have in mind.`
        },
        {
          role: 'assistant',
          content: `Great! Our ${campaignName} campaign is a month-long partnership where you'd create 4 pieces of content showcasing our products naturally within your existing content style. We're offering $3,000 total, with payments split 50% upfront and 50% upon completion.`
        },
        {
          role: 'user',
          content: `That sounds really manageable and the payment structure works well for me. I like that you're letting me integrate it naturally into my content. What's the timeline for each piece, and when would we start?`
        },
        {
          role: 'assistant',
          content: `Perfect! We'd start next week, with one piece per week over four weeks. You'll have complete creative freedom as long as the key product benefits are highlighted naturally. I'll send you the products to try first, then the brief, and we can start creating amazing content together.`
        },
        {
          role: 'user',
          content: `I love that approach - trying the products first is so important for authentic content. Yes, let's do this! I'm excited to get started and create something great together.`
        },
        {
          role: 'assistant',
          content: `Wonderful! I'll get everything set up today. You'll receive the products by end of week, the brief and contract by tomorrow, and we'll have a quick kickoff call next Monday. This is going to be fantastic, ${influencerName}! Looking forward to working together.`
        }
      ]
    },

    // Scenario 8: Needs More Information
    {
      status: 'Response - Needs More Information',
      notes: 'Influencer interested but requires detailed information about brand values, campaign goals, and deliverables before making decision. Follow-up scheduled with marketing team.',
      nextFollowUpHours: 72,
      messages: [
        {
          role: 'assistant',
          content: `Hello ${influencerName}! This is Sam calling from ${brandName}. I hope I'm not catching you at a bad time. I'm reaching out because we've been following your amazing content and think you'd be perfect for our ${campaignName} campaign.`
        },
        {
          role: 'user',
          content: `Hi Sam, thanks for reaching out. I'm always open to hearing about potential collaborations, but I'm quite selective about the brands I work with. Could you tell me more about ${brandName}'s values and what this campaign is really trying to achieve?`
        },
        {
          role: 'assistant',
          content: `Absolutely, I completely understand being selective - it shows you care about your audience. ${brandName} is focused on sustainability and authentic lifestyle choices. Our ${campaignName} campaign aims to showcase how our products integrate naturally into everyday life. We're offering $2,500 for 3-4 pieces of content.`
        },
        {
          role: 'user',
          content: `Okay, sustainability is definitely important to me and my audience. But I need to understand more specifics. What exactly are the deliverables? What's the messaging framework? How does this align with your company's broader mission? I don't want to promote anything that doesn't genuinely align with my values.`
        },
        {
          role: 'assistant',
          content: `Those are excellent questions, and I really appreciate how thoughtful you are about partnerships. I'd love to set up a more detailed call with our marketing director who can walk you through our brand mission, specific campaign goals, and deliverable requirements. Would you be open to a 30-minute call this week?`
        },
        {
          role: 'user',
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
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get a random conversation scenario
    const scenario = getRandomConversationScenario(influencerName, campaignName, brandName);
    console.log('Selected scenario:', scenario.status);

    // Create formatted transcript
    const transcript = scenario.messages.map(msg => 
      `${msg.role === 'assistant' ? 'AI Agent (Sam)' : influencerName}: ${msg.content}`
    ).join('\n\n');

    console.log('Generated transcript length:', transcript.length);

    // Store the conversation in communication_logs with proper timestamps
    console.log('Storing', scenario.messages.length, 'messages in communication logs');
    
    for (let i = 0; i < scenario.messages.length; i++) {
      const message = scenario.messages[i];
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
          ai_models_used: message.role === 'assistant' ? ['gpt-4o'] : null
        });

      if (logError) {
        console.error('Error inserting communication log:', logError);
      } else {
        console.log(`Inserted message ${i + 1}/${scenario.messages.length}`);
      }
    }

    // Determine next follow-up timing
    let nextFollowUp = null;
    if (scenario.nextFollowUpHours) {
      nextFollowUp = new Date(Date.now() + scenario.nextFollowUpHours * 60 * 60 * 1000).toISOString();
    }

    // Update outreach status with the determined outcome
    console.log('Updating outreach status to:', scenario.status);
    const updateData: any = {
      status: scenario.status,
      notes_and_alerts: scenario.notes,
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
      messages: scenario.messages,
      conversation_id: `hardcoded_conv_${Date.now()}`,
      final_status: scenario.status
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
