
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Clock, Mail, Phone, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const ActiveOutreachCards = () => {
  const { outreachActivities, isLoading } = useOutreachActivities({
    status: "In Progress" // Only show active outreach
  });
  
  const { influencers } = useInfluencers({});
  const { campaigns } = useCampaigns();

  const getOutreachIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'dm': return <MessageSquare className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AI Drafting': return 'bg-blue-100 text-blue-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Follow-up Scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!outreachActivities || outreachActivities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">No active outreach activities</p>
          <p className="text-sm text-gray-400 text-center mt-1">
            Start new campaigns to see outreach activities here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {outreachActivities.map((outreach) => {
        const influencer = influencers?.find(inf => inf.influencer_id === outreach.influencer_id);
        const campaign = campaigns?.find(camp => camp.campaign_id === outreach.campaign_id);
        
        return (
          <Card key={outreach.outreach_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getOutreachIcon(outreach.outreach_method)}
                  <CardTitle className="text-lg">
                    {influencer?.full_name || 'Unknown Influencer'}
                  </CardTitle>
                </div>
                <Badge className={getStatusColor(outreach.status)}>
                  {outreach.status}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {campaign?.campaign_name || 'Unknown Campaign'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="font-medium capitalize">{outreach.outreach_method}</span>
              </div>
              
              {outreach.ai_agent_name && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">AI Agent:</span>
                  <span className="font-medium">{outreach.ai_agent_name}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(outreach.last_updated_status_at), { addSuffix: true })}
                </span>
              </div>

              {outreach.next_follow_up_at && (
                <div className="flex items-center space-x-2 text-sm bg-orange-50 p-2 rounded">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-700">
                    Follow-up: {formatDistanceToNow(new Date(outreach.next_follow_up_at), { addSuffix: true })}
                  </span>
                </div>
              )}

              {outreach.notes_and_alerts && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <p className="font-medium">Notes:</p>
                  <p className="mt-1">{outreach.notes_and_alerts}</p>
                </div>
              )}

              <div className="pt-2">
                <Link to={`/app/influencers/${outreach.influencer_id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveOutreachCards;
