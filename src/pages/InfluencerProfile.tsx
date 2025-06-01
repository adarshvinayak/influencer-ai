import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Instagram, Youtube, Users, PhoneCall, MessageSquare, Mail, CheckCircle, BrainCircuit, Languages, Bot, FileText, DollarSign, Play, Calendar, Clock, Phone, PhoneOff, Loader2, Sparkles } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useToast } from "@/hooks/use-toast";

const InfluencerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // AI Integration States
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState("");
  const [isPreparingCall, setIsPreparingCall] = useState(false);
  const [callScript, setCallScript] = useState("");
  const [callStatus, setCallStatus] = useState("not_prepared"); // not_prepared, prepared, calling, completed
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");
  const [isPreparingContract, setIsPreparingContract] = useState(false);
  const [contractStatus, setContractStatus] = useState("not_prepared"); // not_prepared, sent, viewed, signed
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const { campaigns } = useCampaigns();
  const { addOutreachActivity } = useOutreachActivities();

  // Mock influencer data - in a real app, this would come from the database
  const influencer = {
    id: 1,
    name: "Ananya 'Foodie Explorer' Joshi",
    handle: "@AnanyaEats",
    verified: true,
    profilePic: "/placeholder.svg",
    joinedDate: "Jan 2025",
    socialsSince: "2018",
    platforms: {
      instagram: { followers: "150k", avgLikes: "8.5k", avgComments: "420" },
      youtube: { subscribers: "95k", avgViews: "25k" }
    },
    totalFollowers: "360k+",
    engagementRate: "6.3%",
    location: "Pune, Maharashtra",
    niches: ["Indian Cuisine", "Street Food", "Travel Vlogging"],
    contentTypes: ["YouTube Recipe Videos", "Instagram Food Photography", "Engaging Reels"],
    availability: "Available Now",
    languages: ["English", "Marathi", "Hindi"],
    bio: "Food enthusiast exploring India's diverse culinary landscape. Sharing authentic recipes and hidden food gems across the country. Passionate about promoting local food culture and sustainable eating.",
    pastCollabs: [
      { brand: "Swiggy", campaign: "Weekend Feast - Reels", year: "2024" },
      { brand: "Zomato", campaign: "Street Food Stories", year: "2024" },
      { brand: "Organic Valley", campaign: "Farm Fresh Campaign", year: "2023" }
    ]
  };

  // AI Integration Functions - These will be manually implemented with external API calls
  const generateAIDraft = async () => {
    setIsGeneratingDraft(true);
    try {
      // TODO: Manual Implementation Required
      // 1. Fetch campaign details, influencer info, brand info from Supabase
      // 2. Construct GPT-4o prompt
      // 3. Make direct frontend call to OpenAI API (SECURITY WARNING: API key exposed)
      // 4. Update aiDraft state with response
      // 5. Save draft to communication_logs in Supabase
      
      // Mock delay for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiDraft(`Hi ${influencer.name}! 

Hope you're doing well! I'm reaching out on behalf of ${campaigns?.find(c => c.campaign_id === selectedCampaign)?.campaign_name || 'our brand'}.

We've been following your amazing content in the food space, particularly your street food explorations and authentic recipe videos. Your engagement with the community really stands out!

We'd love to collaborate with you on an exciting campaign that aligns perfectly with your content style. Would you be interested in a quick chat to discuss the details?

Looking forward to hearing from you!

Best regards,
AI Assistant`);
      
      toast({
        title: "AI Draft Generated!",
        description: "GPT-4o has created a personalized outreach draft."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const prepareAICall = async () => {
    setIsPreparingCall(true);
    try {
      // TODO: Manual Implementation Required
      // 1. Fetch data from Supabase for context
      // 2. Generate call script using GPT-4o API
      // 3. Store script in Supabase
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCallScript(`Call Script for ${influencer.name}:

1. Introduction: "Hi, this is Sam from [Brand Name]. I hope I'm not catching you at a bad time?"

2. Purpose: "I'm reaching out because we've been impressed by your food content, especially your street food series."

3. Opportunity: "We have an exciting collaboration opportunity that I think would be perfect for your audience."

4. Key Points:
   - Authentic brand alignment with food content
   - Flexible content creation timeline
   - Competitive compensation package
   - Creative freedom maintained

5. Next Steps: "Would you be interested in learning more? I can send over the details via email."

6. Closing: "Thank you for your time, and I look forward to potentially working together!"`);
      
      setCallStatus("prepared");
      toast({
        title: "Call Script Ready!",
        description: "AI has prepared a personalized call script."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare call script.",
        variant: "destructive"
      });
    } finally {
      setIsPreparingCall(false);
    }
  };

  const initiateAICall = async () => {
    setCallStatus("calling");
    try {
      // TODO: Manual Implementation Required - MAJOR LIMITATIONS
      // Note: Direct PSTN calling from frontend is not feasible
      // This would require ElevenLabs + telephony backend
      // For prototype: Only TTS playback simulation possible
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCallStatus("completed");
      toast({
        title: "Call Simulation Complete",
        description: "In production, this would initiate a real AI voice call."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Call simulation failed.",
        variant: "destructive"
      });
      setCallStatus("prepared");
    }
  };

  const analyzeTranscript = async () => {
    if (!manualTranscript.trim()) {
      toast({
        title: "No Transcript",
        description: "Please paste a transcript to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: Manual Implementation Required
      // 1. Send transcript to GPT-4o for analysis
      // 2. Get structured response with sentiment, next steps, etc.
      // 3. Update outreach status in Supabase
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiAnalysis(`Call Analysis by GPT-4o:

**Sentiment**: Positive - Influencer showed genuine interest
**Key Points Discussed**:
- Budget expectations align with our range
- Available for content creation in next 2 weeks
- Prefers creative freedom in content approach

**Recommended Next Steps**:
1. Send formal proposal within 24 hours
2. Include 3 content concept options
3. Schedule follow-up call for next week

**Probability of Conversion**: 78% - High likelihood based on engagement level`);
      
      toast({
        title: "Analysis Complete",
        description: "GPT-4o has analyzed the call transcript."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze transcript.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const prepareContract = async () => {
    setIsPreparingContract(true);
    try {
      // TODO: Manual Implementation Required - SECURITY CONCERNS
      // DocuSign envelope creation requires backend for security
      // Frontend can only simulate or use pre-created templates
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setContractStatus("sent");
      toast({
        title: "Contract Prepared",
        description: "DocuSign envelope has been sent to the influencer."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare contract.",
        variant: "destructive"
      });
    } finally {
      setIsPreparingContract(false);
    }
  };

  const initiatePayment = async () => {
    setIsInitiatingPayment(true);
    try {
      // TODO: Manual Implementation Required - BACKEND REQUIRED
      // Razorpay order creation must happen on backend
      // Frontend can only handle checkout flow with pre-created order_id
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Payment Initiated",
        description: "Razorpay checkout will open in production."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment.",
        variant: "destructive"
      });
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handleOutreachSubmit = async () => {
    if (!selectedCampaign || !selectedMethod) return;
    
    try {
      const outreachData = {
        campaign_id: selectedCampaign,
        influencer_id: id || 'mock-influencer-id',
        outreach_method: selectedMethod,
        ai_agent_name: selectedMethod === 'phone' ? 'Sam (Voice)' : 'Eva (Chat/Email)',
        status: 'AI Drafting' as const,
        notes_and_alerts: `AI outreach initiated for ${influencer.name} via ${selectedMethod}`
      };
      
      addOutreachActivity(outreachData);
      
      toast({
        title: "AI Outreach Initiated!",
        description: `AI agents are now reaching out to ${influencer.name} for your campaign.`
      });
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating outreach activity:', error);
      toast({
        title: "Error",
        description: "Failed to initiate outreach. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTrackOnSummaryPage = () => {
    navigate(`/app/summary/${selectedCampaign}/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{influencer.name}</h1>
                {influencer.verified && <CheckCircle className="h-6 w-6 text-blue-500" />}
              </div>
              <h3 className="text-xl text-gray-600 mb-4">{influencer.handle}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Active Since:</span>
                  <p>Joined: {influencer.joinedDate} | Socials: {influencer.socialsSince}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{influencer.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Followers:</span>
                  <p className="font-semibold">{influencer.totalFollowers}</p>
                </div>
                <div>
                  <span className="text-gray-500">Avg. Engagement:</span>
                  <p className="font-semibold">{influencer.engagementRate}</p>
                  <span className="text-xs text-gray-400">(Mock calc. - Live API WIP)</span>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Initiate AI Outreach
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-teal-500" />
                    AI-Powered Outreach to {influencer.name}
                  </DialogTitle>
                  <DialogDescription>
                    Our AI will handle personalized outreach with advanced integrations
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="setup" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="setup">Setup</TabsTrigger>
                    <TabsTrigger value="email">Email AI</TabsTrigger>
                    <TabsTrigger value="call">Voice AI</TabsTrigger>
                    <TabsTrigger value="contracts">Contracts & Payment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="setup" className="space-y-6 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Choose campaign for outreach: *</label>
                      <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          {campaigns?.map(campaign => (
                            <SelectItem key={campaign.campaign_id} value={campaign.campaign_id}>
                              {campaign.campaign_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Choose Outreach Method:</label>
                      <div className="grid gap-3">
                        <Card className={`cursor-pointer transition-colors ${selectedMethod === 'email' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedMethod('email')}>
                          <CardContent className="p-4 flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-purple-500" />
                            <div>
                              <h4 className="font-medium">Email with AI Draft</h4>
                              <p className="text-sm text-gray-600">GPT-4o drafts personalized emails, Gmail API sends them</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={`cursor-pointer transition-colors ${selectedMethod === 'phone' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedMethod('phone')}>
                          <CardContent className="p-4 flex items-center space-x-3">
                            <PhoneCall className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">AI Voice Call</h4>
                              <p className="text-sm text-gray-600">ElevenLabs voice AI makes personalized calls with GPT-4o intelligence</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={`cursor-pointer transition-colors ${selectedMethod === 'chat' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedMethod('chat')}>
                          <CardContent className="p-4 flex items-center space-x-3">
                            <MessageSquare className="h-5 w-5 text-green-500" />
                            <div>
                              <h4 className="font-medium">Chat/DM</h4>
                              <p className="text-sm text-gray-600">AI handles WhatsApp/Instagram DM conversations</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-teal-500 hover:bg-teal-600" 
                      disabled={!selectedCampaign || !selectedMethod} 
                      onClick={handleOutreachSubmit}
                    >
                      Initialize AI Outreach
                    </Button>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-6 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Email Outreach with GPT-4o</h3>
                        <Button
                          onClick={generateAIDraft}
                          disabled={isGeneratingDraft || !selectedCampaign}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {isGeneratingDraft ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              GPT-4o Drafting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate AI Draft
                            </>
                          )}
                        </Button>
                      </div>

                      {aiDraft && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">AI-Generated Email Draft:</label>
                            <Textarea
                              value={aiDraft}
                              onChange={(e) => setAiDraft(e.target.value)}
                              className="min-h-[200px]"
                              placeholder="AI draft will appear here..."
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button className="bg-green-500 hover:bg-green-600">
                              <Mail className="h-4 w-4 mr-2" />
                              Send via Gmail API
                            </Button>
                            <Button variant="outline">
                              Save Draft
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h4 className="font-medium text-amber-800 mb-2">Integration Requirements:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• OpenAI API for GPT-4o email drafting</li>
                          <li>• Gmail API with OAuth 2.0 for sending</li>
                          <li>• Client-side implementation (security concerns noted)</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="call" className="space-y-6 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">AI Voice Call System</h3>
                        <Badge variant={callStatus === 'completed' ? 'default' : 'secondary'}>
                          {callStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      {callStatus === 'not_prepared' && (
                        <Button
                          onClick={prepareAICall}
                          disabled={isPreparingCall || !selectedCampaign}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {isPreparingCall ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Preparing Call Script...
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Prepare & Schedule AI Call
                            </>
                          )}
                        </Button>
                      )}

                      {callScript && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">AI-Generated Call Script:</label>
                            <Textarea
                              value={callScript}
                              readOnly
                              className="min-h-[200px]"
                            />
                          </div>

                          {callStatus === 'prepared' && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={initiateAICall}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call Now
                              </Button>
                              <Button variant="outline">
                                <Clock className="h-4 w-4 mr-2" />
                                Reschedule
                              </Button>
                              <Button variant="destructive">
                                <PhoneOff className="h-4 w-4 mr-2" />
                                Cancel Call
                              </Button>
                            </div>
                          )}

                          {callStatus === 'calling' && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center">
                                <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-500" />
                                <span className="text-blue-700">AI is currently calling {influencer.name}...</span>
                              </div>
                            </div>
                          )}

                          {callStatus === 'completed' && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Call Transcript (Paste manually for prototype):</label>
                                <Textarea
                                  value={manualTranscript}
                                  onChange={(e) => setManualTranscript(e.target.value)}
                                  placeholder="Paste call transcript here for AI analysis..."
                                  className="min-h-[150px]"
                                />
                              </div>

                              <Button
                                onClick={analyzeTranscript}
                                disabled={isAnalyzing || !manualTranscript.trim()}
                                className="bg-purple-500 hover:bg-purple-600"
                              >
                                {isAnalyzing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    GPT-4o Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-4 w-4 mr-2" />
                                    Analyze with GPT-4o
                                  </>
                                )}
                              </Button>

                              {aiAnalysis && (
                                <div className="p-4 bg-gray-50 border rounded-lg">
                                  <h4 className="font-medium mb-2">AI Call Analysis:</h4>
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{aiAnalysis}</pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Implementation Limitations:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Real PSTN calling requires backend telephony infrastructure</li>
                          <li>• ElevenLabs TTS can only simulate voice, not make calls from frontend</li>
                          <li>• Transcript generation needs real call integration</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contracts" className="space-y-6 py-4">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Contract Management</h3>
                          <Badge variant={contractStatus === 'signed' ? 'default' : 'secondary'}>
                            {contractStatus.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>

                        <Button
                          onClick={prepareContract}
                          disabled={isPreparingContract}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          {isPreparingContract ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Preparing Contract...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Prepare Contract for E-Signature
                            </>
                          )}
                        </Button>

                        {contractStatus !== 'not_prepared' && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">DocuSign Integration Status:</h4>
                            <p className="text-sm text-green-700">
                              Contract status: {contractStatus.replace('_', ' ')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment Processing</h3>
                        
                        <Button
                          onClick={initiatePayment}
                          disabled={isInitiatingPayment}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {isInitiatingPayment ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Initiating Payment...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Proceed to Payment (Razorpay)
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h4 className="font-medium text-amber-800 mb-2">Security & Implementation Notes:</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• DocuSign envelope creation requires secure backend</li>
                          <li>• Razorpay order creation must happen server-side</li>
                          <li>• Payment verification requires backend API</li>
                          <li>• Frontend can only handle checkout flow with pre-created order_id</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Metrics</CardTitle>
              <CardDescription>Detailed social media statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Instagram</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{influencer.platforms.instagram.followers}</p>
                  <p className="text-sm text-gray-500">
                    Avg: {influencer.platforms.instagram.avgLikes} likes, {influencer.platforms.instagram.avgComments} comments
                  </p>
                  <p className="text-xs text-gray-400">(Mock - Live API WIP)</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <span className="font-medium">YouTube</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{influencer.platforms.youtube.subscribers}</p>
                  <p className="text-sm text-gray-500">Avg: {influencer.platforms.youtube.avgViews} views</p>
                  <p className="text-xs text-gray-400">(Mock - Live API WIP)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Primary Niches</h4>
                <div className="flex flex-wrap gap-2">
                  {influencer.niches.map((niche, index) => (
                    <Badge key={index} variant="secondary">{niche}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Content Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {influencer.contentTypes.map((type, index) => (
                    <li key={index}>• {type}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  Preferred Communication Languages
                </h4>
                <p className="text-sm text-gray-600">{influencer.languages.join(", ")}</p>
                <p className="text-xs text-teal-600 mt-1">Our AI supports multilingual outreach via DeepL/Google Translate!</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {influencer.availability}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">About</h4>
                <p className="text-sm text-gray-600">{influencer.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Brand Collaborations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencer.pastCollabs.map((collab, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{collab.brand[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{collab.brand}</h4>
                      <p className="text-sm text-gray-600">{collab.campaign}</p>
                      <p className="text-xs text-gray-500">{collab.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Detailed demographics via platform APIs coming soon!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Detailed demographics (age, gender, location, interests) via platform APIs coming soon! (WIP)</p>
                <p className="text-sm mt-2">Mock pie/bar charts for Age, Gender, Top Cities will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Content</CardTitle>
              <CardDescription>Portfolio showcase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Content {item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">Live content feed WIP</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              AI Outreach Initiated!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-gray-600 mb-4">
              🚀 Fantastic! Our AI agents are on it. We'll use {selectedMethod === 'phone' ? 'Phone Call' : selectedMethod === 'chat' ? 'Chat' : 'Email'} for {influencer.name} for '{campaigns?.find(c => c.campaign_id === selectedCampaign)?.campaign_name}'.
            </p>
            <div className="text-sm text-gray-500 space-y-1 mb-6">
              {selectedMethod === 'phone' && <p>• Voice AI uses ElevenLabs TTS & Whisper STT</p>}
              {(selectedMethod === 'email' || selectedMethod === 'chat') && <p>• GPT-4 crafts messages</p>}
              <p>• DeepL/Google Translate for multilingual needs if applicable</p>
            </div>
            <p className="text-sm text-gray-600">Track progress on 'Summary' page & 'Notifications'. Good luck!</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleTrackOnSummaryPage}>Track on Outreach Detail Page</Button>
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
              Discover More Influencers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfluencerProfile;
