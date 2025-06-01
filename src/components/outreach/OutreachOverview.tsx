
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MessageSquare, Mail } from "lucide-react";
import { OutreachActivity } from "@/hooks/useOutreachActivities";

interface OutreachOverviewProps {
  outreach: OutreachActivity;
  influencerName?: string;
  influencerHandle?: string;
  campaignName?: string;
  campaignPlatforms?: string[];
}

const OutreachOverview = ({ 
  outreach, 
  influencerName, 
  influencerHandle, 
  campaignName, 
  campaignPlatforms 
}: OutreachOverviewProps) => {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "phone": return <PhoneCall className="h-5 w-5" />;
      case "chat": return <MessageSquare className="h-5 w-5" />;
      case "email": return <Mail className="h-5 w-5" />;
      default: return <Mail className="h-5 w-5" />;
    }
  };

  return (
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
            <p className="text-sm text-gray-600">{influencerName}</p>
            <p className="text-sm text-gray-500">{influencerHandle}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Campaign</h4>
            <p className="text-sm text-gray-600">{campaignName}</p>
            <p className="text-sm text-gray-500">{campaignPlatforms?.join(', ')}</p>
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
  );
};

export default OutreachOverview;
