
# Manual Integration Guide for Supabase & External APIs

## ⚠️ CRITICAL SECURITY WARNING ⚠️

**This guide describes frontend API integration approaches for PROTOTYPING ONLY. Direct frontend API calls expose API keys in the browser, creating severe security vulnerabilities. For production applications, ALL external API calls must be made from secure backend services.**

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [OpenAI GPT-4 Integration](#openai-gpt-4-integration)
3. [ElevenLabs Voice Integration](#elevenlabs-voice-integration)
4. [Gmail API Integration](#gmail-api-integration)
5. [DocuSign E-Signature Integration](#docusign-e-signature-integration)
6. [Razorpay Payment Integration](#razorpay-payment-integration)
7. [Supabase Data Flow](#supabase-data-flow)
8. [React Query State Management](#react-query-state-management)

## Prerequisites

### Required API Keys & Accounts
- OpenAI API Key (GPT-4o access)
- ElevenLabs API Key
- Google Cloud Project with Gmail API enabled
- DocuSign Developer Account
- Razorpay Account with API keys
- Supabase Project configured

### Security Setup for Prototyping
1. Create restricted API keys where possible
2. Set spending limits on all accounts
3. Use separate development accounts
4. Never commit API keys to version control
5. Consider using environment variables (though still exposed in frontend)

## OpenAI GPT-4 Integration

### 1. Outreach Drafting

**Security Warning**: OpenAI API key will be exposed in browser. Use restricted keys with spending limits for prototyping only.

#### Frontend Implementation:

```javascript
// In InfluencerProfile.tsx - generateAIDraft function
const generateAIDraft = async () => {
  setIsGeneratingDraft(true);
  
  try {
    // Step 1: Fetch context data from Supabase
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('campaign_id', selectedCampaign)
      .single();
    
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('brand_id', campaign.brand_id)
      .single();
    
    // Step 2: Construct GPT-4o prompt
    const prompt = `
      You are an expert influencer marketing outreach specialist. Create a personalized email draft for the following:
      
      Influencer: ${influencer.name} (${influencer.handle})
      - Bio: ${influencer.bio}
      - Niches: ${influencer.niches.join(', ')}
      - Location: ${influencer.location}
      - Languages: ${influencer.languages.join(', ')}
      
      Brand: ${brand.brand_name}
      Campaign: ${campaign.campaign_name}
      - Brief: ${campaign.description_brief}
      - Niche: ${campaign.niche}
      - Budget: ${campaign.budget_amount} ${campaign.budget_currency}
      
      Create a warm, professional email that:
      1. Shows genuine knowledge of their content
      2. Explains the collaboration opportunity clearly
      3. Maintains enthusiasm without being pushy
      4. Includes clear next steps
      
      Keep it under 200 words.
    `;
    
    // Step 3: Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // ⚠️ EXPOSED IN BROWSER
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert influencer marketing specialist.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const generatedDraft = data.choices[0].message.content;
    
    // Step 4: Update state
    setAiDraft(generatedDraft);
    
    // Step 5: Save draft to Supabase
    await supabase
      .from('communication_logs')
      .insert({
        outreach_id: currentOutreachId, // You'll need to track this
        channel: 'email',
        direction: 'outbound',
        subject_or_summary: 'AI Generated Email Draft',
        content_transcript: generatedDraft,
        ai_models_used: ['gpt-4o'],
        metadata: { status: 'draft', generated_by: 'ai' }
      });
      
  } catch (error) {
    console.error('Error generating draft:', error);
    // Handle error state
  } finally {
    setIsGeneratingDraft(false);
  }
};
```

**CORS Limitations**: OpenAI API may block direct browser requests. You may need a local proxy server even for prototyping.

### 2. Negotiation Assistance

```javascript
const getAINegotiationSuggestion = async (outreachId) => {
  // Fetch conversation history
  const { data: logs } = await supabase
    .from('communication_logs')
    .select('*')
    .eq('outreach_id', outreachId)
    .order('timestamp', { ascending: true });
  
  const conversationContext = logs
    .map(log => `${log.direction}: ${log.content_transcript}`)
    .join('\n\n');
  
  const prompt = `
    Analyze this influencer outreach conversation and provide strategic advice:
    
    ${conversationContext}
    
    Provide:
    1. Sentiment analysis
    2. Key points mentioned by influencer
    3. Suggested response strategy
    4. Negotiation tactics
    5. Probability of conversion
  `;
  
  // Similar OpenAI API call as above
  // Save suggestion to communication_logs with type: 'ai_suggestion'
};
```

### 3. Influencer Recommendations

```javascript
const getAIRecommendations = async (campaignId) => {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('campaign_id', campaignId)
    .single();
  
  const { data: influencers } = await supabase
    .from('influencers')
    .select('*')
    .limit(50); // Get sample for AI to analyze
  
  const prompt = `
    Campaign Brief: ${campaign.description_brief}
    Target Niche: ${campaign.niche}
    Budget: ${campaign.budget_amount} ${campaign.budget_currency}
    
    Available Influencers: ${JSON.stringify(influencers)}
    
    Rank the top 10 influencers for this campaign based on:
    - Niche alignment
    - Audience size vs budget
    - Engagement quality
    - Geographic relevance
    
    Return only influencer IDs in ranked order.
  `;
  
  // Call OpenAI API and parse response
  // Update influencers table with ai_match_score_cache
};
```

## ElevenLabs Voice Integration

### ⚠️ Major Frontend Limitations

**Critical Issue**: Direct PSTN phone calling from frontend JavaScript is not feasible. ElevenLabs is primarily for text-to-speech, not telephony.

### 1. Text-to-Speech for Script Preview (Feasible)

```javascript
const generateVoicePreview = async (script) => {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_ELEVENLABS_API_KEY}`, // ⚠️ EXPOSED
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    }),
  });
  
  if (response.ok) {
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Play audio
    const audio = new Audio(audioUrl);
    audio.play();
  }
};
```

### 2. Call Initiation (NOT FEASIBLE FROM FRONTEND)

**Reality Check**: You need backend telephony infrastructure like:
- Twilio Voice API
- Asterisk server
- Custom telephony gateway

**Prototype Alternative**: Mock the calling interface and manually input call results.

```javascript
const simulateAICall = async () => {
  setCallStatus('calling');
  
  // Simulate call duration
  setTimeout(() => {
    setCallStatus('completed');
    // Prompt user to manually input transcript
  }, 30000); // 30 second simulation
};
```

### 3. Transcript Analysis (After Manual Input)

```javascript
const analyzeCallTranscript = async (transcript) => {
  const prompt = `
    Analyze this influencer phone call transcript:
    
    ${transcript}
    
    Provide structured analysis:
    {
      "sentiment": "positive/neutral/negative",
      "key_points": ["point1", "point2"],
      "interest_level": "high/medium/low", 
      "objections": ["objection1"],
      "next_steps": ["step1", "step2"],
      "conversion_probability": 85
    }
  `;
  
  // Call OpenAI API for analysis
  // Save results to outreach_activities.notes_and_alerts
};
```

## Gmail API Integration

### ⚠️ Complex OAuth Requirements

**Security Warning**: Gmail API requires OAuth 2.0 flow. Managing tokens in browser is risky.

### 1. OAuth Setup (Complex)

```javascript
// Install: npm install gapi-script

import { gapi } from 'gapi-script';

const initGoogleAPI = () => {
  gapi.load('auth2', () => {
    gapi.auth2.init({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Public, OK to expose
    });
  });
};

const signInToGmail = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  const user = await authInstance.signIn({
    scope: 'https://www.googleapis.com/auth/gmail.send'
  });
  
  return user.getAuthResponse().access_token;
};
```

### 2. Send Email

```javascript
const sendEmailViaGmail = async (to, subject, body) => {
  const accessToken = await signInToGmail();
  
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    '',
    body
  ].join('\n');
  
  const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');
  
  const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail
    }),
  });
  
  if (response.ok) {
    // Log sent email to Supabase
    await supabase
      .from('communication_logs')
      .insert({
        outreach_id: currentOutreachId,
        channel: 'email',
        direction: 'outbound',
        subject_or_summary: subject,
        content_transcript: body,
        metadata: { sent_via: 'gmail_api', message_id: (await response.json()).id }
      });
  }
};
```

**Limitations**:
- Complex OAuth setup required
- Tokens expire and need refresh
- Limited to user's own Gmail account
- No reliable read receipt tracking from frontend

## DocuSign E-Signature Integration

### ⚠️ CRITICAL SECURITY ISSUE

**NEVER expose DocuSign API credentials in frontend.** Envelope creation requires backend.

### 1. Embedded Signing (Requires Backend Setup)

**Reality**: You need a backend endpoint that:
1. Creates DocuSign envelope using server-side SDK
2. Populates template with deal data from Supabase
3. Returns recipient view URL for embedding

```javascript
// Frontend can only handle the embedding part
const openDocuSignSigning = async (dealId) => {
  setIsPreparingContract(true);
  
  try {
    // This endpoint MUST be implemented on your backend
    const response = await fetch('/api/docusign/create-envelope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId }),
    });
    
    const { signingUrl } = await response.json();
    
    // Open in iframe or new window
    window.open(signingUrl, '_blank');
    
    setContractStatus('sent');
  } catch (error) {
    console.error('Contract preparation failed:', error);
  } finally {
    setIsPreparingContract(false);
  }
};
```

### 2. Webhook Handling (Backend Required)

```javascript
// Frontend can only simulate webhook updates for prototype
const simulateDocuSignWebhook = (status) => {
  // Manually update contract status in Supabase
  supabase
    .from('deals_contracts')
    .update({ e_signature_status: status })
    .eq('deal_id', currentDealId);
};
```

**For Prototyping**: Manually update database contract status to simulate DocuSign events.

## Razorpay Payment Integration

### ⚠️ Order Creation Security Requirement

**Critical**: Order creation MUST happen on backend with your Key Secret.

### 1. Order Creation (Backend Required)

```javascript
// This endpoint must be implemented on your backend
const createRazorpayOrder = async (dealId) => {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dealId }),
  });
  
  const { orderId, amount, currency } = await response.json();
  return { orderId, amount, currency };
};
```

### 2. Frontend Checkout (Feasible)

```javascript
// Install: npm install razorpay

