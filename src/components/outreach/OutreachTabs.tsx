
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, MessageSquare, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";
import { OutreachActivity } from "@/hooks/useOutreachActivities";
import { CommunicationLog } from "@/hooks/useCommunicationLogs";

interface OutreachTabsProps {
  outreach: OutreachActivity;
  communicationLogs?: CommunicationLog[];
  campaign?: any;
  influencer?: any;
}

const OutreachTabs = ({ outreach, communicationLogs, campaign, influencer }: OutreachTabsProps) => {
  const getStatusIcon = (status: string) => {
    switch (true) {
      case status.includes('Payment Link Sent'):
        return <DollarSign className="h-5 w-5 text-cyan-500" />;
      case status.includes('Contract Signed'):
      case status.includes('Deal Finalized'):
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case status.includes('Negotiation'):
        return <Clock className="h-5 w-5 text-orange-500" />;
      case status.includes('Positive'):
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case status.includes('AI Needs Human Help'):
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
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
                {getStatusIcon(outreach.status)}
                <div>
                  <p className="font-medium">Current Status: {outreach.status}</p>
                  <p className="text-sm text-gray-500">{new Date(outreach.last_updated_status_at).toLocaleString()}</p>
                  {outreach.next_follow_up_at && (
                    <p className="text-sm text-blue-600 mt-1">
                      Next follow-up: {new Date(outreach.next_follow_up_at).toLocaleString()}
                    </p>
                  )}
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
              AI Alerts & Status Updates
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
            ) : outreach.status.includes('Payment Link Sent') ? (
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <p className="text-cyan-800 font-medium">Payment Link Sent</p>
                <p className="text-cyan-600 text-sm mt-1">
                  {outreach.notes_and_alerts || "Payment link has been sent to the influencer. Awaiting payment confirmation."}
                </p>
              </div>
            ) : outreach.status.includes('Contract Signed') ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-800 font-medium">Contract Signed</p>
                <p className="text-emerald-600 text-sm mt-1">
                  {outreach.notes_and_alerts || "Contract has been signed. Campaign is ready to begin."}
                </p>
              </div>
            ) : outreach.status.includes('Deal Finalized') ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Deal Finalized</p>
                <p className="text-green-600 text-sm mt-1">
                  {outreach.notes_and_alerts || "Campaign successfully completed!"}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>AI is operating normally</p>
                <p className="text-sm mt-2">Current status: {outreach.status}</p>
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
  );
};

export default OutreachTabs;
