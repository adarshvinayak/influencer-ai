
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { Target, Users, TrendingUp, DollarSign } from "lucide-react";
import ActiveOutreachCards from "@/components/ActiveOutreachCards";

const Summary = () => {
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { influencers, isLoading: influencersLoading } = useInfluencers({});
  const { outreachActivities, isLoading: outreachLoading } = useOutreachActivities();

  const activeCampaigns = campaigns?.filter(c => c.status === 'Active') || [];
  const totalInfluencers = influencers?.length || 0;
  const totalOutreach = outreachActivities?.length || 0;
  const activeOutreach = outreachActivities?.filter(o => o.status === 'In Progress')?.length || 0;

  const isLoading = campaignsLoading || influencersLoading || outreachLoading;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : activeCampaigns.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {campaigns?.length || 0} total campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalInfluencers}
            </div>
            <p className="text-xs text-muted-foreground">
              Available in network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Outreach</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : activeOutreach}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalOutreach} total outreach activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{campaigns?.reduce((total, campaign) => total + (campaign.budget_amount || 0), 0).toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Outreach Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Outreach</h2>
            <p className="text-muted-foreground">
              Monitor your ongoing influencer outreach activities
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {activeOutreach} Active
          </Badge>
        </div>
        
        <ActiveOutreachCards />
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recent Campaigns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns?.slice(0, 6).map((campaign) => (
            <Card key={campaign.campaign_id}>
              <CardHeader>
                <CardTitle className="text-lg">{campaign.campaign_name}</CardTitle>
                <CardDescription>{campaign.niche}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  {campaign.budget_amount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium">
                        ₹{campaign.budget_amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Platforms:</span>
                    <span className="font-medium">
                      {campaign.desired_platforms?.join(', ') || 'Not specified'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Target className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">No campaigns yet</p>
                <p className="text-sm text-gray-400 text-center mt-1">
                  Create your first campaign to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