const initiateRazorpayPayment = async (dealId) => {
  setIsInitiatingPayment(true);
  
  try {
    // Get order from backend
    const { orderId, amount, currency } = await createRazorpayOrder(dealId);
    
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Public key, OK to expose
      amount: amount,
      currency: currency,
      name: 'Influencer Campaign Payment',
      description: 'Payment for influencer collaboration',
      order_id: orderId,
      handler: async (response) => {
        // Send to backend for verification (CRITICAL)
        await verifyPayment(response);
      },
      prefill: {
        name: influencer.name,
        email: influencer.email,
      },
      theme: {
        color: '#14b8a6'
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
    
  } catch (error) {
    console.error('Payment initiation failed:', error);
  } finally {
    setIsInitiatingPayment(false);
  }
};
```

### 3. Payment Verification (Backend Required)

```javascript
const verifyPayment = async (paymentResponse) => {
  // This MUST be done on backend for security
  const response = await fetch('/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    }),
  });
  
  if (response.ok) {
    // Update payment status in Supabase
    await supabase
      .from('payments')
      .update({
        status: 'Completed',
        transaction_id_gateway: paymentResponse.razorpay_payment_id,
        payment_processed_at: new Date().toISOString(),
      })
      .eq('deal_id', currentDealId);
  }
};
```

## Supabase Data Flow

### 1. Outreach Activity Creation

```javascript
const createOutreachActivity = async (campaignId, influencerId, method) => {
  const { data } = await supabase
    .from('outreach_activities')
    .insert({
      campaign_id: campaignId,
      influencer_id: influencerId,
      outreach_method: method,
      status: 'AI Drafting',
      ai_agent_name: method === 'phone' ? 'Sam (Voice)' : 'Eva (Email)',
    })
    .select()
    .single();
  
  return data.outreach_id;
};
```

### 2. Communication Logging

```javascript
const logCommunication = async (outreachId, data) => {
  await supabase
    .from('communication_logs')
    .insert({
      outreach_id: outreachId,
      channel: data.channel,
      direction: data.direction,
      subject_or_summary: data.subject,
      content_transcript: data.content,
      ai_models_used: data.aiModels || [],
      metadata: data.metadata || {},
    });
};
```

### 3. Deal Creation

```javascript
const createDeal = async (outreachId, dealData) => {
  await supabase
    .from('deals_contracts')
    .insert({
      outreach_id: outreachId,
      campaign_id: dealData.campaignId,
      influencer_id: dealData.influencerId,
      brand_id: dealData.brandId,
      agreed_rate_amount: dealData.amount,
      agreed_rate_currency: dealData.currency,
      agreed_deliverables: dealData.deliverables,
      agreed_timeline: dealData.timeline,
    });
};
```

## React Query State Management

### 1. API Call Hooks

```javascript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useAIDraft = () => {
  return useMutation({
    mutationFn: async ({ campaignId, influencerId }) => {
      // Call OpenAI API as shown above
      return generateAIDraft(campaignId, influencerId);
    },
    onSuccess: (data) => {
      // Update local state or refetch queries
    },
  });
};

const useOutreachActivities = (filters) => {
  return useQuery({
    queryKey: ['outreach', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('outreach_activities')
        .select('*')
        .match(filters);
      return data;
    },
  });
};
```

### 2. Real-time Updates

```javascript
useEffect(() => {
  const channel = supabase
    .channel('outreach-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'outreach_activities',
    }, (payload) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries(['outreach']);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## Security Checklist for Production

- [ ] Move ALL API calls to backend/edge functions
- [ ] Implement proper authentication for API endpoints
- [ ] Use environment variables on server side only
- [ ] Set up CORS policies correctly
- [ ] Implement rate limiting
- [ ] Add request validation and sanitization
- [ ] Use HTTPS everywhere
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Regular security audits

## Development Workflow

1. **Start with UI**: Build components with loading states
2. **Mock API responses**: Use static data initially
3. **Add Supabase integration**: Connect to real database
4. **Implement external APIs**: Follow this guide for prototyping
5. **Security review**: Plan backend migration
6. **Production migration**: Move to secure backend implementation

---

**Remember**: This guide is for prototyping and learning purposes. Production applications require secure backend implementation for all external API integrations.
