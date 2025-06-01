
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, MessageSquare, Mail, Users, Bot, AlertTriangle, Info, CheckCircle, DollarSign, FileText, Target, Rocket, PartyPopper } from "lucide-react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import { useDealsContracts } from "@/hooks/useDealsContracts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";

const Summary = () => {
  const { campaignId, influencerId } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    campaign: "all",
    status: "all",
    method: "all"
  });

  // Fetch real data from database
  const { outreachActivities, isLoading: isLoadingOutreach } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});

  // Check if we should show specific outreach details
  const shouldShowSpecificOutreach = campaignId && influencerId;
  const specificOutreach = shouldShowSpecificOutreach 
    ? outreachActivities?.find(item => 
        item.campaign_id === campaignId && item.influencer_id === influencerId
      )
    : null;

  // Use specific outreach communication logs if viewing specific outreach
  const { communicationLogs } = useCommunicationLogs(specificOutreach?.outreach_id);
  const { dealsContracts } = useDealsContracts();

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
  const filteredOutreach = shouldShowSpecificOutreach && specificOutreach
    ? [specificOutreach]
    : outreachActivities?.filter(item => {
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

  if (isLoadingOutreach) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard & Outreach Summary</h1>
          <p className="text-gray-600 mt-2">Loading outreach data...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  // If showing specific outreach, display detailed view immediately
  if (shouldShowSpecificOutreach && specificOutreach) {
    const deal = dealsContracts?.find(d => d.outreach_id === specificOutreach.outreach_id);
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Outreach Progress: {getInfluencerName(specificOutreach.influencer_id)} × {getCampaignName(specificOutreach.campaign_id)}
          </h1>
          <p className="text-gray-600 mt-2">Detailed progress tracking for this specific outreach</p>
        </div>

        <Card className="border-2 border-teal-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{getInfluencerName(specificOutreach.influencer_id)}</h2>
                  <p className="text-gray-600">{getInfluencerHandle(specificOutreach.influencer_id)}</p>
                  <p className="text-sm text-teal-600 font-medium">Campaign: {getCampaignName(specificOutreach.campaign_id)}</p>
                </div>
              </div>
              {getStatusBadge(specificOutreach.status)}
            </div>

            <Tabs defaultValue="progress" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress">Progress Timeline</TabsTrigger>
                <TabsTrigger value="communication">Communication Log</TabsTrigger>
                <TabsTrigger value="contract">Contract & Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Current Status: {specificOutreach.status}</p>
                    <p className="text-sm mt-2">Method: {specificOutreach.outreach_method}</p>
                    {specificOutreach.ai_agent_name && (
                      <p className="text-sm">AI Agent: {specificOutreach.ai_agent_name}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4 mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {communicationLogs && communicationLogs.length > 0 ? (
                    communicationLogs.map((log) => (
                      <div key={log.log_id} className="flex space-x-3">
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
                            <p className="text-sm font-medium text-gray-700">{log.subject_or_summary}</p>
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
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contract" className="space-y-4 mt-6">
                {deal ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          Deal Confirmed!
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Agreed Rate</p>
                            <p className="font-semibold">{deal.agreed_rate_amount} {deal.agreed_rate_currency}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Deliverables</p>
                            <p className="font-semibold">{deal.agreed_deliverables}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Timeline</p>
                            <p className="font-semibold">{deal.agreed_timeline || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Contract Status</p>
                            <Badge className="bg-green-100 text-green-800">{deal.e_signature_status}</Badge>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          {deal.contract_document_url && (
                            <Button variant="outline" className="mr-2">
                              <FileText className="h-4 w-4 mr-2" />
                              View Contract
                            </Button>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {deal.e_signature_provider && `E-signed via ${deal.e_signature_provider}. `}
                            Deal finalized on {new Date(deal.deal_finalized_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Contract details will appear here once deal is finalized</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard & Outreach Summary</h1>
        <p className="text-gray-600 mt-2">Monitor AI-driven outreach progress and manage deals</p>
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
              <Button onClick={() => {
                // Filters are applied automatically via the filteredOutreach computation
              }}>Apply Filters</Button>
              <Button variant="outline" onClick={() => setFilters({ campaign: "all", status: "all", method: "all" })}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Outreach Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>All Outreach Activity Log</CardTitle>
          <CardDescription>Complete history of AI outreach activities</CardDescription>
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
                        <Link to={`/app/dashboard/${outreach.campaign_id}/${outreach.influencer_id}`}>
                          <Button variant="outline" size="sm">
                            View Summary Page
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">View Full Progress & Details</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Progress: {getInfluencerName(outreach.influencer_id)} for '{getCampaignName(outreach.campaign_id)}'</DialogTitle>
                              <DialogDescription>
                                Detailed outreach progress and communication log
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Current Status</h4>
                                <p className="text-sm text-gray-600">
                                  Status: {outreach.status} | Method: {outreach.outreach_method} | Agent: {outreach.ai_agent_name || 'AI Agent'}
                                </p>
                                {outreach.notes_and_alerts && (
                                  <p className="text-sm text-gray-600 mt-2">Notes: {outreach.notes_and_alerts}</p>
                                )}
                              </div>
                              
                              <div className="flex justify-center">
                                <Link to={`/app/dashboard/${outreach.campaign_id}/${outreach.influencer_id}`}>
                                  <Button className="bg-teal-500 hover:bg-teal-600">
                                    Open Dedicated Summary Page
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
    </div>
  );
};

export default Summary;
