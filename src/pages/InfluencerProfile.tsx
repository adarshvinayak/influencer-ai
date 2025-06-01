
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Instagram, Youtube, Users, PhoneCall, MessageSquare, Mail, CheckCircle, BrainCircuit, Languages } from "lucide-react";
import { useParams } from "react-router-dom";

const InfluencerProfile = () => {
  const { id } = useParams();
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock influencer data
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

  const mockCampaigns = [
    { id: "1", name: "Spring Fashion Campaign" },
    { id: "2", name: "Tech Gadget Reviews" },
    { id: "3", name: "Organic Food Fest" }
  ];

  const handleOutreachSubmit = () => {
    setShowSuccessModal(true);
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-teal-500" />
                    Initiate AI Outreach to {influencer.name}
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
                        {mockCampaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
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
                        className={`cursor-pointer transition-colors ${selectedMethod === 'phone' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`}
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
                        className={`cursor-pointer transition-colors ${selectedMethod === 'chat' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`}
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
                        className={`cursor-pointer transition-colors ${selectedMethod === 'email' ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`}
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
                        Initiating {selectedMethod === 'phone' ? 'Phone Call' : selectedMethod === 'chat' ? 'Chat' : 'Email'} to {influencer.name} for '{mockCampaigns.find(c => c.id === selectedCampaign)?.name}'.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Mock AI-drafted message snippet will appear here (GPT-4).
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-teal-500 hover:bg-teal-600" 
                    disabled={!selectedCampaign || !selectedMethod}
                    onClick={handleOutreachSubmit}
                  >
                    Confirm & Launch AI Outreach
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

        {/* Past Collaborations & Content */}
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
                {[1, 2, 3, 4].map((item) => (
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
              🚀 Fantastic! Our AI agents are on it. We'll use {selectedMethod === 'phone' ? 'Phone Call' : selectedMethod === 'chat' ? 'Chat' : 'Email'} for {influencer.name} for '{mockCampaigns.find(c => c.id === selectedCampaign)?.name}'.
            </p>
            <div className="text-sm text-gray-500 space-y-1 mb-6">
              {selectedMethod === 'phone' && <p>• Voice AI uses ElevenLabs TTS & Whisper STT</p>}
              {(selectedMethod === 'email' || selectedMethod === 'chat') && <p>• GPT-4 crafts messages</p>}
              <p>• DeepL/Google Translate for multilingual needs if applicable</p>
            </div>
            <p className="text-sm text-gray-600">Track progress on 'Summary' page & 'Notifications'. Good luck!</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowSuccessModal(false)}>
              Track on Summary Page
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
