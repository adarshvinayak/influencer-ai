import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneCall, MessageSquare, Mail, Users, Bot, AlertTriangle, ArrowLeft, BrainCircuit } from "lucide-react";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useUserBrand } from "@/hooks/useUserBrand";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import { useToast } from "@/hooks/use-toast";

const OutreachDetail = () => {
  const { outreachId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [aiScript, setAiScript] = useState("");

  const { outreachActivities, isLoading: isLoadingOutreach } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});
  const { userBrand } = useUserBrand();
  const outreach = outreachActivities?.find(item => item.outreach_id === outreachId);
  const { communicationLogs } = useCommunicationLogs(outreachId);

  const campaign = campaigns?.find(c => c.campaign_id === outreach?.campaign_id);
  const influencer = influencers?.find(i => i.influencer_id === outreach?.influencer_id);

  const generateAIScript = async () => {
    if (!outreach || !campaign || !influencer || !userBrand) {
      toast({
        title: "Missing Data",
        description: "Unable to generate script due to missing information.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingScript(true);
    try {
      // Construct the prompt for GPT-4o
      const prompt = `Create a professional ${outreach.outreach_method} script for an AI agent reaching out to an influencer.

Brand Details:
- Brand Name: ${userBrand.brand_name}
- Brand Description: ${userBrand.description || 'Professional brand'}
- Brand Industry: ${userBrand.industry || 'General'}

Campaign Details:
- Campaign Name: ${campaign.campaign_name}
- Description: ${campaign.description_brief || 'Exciting collaboration opportunity'}
- Target Platforms: ${campaign.desired_platforms?.join(', ') || 'Social Media'}
- Target Location: ${campaign.target_locations_india?.join(', ') || 'Various locations'}
- Budget: ${campaign.budget_amount ? `${campaign.budget_currency} ${campaign.budget_amount}` : 'Competitive budget'}
- Campaign Dates: ${campaign.start_date} to ${campaign.end_date}

Influencer Details:
- Name: ${influencer.full_name}
- Handle: ${influencer.username_handle || '@influencer'}
- Niche: ${influencer.primary_niches?.join(', ') || 'Content Creator'}
- Location: ${influencer.location_city}, ${influencer.location_state_india}

Outreach Method: ${outreach.outreach_method}

${outreach.outreach_method === 'phone' ? 
  `Format the response as a call script starting with: "You are ${outreach.ai_agent_name || 'Sam'}, a friendly and professional AI voice agent from ${userBrand.brand_name}. Your primary goal is to speak to ${influencer.full_name} about the ${campaign.campaign_name} campaign..."` :
  outreach.outreach_method === 'email' ?
  `Format the response as an email with subject line and professional body content.` :
  `Format the response as a chat message script that's conversational and engaging.`
}

Make it personalized, professional, and compelling. Include specific details about why this collaboration would be mutually beneficial.`;

      // Note: This is a placeholder for the actual GPT-4o API call
      // In production, this would be implemented as a Supabase Edge Function
      console.log('GPT-4o Prompt:', prompt);
      
      // Mock response for now - replace with actual API call
      const mockScript = outreach.outreach_method === 'phone' ? 
        `You are ${outreach.ai_agent_name || 'Sam'}, a friendly and professional AI voice agent from ${userBrand.brand_name}. Your primary goal is to speak to ${influencer.full_name} about the ${campaign.campaign_name} campaign.

Hello ${influencer.full_name}! I hope you're having a great day. I'm calling from ${userBrand.brand_name} because we've been following your amazing work in ${influencer.primary_niches?.join(' and ') || 'content creation'}.

We have an exciting collaboration opportunity with our ${campaign.campaign_name} campaign that I think would be perfect for your audience. The campaign focuses on ${campaign.description_brief} and we're specifically looking for creators in ${campaign.target_locations_india?.join(', ')}.

Would you be interested in hearing more about this partnership opportunity?` :
        `Subject: Exciting Collaboration Opportunity - ${campaign.campaign_name}

Dear ${influencer.full_name},

I hope this email finds you well! I'm reaching out from ${userBrand.brand_name} because we've been impressed by your content in the ${influencer.primary_niches?.join(' and ') || 'content creation'} space.

We're launching our ${campaign.campaign_name} campaign and believe your authentic voice and engaged audience would be a perfect fit for this collaboration.

Campaign Overview:
- ${campaign.description_brief}
- Target Platforms: ${campaign.desired_platforms?.join(', ') || 'Social Media'}
- Timeline: ${campaign.start_date} to ${campaign.end_date}
- Competitive compensation package

We'd love to discuss this opportunity further. Are you available for a brief call this week?

Best regards,
${userBrand.brand_name} Team`;

      setAiScript(mockScript);
      toast({
        title: "Script Generated!",
        description: "AI has generated a personalized outreach script."
      });
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "AI Drafting": { color: "bg-blue-100 text-blue-800", text: "AI Drafting" },
      "AI Reaching Out": { color: "bg-blue-100 text-blue-800", text: "AI Reaching Out" },
      "Waiting for Response": { color: "bg-yellow-100 text-yellow-800", text: "Waiting for Response" },
      "Response - Positive Interest": { color: "bg-green-100 text-green-800", text: "Positive Response" },
      "Negotiating": { color: "bg-orange-100 text-orange-800", text: "Negotiating" },
      "Deal Finalized": { color: "bg-green-100 text-green-800", text: "Deal Finalized" },
      "Issue: AI Needs Human Help": { color: "bg-red-100 text-red-800", text: "Needs Attention" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Waiting for Response"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "phone": return <PhoneCall className="h-5 w-5" />;
      case "chat": return <MessageSquare className="h-5 w-5" />;
      case "email": return <Mail className="h-5 w-5" />;
      default: return <Mail className="h-5 w-5" />;
    }
  };

  if (isLoadingOutreach || !outreach) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Outreach Details</h1>
            <p className="text-gray-600">
              {influencer?.full_name} × {campaign?.campaign_name}
            </p>
          </div>
        </div>
        {getStatusBadge(outreach.status)}
      </div>

      {/* Outreach Overview */}
      <Card className="border-2 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            {getMethodIcon(outreach.outreach_method)}
            <span className="ml-2">
              {outreach.outreach_method === 'phone' ? 'Phone Call' : 
               outreach.outreach_method === 'email' ? 'Email' : 'Chat'} Outreach
            </span>
          </CardTitle>
          <CardDescription>
            AI Agent: {outreach.ai_agent_name || 'AI Assistant'} • 
            Initiated: {new Date(outreach.initiated_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Influencer</h4>
              <p className="text-sm text-gray-600">{influencer?.full_name}</p>
              <p className="text-sm text-gray-500">{influencer?.username_handle}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Campaign</h4>
              <p className="text-sm text-gray-600">{campaign?.campaign_name}</p>
              <p className="text-sm text-gray-500">{campaign?.desired_platforms?.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Status</h4>
              <p className="text-sm text-gray-600">{outreach.status}</p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(outreach.last_updated_status_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Script Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-teal-500" />
            AI-Generated Script
          </CardTitle>
          <CardDescription>
            Generate personalized outreach script using GPT-4o
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={generateAIScript} 
              disabled={isGeneratingScript}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isGeneratingScript ? "Generating..." : "Generate AI Script"}
            </Button>
            
            {aiScript && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Generated Script:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{aiScript}</pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="alerts">AI Alerts</TabsTrigger>
          <TabsTrigger value="details">Campaign Details</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-teal-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Outreach Initiated</p>
                    <p className="text-sm text-gray-500">{new Date(outreach.initiated_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Current Status: {outreach.status}</p>
                    <p className="text-sm text-gray-500">{new Date(outreach.last_updated_status_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {communicationLogs && communicationLogs.length > 0 ? (
                  communicationLogs.map((log) => (
                    <div key={log.log_id} className="flex space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {log.direction === 'outbound' && <Bot className="h-5 w-5 text-blue-500" />}
                        {log.direction === 'inbound' && <Users className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {log.direction === 'outbound' ? 'AI Agent' : 'Influencer'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {log.subject_or_summary && (
                          <p className="text-sm font-medium text-gray-700 mb-1">{log.subject_or_summary}</p>
                        )}
                        {log.content_transcript && (
                          <p className="text-sm text-gray-600">{log.content_transcript}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No communication logs available yet</p>
                    <p className="text-sm mt-2">Communication will appear here once the AI starts outreach</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                AI Alerts & Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outreach.status === "Issue: AI Needs Human Help" ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">AI Requires Human Intervention</p>
                  <p className="text-red-600 text-sm mt-1">
                    {outreach.notes_and_alerts || "The AI has encountered an issue and needs manual review."}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No alerts or errors reported</p>
                  <p className="text-sm mt-2">AI is operating normally</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign Name</label>
                  <p className="text-gray-900">{campaign?.campaign_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{campaign?.description_brief}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Target Platforms</label>
                  <p className="text-gray-900">{campaign?.desired_platforms?.join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Budget</label>
                  <p className="text-gray-900">
                    {campaign?.budget_amount ? `${campaign.budget_currency} ${campaign.budget_amount}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Timeline</label>
                  <p className="text-gray-900">
                    {campaign?.start_date} to {campaign?.end_date}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Influencer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{influencer?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Handle</label>
                  <p className="text-gray-900">{influencer?.username_handle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Primary Niches</label>
                  <p className="text-gray-900">{influencer?.primary_niches?.join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">
                    {influencer?.location_city}, {influencer?.location_state_india}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Followers</label>
                  <p className="text-gray-900">{influencer?.overall_follower_count_estimate?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutreachDetail;
