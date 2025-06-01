
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, MessageSquare, Mail, Users, Bot, AlertTriangle, Info, CheckCircle, DollarSign, FileText, Target, Rocket, PartyPopper, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import { useDealsContracts } from "@/hooks/useDealsContracts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useNotifications } from "@/hooks/useNotifications";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    campaign: "all",
    status: "all",
    method: "all"
  });
  const [selectedOutreach, setSelectedOutreach] = useState<any>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Fetch real data from database
  const { outreachActivities, isLoading: isLoadingOutreach } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});
  const { notifications, unreadCount } = useNotifications();
  const { communicationLogs } = useCommunicationLogs(selectedOutreach?.outreach_id);
  const { deals } = useDealsContracts();

  // Helper functions
  const getCampaignName = (campaignId: string) => {
    return campaigns?.find(c => c.campaign_id === campaignId)?.campaign_name || 'Unknown Campaign';
  };

  const getInfluencerName = (influencerId: string) => {
    return influencers?.find(i => i.influencer_id === influencerId)?.full_name || 'Unknown Influencer';
  };

  const getInfluencerHandle = (influencerId: string) => {
    return influencers?.find(i => i.influencer_id === influencerId)?.username_handle || '@unknown';
  };

  // Filter outreach data
  const filteredOutreach = outreachActivities?.filter(item => {
    if (filters.campaign !== "all" && item.campaign_id !== filters.campaign) return false;
    if (filters.status !== "all") {
      if (filters.status === "active" && !["AI Drafting", "AI Reaching Out", "Waiting for Response"].includes(item.status)) return false;
      if (filters.status === "positive" && !["Response - Positive Interest", "Negotiating"].includes(item.status)) return false;
      if (filters.status === "deals" && !["Deal Finalized", "Contract Signed"].includes(item.status)) return false;
      if (filters.status === "issues" && !["Issue: AI Needs Human Help"].includes(item.status)) return false;
    }
    if (filters.method !== "all" && item.outreach_method !== filters.method) return false;
    return true;
  }) || [];

  // Categorize data for dashboard sections
  const activeCampaigns = outreachActivities?.filter(item => 
    ["AI Drafting", "AI Reaching Out", "Waiting for Response", "Response - Positive Interest", "Negotiating"].includes(item.status)
  ) || [];

  const attentionRequired = outreachActivities?.filter(item => 
    ["Issue: AI Needs Human Help"].includes(item.status)
  ) || [];

  const recentSuccesses = outreachActivities?.filter(item => 
    ["Deal Finalized", "Contract Signed"].includes(item.status)
  ) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "AI Drafting": { color: "bg-blue-100 text-blue-800", text: "AI Drafting (GPT-4)" },
      "AI Reaching Out": { color: "bg-blue-100 text-blue-800", text: "AI Reaching Out" },
      "Waiting for Response": { color: "bg-yellow-100 text-yellow-800", text: "Waiting for Response" },
      "Response - Positive Interest": { color: "bg-green-100 text-green-800", text: "Response - Positive Interest" },
      "Negotiating": { color: "bg-orange-100 text-orange-800", text: "Negotiating (AI GPT-4)" },
      "Deal Finalized": { color: "bg-green-100 text-green-800", text: "Deal Finalized" },
      "Contract Sent": { color: "bg-green-100 text-green-800", text: "Contract Sent (E-Sign)" },
      "Contract Signed": { color: "bg-green-100 text-green-800", text: "Contract Signed" },
      "Payment Processed": { color: "bg-green-100 text-green-800", text: "Payment Processed" },
      "Response - Not Interested": { color: "bg-red-100 text-red-800", text: "Response - Not Interested" },
      "Issue: AI Needs Human Help": { color: "bg-red-100 text-red-800", text: "Issue: AI Needs Human Help" }
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

  const handleViewProgress = (outreach: any) => {
    setSelectedOutreach(outreach);
    setShowProgressModal(true);
  };

  if (isLoadingOutreach) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading dashboard data...</p>
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor AI-driven outreach progress and manage all campaigns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/app/notifications">
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-blue-500" />
              Active Outreach
            </CardTitle>
            <CardDescription>Campaigns with ongoing AI outreach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCampaigns.length}</div>
            <p className="text-sm text-gray-600">Influencers in active outreach</p>
            <div className="mt-4 space-y-2">
              {activeCampaigns.slice(0, 2).map((item) => (
                <div key={item.outreach_id} className="text-xs p-2 bg-blue-50 rounded">
                  <span className="font-medium">{getCampaignName(item.campaign_id)}</span> - {getInfluencerName(item.influencer_id)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attention Required */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Attention Required
            </CardTitle>
            <CardDescription>Issues needing human intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{attentionRequired.length}</div>
            <p className="text-sm text-gray-600">Items need your attention</p>
            <div className="mt-4 space-y-2">
              {attentionRequired.slice(0, 2).map((item) => (
                <div key={item.outreach_id} className="text-xs p-2 bg-orange-50 rounded">
                  <span className="font-medium">{item.status}</span> - {getCampaignName(item.campaign_id)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Successes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-green-500" />
              Recent Successes
            </CardTitle>
            <CardDescription>Finalized deals and contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{recentSuccesses.length}</div>
            <p className="text-sm text-gray-600">Deals finalized this week</p>
            <div className="mt-4 space-y-2">
              {recentSuccesses.slice(0, 2).map((item) => (
                <div key={item.outreach_id} className="text-xs p-2 bg-green-50 rounded">
                  <span className="font-medium">{getCampaignName(item.campaign_id)}</span> - {getInfluencerName(item.influencer_id)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.campaign} onValueChange={(value) => setFilters({...filters, campaign: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns?.map((campaign) => (
                  <SelectItem key={campaign.campaign_id} value={campaign.campaign_id}>
                    {campaign.campaign_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Outreach</SelectItem>
                <SelectItem value="positive">Positive Responses</SelectItem>
                <SelectItem value="deals">Finalized Deals</SelectItem>
                <SelectItem value="issues">Needs Attention</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.method} onValueChange={(value) => setFilters({...filters, method: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button onClick={() => {}} variant="outline">Apply Filters</Button>
              <Button variant="outline" onClick={() => setFilters({ campaign: "all", status: "all", method: "all" })}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Outreach Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>All Outreach Activities</CardTitle>
          <CardDescription>Complete history of AI outreach activities across all campaigns</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {filteredOutreach.length > 0 ? (
              filteredOutreach.map((outreach) => (
                <Card key={outreach.outreach_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{getInfluencerName(outreach.influencer_id)}</h3>
                              <p className="text-sm text-gray-600">{getInfluencerHandle(outreach.influencer_id)}</p>
                            </div>
                            
                            <div>
                              <p className="font-medium text-blue-600">{getCampaignName(outreach.campaign_id)}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                {getMethodIcon(outreach.outreach_method)}
                                <span>{outreach.ai_agent_name || 'AI Agent'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(outreach.status)}
                            <span className="text-sm text-gray-500">
                              Updated {new Date(outreach.last_updated_status_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleViewProgress(outreach)}
                        >
                          View Full Progress & Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No outreach activities found</h3>
                <p className="text-gray-600">Start creating campaigns and initiating outreach to see activity here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Progress: {selectedOutreach && getInfluencerName(selectedOutreach.influencer_id)} for '{selectedOutreach && getCampaignName(selectedOutreach.campaign_id)}'
            </DialogTitle>
            <DialogDescription>
              Detailed outreach progress and communication overview
            </DialogDescription>
          </DialogHeader>

          {selectedOutreach && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Current Status</h4>
                <div className="flex items-center space-x-4 mb-2">
                  {getStatusBadge(selectedOutreach.status)}
                  <span className="text-sm text-gray-600">Method: {selectedOutreach.outreach_method}</span>
                  <span className="text-sm text-gray-600">Agent: {selectedOutreach.ai_agent_name || 'AI Agent'}</span>
                </div>
                {selectedOutreach.notes_and_alerts && (
                  <p className="text-sm text-gray-600 mt-2">Notes: {selectedOutreach.notes_and_alerts}</p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Recent Communication</h4>
                {communicationLogs && communicationLogs.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {communicationLogs.slice(0, 3).map((log) => (
                      <div key={log.log_id} className="flex space-x-3 text-sm">
                        <div className="flex-shrink-0">
                          {log.direction === 'outbound' && <Bot className="h-4 w-4 text-blue-500" />}
                          {log.direction === 'inbound' && <Users className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">
                            {log.direction === 'outbound' ? 'AI Agent' : 'Influencer'}
                          </span>
                          <span className="text-gray-500 ml-2">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                          {log.subject_or_summary && (
                            <p className="text-gray-600">{log.subject_or_summary}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No communication logs yet</p>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Link to={`/app/summary/${selectedOutreach.campaign_id}/${selectedOutreach.influencer_id}`}>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    Open Summary Page
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowProgressModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
