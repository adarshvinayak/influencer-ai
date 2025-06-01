
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OutreachActivity } from "@/hooks/useOutreachActivities";

interface AIScriptGeneratorProps {
  outreach: OutreachActivity;
  influencer?: any;
  campaign?: any;
  userBrand?: any;
}

const AIScriptGenerator = ({ outreach, influencer, campaign, userBrand }: AIScriptGeneratorProps) => {
  const { toast } = useToast();
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [aiScript, setAiScript] = useState("");

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

      console.log('GPT-4o Prompt:', prompt);
      
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

  return (
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
  );
};

export default AIScriptGenerator;
