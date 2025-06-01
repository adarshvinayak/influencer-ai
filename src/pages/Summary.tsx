
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, MessageSquare, Mail, Users, Bot, AlertTriangle, Info, CheckCircle, DollarSign, FileText, Target, Rocket, PartyPopper, Filter } from "lucide-react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import { useDealsContracts } from "@/hooks/useDealsContracts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import ActiveOutreachCards from "@/components/ActiveOutreachCards";

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
              <p className="text-gray-600 mt-2">Loading outreach data...</p>
            </div>
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If showing specific outreach, display detailed view immediately
  if (shouldShowSpecificOutreach && specificOutreach) {
    const deal = deals?.find(d => d.outreach_id === specificOutreach.outreach_id);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Outreach Progress: {getInfluencerName(specificOutreach.influencer_id)} × {getCampaignName(specificOutreach.campaign_id)}
              </h1>
              <p className="text-gray-600">Detailed progress tracking for this specific outreach</p>
            </div>

            {/* Main Content Card */}
            <Card className="border-2 border-teal-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{getInfluencerName(specificOutreach.influencer_id)}</h2>
                      <p className="text-gray-600 text-lg">{getInfluencerHandle(specificOutreach.influencer_id)}</p>
                      <p className="text-sm text-teal-600 font-medium mt-1">Campaign: {getCampaignName(specificOutreach.campaign_id)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(specificOutreach.status)}
                  </div>
                </div>

                <Tabs defaultValue="progress" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="progress" className="text-sm font-medium">Progress Timeline</TabsTrigger>
                    <TabsTrigger value="communication" className="text-sm font-medium">Communication Log</TabsTrigger>
                    <TabsTrigger value="contract" className="text-sm font-medium">Contract & Payment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="progress" className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-8">
                      <div className="text-center">
                        <Target className="h-16 w-16 mx-auto mb-4 text-teal-500" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Status</h3>
                        <p className="text-lg text-gray-700 mb-4">{specificOutreach.status}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Method</p>
                            <p className="text-lg text-gray-900 capitalize">{specificOutreach.outreach_method}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">AI Agent</p>
                            <p className="text-lg text-gray-900">{specificOutreach.ai_agent_name || 'AI Assistant'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                            <p className="text-lg text-gray-900">{new Date(specificOutreach.last_updated_status_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="communication" className="space-y-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-6">
                      {communicationLogs && communicationLogs.length > 0 ? (
                        communicationLogs.map((log) => (
                          <div key={log.log_id} className="flex space-x-4 bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex-shrink-0 mt-1">
                              {log.direction === 'outbound' && <Bot className="h-6 w-6 text-blue-500" />}
                              {log.direction === 'inbound' && <Users className="h-6 w-6 text-green-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  {log.direction === 'outbound' ? 'AI Agent' : 'Influencer'}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              {log.subject_or_summary && (
                                <p className="text-sm font-medium text-gray-800 mb-1">{log.subject_or_summary}</p>
                              )}
                              {log.content_transcript && (
                                <p className="text-sm text-gray-600">{log.content_transcript}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No communication logs yet</h3>
                          <p className="text-gray-600">Communication will appear here once the AI starts outreach</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="contract" className="space-y-6">
                    {deal ? (
                      <div className="space-y-6">
                        <Card className="border-green-200 bg-green-50">
                          <CardHeader>
                            <CardTitle className="flex items-center text-green-800">
                              <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                              Deal Confirmed!
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Agreed Rate</p>
                                  <p className="text-xl font-bold text-gray-900">{deal.agreed_rate_amount} {deal.agreed_rate_currency}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Deliverables</p>
                                  <p className="font-semibold text-gray-900">{deal.agreed_deliverables}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Timeline</p>
                                  <p className="font-semibold text-gray-900">{deal.agreed_timeline || 'Not specified'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Contract Status</p>
                                  <Badge className="bg-green-100 text-green-800">{deal.e_signature_status}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-green-200">
                              <div className="flex justify-between items-center">
                                {deal.contract_document_url && (
                                  <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Contract
                                  </Button>
                                )}
                                <p className="text-xs text-gray-600">
                                  {deal.e_signature_provider && `E-signed via ${deal.e_signature_provider}. `}
                                  Deal finalized on {new Date(deal.deal_finalized_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Contract details pending</h3>
                        <p className="text-gray-600">Contract details will appear here once deal is finalized</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Dashboard & Outreach Summary</h1>
            <p className="text-gray-600">Monitor AI-driven outreach progress and manage deals</p>
          </div>

          {/* Active Outreach Cards Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <ActiveOutreachCards />
          </div>

          {/* Analytics Overview Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Campaigns */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-800">
                    <Rocket className="h-5 w-5 mr-2 text-blue-600" />
                    Active Outreach
                  </CardTitle>
                  <CardDescription className="text-blue-600">Campaigns with ongoing AI outreach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 mb-2">{activeCampaigns.length}</div>
                  <p className="text-sm text-blue-600 mb-4">Influencers in active outreach</p>
                  <div className="space-y-2">
                    {activeCampaigns.slice(0, 2).map((item) => (
                      <div key={item.outreach_id} className="text-xs p-2 bg-blue-100 rounded border border-blue-200">
                        <span className="font-medium">{getCampaignName(item.campaign_id)}</span> - {getInfluencerName(item.influencer_id)}
                      </div>
                    ))}
                    {activeCampaigns.length > 2 && (
                      <p className="text-xs text-blue-600">+{activeCampaigns.length - 2} more</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Attention Required */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-orange-800">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Attention Required
                  </CardTitle>
                  <CardDescription className="text-orange-600">Issues needing human intervention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-700 mb-2">{attentionRequired.length}</div>
                  <p className="text-sm text-orange-600 mb-4">Items need your attention</p>
                  <div className="space-y-2">
                    {attentionRequired.slice(0, 2).map((item) => (
                      <div key={item.outreach_id} className="text-xs p-2 bg-orange-100 rounded border border-orange-200">
                        <span className="font-medium">{item.status}</span> - {getCampaignName(item.campaign_id)}
                      </div>
                    ))}
                    {attentionRequired.length === 0 && (
                      <p className="text-xs text-orange-600">All systems running smoothly</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Successes */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-800">
                    <PartyPopper className="h-5 w-5 mr-2 text-green-600" />
                    Recent Successes
                  </CardTitle>
                  <CardDescription className="text-green-600">Finalized deals and contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700 mb-2">{recentSuccesses.length}</div>
                  <p className="text-sm text-green-600 mb-4">Deals finalized this week</p>
                  <div className="space-y-2">
                    {recentSuccesses.slice(0, 2).map((item) => (
                      <div key={item.outreach_id} className="text-xs p-2 bg-green-100 rounded border border-green-200">
                        <span className="font-medium">{getCampaignName(item.campaign_id)}</span> - {getInfluencerName(item.influencer_id)}
                      </div>
                    ))}
                    {recentSuccesses.length === 0 && (
                      <p className="text-xs text-green-600">Keep up the great work!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Outreach Activities</h2>
            </div>
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
                <Button 
                  onClick={() => {
                    // Filters are applied automatically via the filteredOutreach computation
                  }}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ campaign: "all", status: "all", method: "all" })}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* All Outreach Activity Log */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Outreach Activity Log</h2>
              <p className="text-gray-600 mt-1">Complete history of AI outreach activities</p>
            </div>
            <div className="p-6">
              {filteredOutreach.length > 0 ? (
                <div className="space-y-4">
                  {filteredOutreach.map((outreach) => (
                    <Card key={outreach.outreach_id} className="hover:shadow-md transition-shadow border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="h-12 w-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-6 mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">{getInfluencerName(outreach.influencer_id)}</h3>
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

                          <div className="flex space-x-3">
                            <Link to={`/app/dashboard/${outreach.campaign_id}/${outreach.influencer_id}`}>
                              <Button variant="outline" size="sm" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                                View Summary
                              </Button>
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Details</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Progress: {getInfluencerName(outreach.influencer_id)} for '{getCampaignName(outreach.campaign_id)}'</DialogTitle>
                                  <DialogDescription>
                                    Detailed outreach progress and communication log for this specific campaign
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-3">Current Status Overview</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-medium">{outreach.status}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Method</p>
                                        <p className="font-medium capitalize">{outreach.outreach_method}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Agent</p>
                                        <p className="font-medium">{outreach.ai_agent_name || 'AI Agent'}</p>
                                      </div>
                                    </div>
                                    {outreach.notes_and_alerts && (
                                      <div className="mt-3">
                                        <p className="text-gray-500 text-sm">Notes</p>
                                        <p className="text-sm text-gray-700 bg-white p-2 rounded border">{outreach.notes_and_alerts}</p>
                                      </div>
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">No outreach activities found</h3>
                  <p className="text-gray-600">Start creating campaigns and initiating outreach to see activity here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
