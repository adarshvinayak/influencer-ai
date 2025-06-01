
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneCall, MessageSquare, Mail, Users, Bot, CheckCircle, FileText, Target, ArrowLeft } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import { useDealsContracts } from "@/hooks/useDealsContracts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";

const Summary = () => {
  const { campaignId, influencerId } = useParams();

  // Fetch real data from database
  const { outreachActivities, isLoading: isLoadingOutreach } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});

  // Find the specific outreach
  const specificOutreach = outreachActivities?.find(item => 
    item.campaign_id === campaignId && item.influencer_id === influencerId
  );

  // Use specific outreach communication logs
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

  if (isLoadingOutreach) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outreach Summary</h1>
          <p className="text-gray-600 mt-2">Loading outreach details...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (!specificOutreach) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/app/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Outreach Not Found</h1>
            <p className="text-gray-600 mt-2">The requested outreach could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const deal = deals?.find(d => d.outreach_id === specificOutreach.outreach_id);
  
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <Link to="/app/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Outreach Summary: {getInfluencerName(specificOutreach.influencer_id)} × {getCampaignName(specificOutreach.campaign_id)}
          </h1>
          <p className="text-gray-600 mt-2">Detailed progress tracking for this specific outreach</p>
        </div>
      </div>

      {/* Main Outreach Details Card */}
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

          {/* Outreach Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Outreach Method</p>
              <p className="text-lg">{specificOutreach.outreach_method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">AI Agent</p>
              <p className="text-lg">{specificOutreach.ai_agent_name || 'AI Agent'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-lg">{new Date(specificOutreach.last_updated_status_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Notes and Alerts */}
          {specificOutreach.notes_and_alerts && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Notes & Alerts</h4>
              <p className="text-yellow-700">{specificOutreach.notes_and_alerts}</p>
            </div>
          )}

          {/* Detailed Tabs */}
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress Timeline</TabsTrigger>
              <TabsTrigger value="communication">Communication Log</TabsTrigger>
              <TabsTrigger value="contract">Contract & Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Status Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-teal-500" />
                        <div>
                          <p className="font-medium">Status: {specificOutreach.status}</p>
                          <p className="text-sm text-gray-600">
                            Initiated on {new Date(specificOutreach.initiated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {specificOutreach.next_follow_up_at && (
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Next Follow-up Scheduled</p>
                            <p className="text-sm text-gray-600">
                              {new Date(specificOutreach.next_follow_up_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication History</CardTitle>
                  <CardDescription>Complete log of all interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {communicationLogs && communicationLogs.length > 0 ? (
                      communicationLogs.map((log) => (
                        <div key={log.log_id} className="flex space-x-3 p-4 border rounded-lg">
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
                              <Badge variant="outline" className="text-xs">
                                {log.channel}
                              </Badge>
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
                        <p className="text-sm">Logs will appear here once outreach begins</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contract" className="space-y-4 mt-6">
              {deal ? (
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
                        <p className="font-semibold text-lg">{deal.agreed_rate_amount} {deal.agreed_rate_currency}</p>
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
                    <div className="mt-6 pt-4 border-t">
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
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Contract Yet</h3>
                    <p className="text-gray-600">Contract details will appear here once deal is finalized</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
