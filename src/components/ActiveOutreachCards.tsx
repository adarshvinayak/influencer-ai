
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneCall, MessageSquare, Mail, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";

const ActiveOutreachCards = () => {
  const navigate = useNavigate();
  const { outreachActivities, isLoading } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});

  // Filter for active outreach activities
  const activeOutreach = outreachActivities?.filter(item => 
    ["AI Drafting", "AI Reaching Out", "Waiting for Response", "Response - Positive Interest", "Negotiating"].includes(item.status)
  ) || [];

  const getCampaignName = (campaignId: string) => {
    return campaigns?.find(c => c.campaign_id === campaignId)?.campaign_name || 'Unknown Campaign';
  };

  const getInfluencerName = (influencerId: string) => {
    return influencers?.find(i => i.influencer_id === influencerId)?.full_name || 'Unknown Influencer';
  };

  const getInfluencerHandle = (influencerId: string) => {
    return influencers?.find(i => i.influencer_id === influencerId)?.username_handle || '@unknown';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "AI Drafting": { color: "bg-blue-100 text-blue-800", text: "AI Drafting" },
      "AI Reaching Out": { color: "bg-blue-100 text-blue-800", text: "AI Reaching Out" },
      "Waiting for Response": { color: "bg-yellow-100 text-yellow-800", text: "Waiting for Response" },
      "Response - Positive Interest": { color: "bg-green-100 text-green-800", text: "Positive Response" },
      "Negotiating": { color: "bg-orange-100 text-orange-800", text: "Negotiating" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Waiting for Response"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "phone": return <PhoneCall className="h-4 w-4" />;
      case "chat": return <MessageSquare className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (outreachId: string) => {
    navigate(`/app/outreach/${outreachId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Outreach</CardTitle>
          <CardDescription>Loading active outreach activities...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Active Outreach</h2>
        <Badge variant="outline">{activeOutreach.length} active</Badge>
      </div>
      
      {activeOutreach.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOutreach.map((outreach) => (
            <Card key={outreach.outreach_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getMethodIcon(outreach.outreach_method)}
                    <span className="text-sm font-medium capitalize">
                      {outreach.outreach_method}
                    </span>
                  </div>
                  {getStatusBadge(outreach.status)}
                </div>
                <CardTitle className="text-lg">{getInfluencerName(outreach.influencer_id)}</CardTitle>
                <CardDescription>
                  {getInfluencerHandle(outreach.influencer_id)} • {getCampaignName(outreach.campaign_id)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>AI Agent: {outreach.ai_agent_name || 'AI Assistant'}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Initiated: {new Date(outreach.initiated_at).toLocaleDateString()}</p>
                    <p>Updated: {new Date(outreach.last_updated_status_at).toLocaleDateString()}</p>
                  </div>

                  {outreach.notes_and_alerts && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {outreach.notes_and_alerts}
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => handleViewDetails(outreach.outreach_id)}
                  >
                    Outreach Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Outreach</h3>
              <p className="text-gray-600">Start new campaigns to see active outreach activities here.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveOutreachCards;
