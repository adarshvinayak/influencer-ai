import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Instagram, Youtube, Users, PhoneCall, MessageSquare, Mail, CheckCircle, BrainCircuit, Languages } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useInfluencerById, usePlatformAccounts } from "@/hooks/useInfluencers";
import { useUserBrand } from "@/hooks/useUserBrand";
import { useToast } from "@/hooks/use-toast";

const InfluencerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOutreachId, setCreatedOutreachId] = useState("");
  const [isCreatingOutreach, setIsCreatingOutreach] = useState(false);

  const { campaigns } = useCampaigns();
  const { addOutreachActivityAsync } = useOutreachActivities();
  const { userBrand } = useUserBrand();
  const {
    influencer,
    isLoading: influencerLoading,
    error: influencerError
  } = useInfluencerById(id || '');
  const {
    platformAccounts,
    isLoading: platformsLoading
  } = usePlatformAccounts(id || '');

  // Mock data for sections not yet implemented with real data
  const mockData = {
    joinedDate: "Jan 2025",
    socialsSince: "2018",
    pastCollabs: [
      { brand: "Swiggy", campaign: "Weekend Feast - Reels", year: "2024" },
      { brand: "Zomato", campaign: "Street Food Stories", year: "2024" },
      { brand: "Organic Valley", campaign: "Farm Fresh Campaign", year: "2023" }
    ]
  };

  const handleOutreachSubmit = async () => {
    if (!selectedCampaign || !selectedMethod || !influencer || !userBrand) {
      toast({
        title: "Error",
        description: "Please select both campaign and outreach method.",
        variant: "destructive"
      });
      return;
    }

    const selectedCampaignData = campaigns?.find(c => c.campaign_id === selectedCampaign);
    
    setIsCreatingOutreach(true);
    
    try {
      console.log('Creating outreach with data:', {
        campaign_id: selectedCampaign,
        influencer_id: influencer.influencer_id,
        outreach_method: selectedMethod,
        influencerName: influencer.full_name,
        campaignName: selectedCampaignData?.campaign_name,
        brandName: userBrand.brand_name
      });

      const outreachData = {
        campaign_id: selectedCampaign,
        influencer_id: influencer.influencer_id,
        outreach_method: selectedMethod,
        ai_agent_name: selectedMethod === 'phone' ? 'Sam (Voice)' : 'Eva (Chat/Email)',
        status: 'AI Drafting' as const,
        notes_and_alerts: `AI outreach initiated for ${influencer.full_name} via ${selectedMethod}`,
        // Add the required fields for simulation (these won't be inserted into DB)
        influencerName: influencer.full_name,
        campaignName: selectedCampaignData?.campaign_name || 'Unknown Campaign',
        brandName: userBrand.brand_name || 'Unknown Brand'
      };

      // Use the async version to get the actual created outreach data
      const createdOutreach = await addOutreachActivityAsync(outreachData);
      
      // Store the real outreach ID
      setCreatedOutreachId(createdOutreach.outreach_id);
      
      toast({
        title: "AI Outreach Initiated!",
        description: `AI agents are now reaching out to ${influencer.full_name} for your campaign.${selectedMethod === 'phone' ? ' Call simulation will begin automatically.' : ''}`
      });
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating outreach activity:', error);
      toast({
        title: "Error",
        description: `Failed to initiate outreach: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsCreatingOutreach(false);
    }
  };

  const handleTrackOnOutreachPage = () => {
    if (createdOutreachId) {
      navigate(`/app/outreach/${createdOutreachId}`);
    } else {
      toast({
        title: "Error",
        description: "Unable to navigate to outreach page. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFollowerCount = (count?: number) => {
    if (!count) return "N/A";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  if (influencerLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (influencerError || !influencer) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Influencer not found</h3>
            <p className="text-gray-600 text-center max-w-md">
              The influencer profile you're looking for doesn't exist or couldn't be loaded.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
              {influencer.profile_picture_url ? (
                <img 
                  src={influencer.profile_picture_url} 
                  alt={influencer.full_name} 
                  className="h-24 w-24 rounded-full object-cover" 
                />
              ) : (
                <Users className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{influencer.full_name}</h1>
                {influencer.verification_status === 'Verified' && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <h3 className="text-xl text-gray-600 mb-4">{influencer.username_handle || 'No handle available'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Active Since:</span>
                  <p>Joined: {mockData.joinedDate} | Socials: {influencer.active_since_year || mockData.socialsSince}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>
                    {influencer.location_city && influencer.location_state_india 
                      ? `${influencer.location_city}, ${influencer.location_state_india}` 
                      : 'Location not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Total Followers:</span>
                  <p className="font-semibold">{formatFollowerCount(influencer.overall_follower_count_estimate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Avg. Engagement:</span>
                  <p className="font-semibold">
                    {influencer.average_engagement_rate_estimate ? `${influencer.average_engagement_rate_estimate}%` : 'N/A'}
                  </p>
                  <span className="text-xs text-gray-400">(From database)</span>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Initiate AI Outreach
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-teal-500" />
                    Initiate AI Outreach to {influencer.full_name}
                  </DialogTitle>
                  <DialogDescription>
                    Our AI will handle personalized outreach using the selected method and campaign details.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
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
                    <p className="text-xs text-gray-500 mt-1">AI uses this brief for personalization</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Choose Outreach Method:</label>
                    <div className="grid gap-3">
                      <Card 
                        className={`cursor-pointer transition-colors ${
                          selectedMethod === 'phone' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMethod('phone')}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <PhoneCall className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="font-medium">Phone Call</h4>
                            <p className="text-sm text-gray-600">Our Voice AI (ElevenLabs/Whisper) will call to discuss</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-colors ${
                          selectedMethod === 'chat' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMethod('chat')}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="font-medium">Chat (Mock)</h4>
                            <p className="text-sm text-gray-600">AI (GPT-4) will chat via preferred platform (WhatsApp/DM mock)</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-colors ${
                          selectedMethod === 'email' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMethod('email')}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-purple-500" />
                          <div>
                            <h4 className="font-medium">Email</h4>
                            <p className="text-sm text-gray-600">AI (GPT-4) will draft & send personalized email (SendGrid/Gmail API)</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {selectedCampaign && selectedMethod && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Review & Confirm:</h4>
                      <p className="text-sm text-gray-600">
                        Initiating {selectedMethod === 'phone' ? 'Phone Call' : selectedMethod === 'chat' ? 'Chat' : 'Email'} to {influencer.full_name} for '{campaigns?.find(c => c.campaign_id === selectedCampaign)?.campaign_name}'.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Mock AI-drafted message snippet will appear here (GPT-4).
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-teal-500 hover:bg-teal-600" 
                    disabled={!selectedCampaign || !selectedMethod || !userBrand || isCreatingOutreach} 
                    onClick={handleOutreachSubmit}
                  >
                    {isCreatingOutreach ? 'Creating Outreach...' : 'Confirm & Launch AI Outreach'}
                  </Button>
                </div>
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
              {platformsLoading ? (
                <div className="text-center py-4 text-gray-500">Loading platform data...</div>
              ) : platformAccounts && platformAccounts.length > 0 ? (
                platformAccounts.map(account => (
                  <div key={account.platform_account_id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(account.platform_name)}
                      <span className="font-medium">{account.platform_name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatFollowerCount(account.follower_count)}</p>
                      <p className="text-sm text-gray-500">
                        @{account.username_on_platform}
                      </p>
                      {account.engagement_rate_on_platform && (
                        <p className="text-xs text-gray-400">
                          Engagement: {account.engagement_rate_on_platform}%
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No platform accounts found</div>
              )}
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
                  {influencer.primary_niches && influencer.primary_niches.length > 0 ? (
                    influencer.primary_niches.map((niche, index) => (
                      <Badge key={index} variant="secondary">{niche}</Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No niches specified</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Content Types</h4>
                {influencer.primary_content_types_offered && influencer.primary_content_types_offered.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {influencer.primary_content_types_offered.map((type, index) => (
                      <li key={index}>• {type}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No content types specified</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  Preferred Communication Languages
                </h4>
                {influencer.preferred_communication_languages && influencer.preferred_communication_languages.length > 0 ? (
                  <p className="text-sm text-gray-600">{influencer.preferred_communication_languages.join(", ")}</p>
                ) : (
                  <p className="text-sm text-gray-500">Languages not specified</p>
                )}
                <p className="text-xs text-teal-600 mt-1">Our AI supports multilingual outreach via DeepL/Google Translate!</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <Badge 
                  variant="outline" 
                  className={influencer.availability_status === 'Available' ? "text-green-600 border-green-600" : "text-gray-600 border-gray-600"}
                >
                  {influencer.availability_status || 'Status not specified'}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">About</h4>
                <p className="text-sm text-gray-600">
                  {influencer.bio_description || 'No bio available'}
                </p>
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
                {influencer.past_collaborations_summary ? (
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600">{influencer.past_collaborations_summary}</p>
                  </div>
                ) : (
                  mockData.pastCollabs.map((collab, index) => (
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
                  ))
                )}
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
              🚀 Fantastic! Our AI agents are on it. We'll use {selectedMethod === 'phone' ? 'Phone Call' : selectedMethod === 'chat' ? 'Chat' : 'Email'} for {influencer.full_name} for '{campaigns?.find(c => c.campaign_id === selectedCampaign)?.campaign_name}'.
            </p>
            <div className="text-sm text-gray-500 space-y-1 mb-6">
              {selectedMethod === 'phone' && <p>• ElevenLabs AI voice agent will call automatically</p>}
              {(selectedMethod === 'email' || selectedMethod === 'chat') && <p>• GPT-4 crafts messages</p>}
            </div>
            <p className="text-sm text-gray-600">Track progress on 'Summary' page & 'Notifications'. Good luck!</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              className="bg-teal-500 hover:bg-teal-600" 
              onClick={handleTrackOnOutreachPage}
              disabled={!createdOutreachId}
            >
              Track on Outreach Detail Page
            </Button>
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
