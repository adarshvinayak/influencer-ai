
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, MessageSquare, Mail, Users, Bot, AlertTriangle, Info, CheckCircle, DollarSign, FileText } from "lucide-react";

const Summary = () => {
  const [filters, setFilters] = useState({
    campaign: "",
    status: "",
    method: ""
  });

  // Mock outreach data
  const mockOutreach = [
    {
      id: 1,
      influencer: { name: "Priya Singh", handle: "@StyleWithPriya", pic: "/placeholder.svg" },
      campaign: "Spring Fashion",
      method: "email",
      agent: "Eva (Chat/Email)",
      status: "response-positive",
      lastUpdated: "2 hours ago",
      details: {
        progress: ["AI Draft (GPT-4)", "Email Sent (SendGrid)", "Email Opened", "Replied"],
        currentStep: 3,
        log: [
          { time: "2024-06-01 10:00", type: "system", message: "AI Eva (GPT-4) drafted personalized email for Spring Fashion campaign" },
          { time: "2024-06-01 10:15", type: "system", message: "Email sent via SendGrid to priya.singh@email.com" },
          { time: "2024-06-01 14:30", type: "system", message: "Email opened by recipient" },
          { time: "2024-06-01 16:45", type: "influencer", message: "Hi! Love the campaign concept. I'm definitely interested. Can we discuss rates?" },
        ]
      }
    },
    {
      id: 2,
      influencer: { name: "Rohan Verma", handle: "@TechWithRohan", pic: "/placeholder.svg" },
      campaign: "Tech Gadget Reviews",
      method: "phone",
      agent: "Sam (Voice)",
      status: "negotiating",
      lastUpdated: "1 day ago",
      details: {
        progress: ["AI Call Scheduled", "Call Completed", "Follow-up", "Negotiating"],
        currentStep: 3,
        log: [
          { time: "2024-05-31 14:00", type: "system", message: "AI Sam scheduled call using ElevenLabs TTS & Whisper STT" },
          { time: "2024-05-31 15:30", type: "system", message: "15-minute call completed. Transcript available." },
          { time: "2024-05-31 15:45", type: "ai", message: "Sam (AI): Hi Rohan, thanks for taking the call. We'd love to collaborate on our Tech Gadget Reviews campaign..." },
          { time: "2024-05-31 15:47", type: "influencer", message: "Rohan: Sounds interesting! What's the budget range you're looking at?" },
        ]
      }
    },
    {
      id: 3,
      influencer: { name: "Ananya Joshi", handle: "@AnanyaEats", pic: "/placeholder.svg" },
      campaign: "Organic Food Fest",
      method: "chat",
      agent: "Eva (Chat/Email)",
      status: "deal-finalized",
      lastUpdated: "3 days ago",
      details: {
        progress: ["AI Outreach", "Positive Response", "Negotiation", "Deal Agreed", "Contract Sent", "Contract Signed", "Payment Processing"],
        currentStep: 6,
        log: [
          { time: "2024-05-29 09:00", type: "system", message: "AI Eva initiated chat via WhatsApp (mock)" },
          { time: "2024-05-29 11:30", type: "ai", message: "Eva (AI): Hi Ananya! We love your food content. Would you be interested in promoting our Organic Food Fest?" },
          { time: "2024-05-29 12:00", type: "influencer", message: "Ananya: Absolutely! Organic food is my passion. What are the details?" },
          { time: "2024-05-30 10:00", type: "system", message: "Deal finalized: 18k INR for 3 Instagram posts + 1 Reel" },
          { time: "2024-05-30 14:00", type: "system", message: "Contract sent for e-signature via DocuSign" },
          { time: "2024-05-30 16:30", type: "system", message: "Contract signed by both parties" },
        ]
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "ai-drafting": { color: "bg-blue-100 text-blue-800", text: "AI Drafting (GPT-4)" },
      "ai-reaching": { color: "bg-blue-100 text-blue-800", text: "AI Reaching Out" },
      "waiting-response": { color: "bg-yellow-100 text-yellow-800", text: "Waiting for Response" },
      "response-positive": { color: "bg-green-100 text-green-800", text: "Response - Positive Interest" },
      "negotiating": { color: "bg-orange-100 text-orange-800", text: "Negotiating (AI GPT-4)" },
      "deal-finalized": { color: "bg-green-100 text-green-800", text: "Deal Finalized" },
      "contract-sent": { color: "bg-green-100 text-green-800", text: "Contract Sent (E-Sign)" },
      "contract-signed": { color: "bg-green-100 text-green-800", text: "Contract Signed" },
      "payment-processed": { color: "bg-green-100 text-green-800", text: "Payment Processed" },
      "not-interested": { color: "bg-red-100 text-red-800", text: "Response - Not Interested" },
      "needs-help": { color: "bg-red-100 text-red-800", text: "Issue: AI Needs Human Help" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["waiting-response"];
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Outreach Summary & Deal Tracker</h1>
        <p className="text-gray-600 mt-2">Monitor AI-driven outreach progress and manage deals</p>
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
                <SelectItem value="">All Campaigns</SelectItem>
                <SelectItem value="spring-fashion">Spring Fashion</SelectItem>
                <SelectItem value="tech-reviews">Tech Gadget Reviews</SelectItem>
                <SelectItem value="organic-food">Organic Food Fest</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
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
                <SelectItem value="">All Methods</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button>Apply Filters</Button>
              <Button variant="outline">Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outreach List */}
      <div className="space-y-4">
        {mockOutreach.map((outreach) => (
          <Card key={outreach.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{outreach.influencer.name}</h3>
                        <p className="text-sm text-gray-600">{outreach.influencer.handle}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-blue-600">{outreach.campaign}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          {getMethodIcon(outreach.method)}
                          <span>{outreach.agent}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(outreach.status)}
                      <span className="text-sm text-gray-500">Updated {outreach.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Full Progress & Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Progress: {outreach.influencer.name} for '{outreach.campaign}'</DialogTitle>
                      <DialogDescription>
                        Detailed outreach progress and communication log
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="progress" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="progress">Progress Timeline</TabsTrigger>
                        <TabsTrigger value="communication">Communication Log</TabsTrigger>
                        <TabsTrigger value="contract">Contract & Payment</TabsTrigger>
                      </TabsList>

                      <TabsContent value="progress" className="space-y-4">
                        <div className="space-y-4">
                          {outreach.details.progress.map((step, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                index < outreach.details.currentStep 
                                  ? 'bg-green-500 text-white' 
                                  : index === outreach.details.currentStep 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-400'
                              }`}>
                                {index < outreach.details.currentStep ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  index <= outreach.details.currentStep ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {step}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="communication" className="space-y-4">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {outreach.details.log.map((entry, index) => (
                            <div key={index} className="flex space-x-3">
                              <div className="flex-shrink-0">
                                {entry.type === 'system' && <Bot className="h-5 w-5 text-blue-500" />}
                                {entry.type === 'ai' && <Bot className="h-5 w-5 text-purple-500" />}
                                {entry.type === 'influencer' && <Users className="h-5 w-5 text-green-500" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {entry.type === 'system' ? 'System' : 
                                     entry.type === 'ai' ? 'AI Agent' : 'Influencer'}
                                  </span>
                                  <span className="text-xs text-gray-500">{entry.time}</span>
                                </div>
                                <p className="text-sm text-gray-600">{entry.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="contract" className="space-y-4">
                        {outreach.status === 'deal-finalized' ? (
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
                                    <p className="font-semibold">18,000 INR</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Deliverables</p>
                                    <p className="font-semibold">3 Instagram Posts + 1 Reel</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Timeline</p>
                                    <p className="font-semibold">2 weeks</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Contract Status</p>
                                    <Badge className="bg-green-100 text-green-800">Signed</Badge>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                  <Button variant="outline" className="mr-2">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Signed Contract
                                  </Button>
                                  <p className="text-xs text-gray-500 mt-2">
                                    E-signed via Influencer-AI E-Sign (DocuSign/Native). Audit trail available.
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
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Action Required & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Critical: Budget Exceeded</h4>
                <p className="text-sm text-red-700 mt-1">
                  Influencer Vikram's quote (25k INR) > budget (20k INR). AI GPT-4 negotiation failed. Human intervention strongly recommended.
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">Override Budget (mock)</Button>
                  <Button size="sm" variant="outline">Assign Human (mock)</Button>
                  <Button size="sm" variant="outline">Mark Lost</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">Attention: Legal Questions</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Influencer Priya asked legal questions AI Sam can't answer. Human follow-up needed.
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">View Question</Button>
                  <Button size="sm" variant="outline">Mark Resolved</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800">Info: Scheduled Follow-up</h4>
                <p className="text-sm text-blue-700 mt-1">
                  AI Eva scheduled follow-up call with Ananya for June 5th, 2:00 PM.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
