
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ExternalLink, Instagram, Youtube, Twitter, Facebook, UserPlus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useInfluencerById } from "@/hooks/useInfluencers";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";

const InfluencerProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [newOutreach, setNewOutreach] = useState({
    campaign_id: '',
    outreach_method: 'email',
    ai_agent_name: 'GPT-4',
    status: 'AI Drafting',
    notes_and_alerts: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {
    influencer,
    isLoading,
    error
  } = useInfluencerById(id || '');
  const { campaigns } = useCampaigns();
  const { addOutreachActivity, isAddingOutreachActivity } = useOutreachActivities();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching influencer",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSubmitOutreach = async () => {
    if (!newOutreach.campaign_id) {
      toast({
        title: "Error",
        description: "Please select a campaign for this outreach.",
        variant: "destructive",
      });
      return;
    }

    const outreachData = {
      ...newOutreach,
      influencer_id: id || '',
      next_follow_up_at: selectedDate?.toISOString()
    };

    addOutreachActivity(outreachData);
    setShowOutreachModal(false);
    toast({
      title: "Outreach Initiated!",
      description: `AI outreach to ${influencer?.full_name} has been scheduled.`,
    });
  };

  if (isLoading) {
    return <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencer Profile</h1>
            <p className="text-gray-600 mt-2">Loading influencer data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>;
  }

  if (!influencer) {
    return <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencer Profile</h1>
            <p className="text-gray-600 mt-2">Influencer not found.</p>
          </div>
        </div>
      </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Profile</h1>
          <p className="text-gray-600 mt-2">View detailed information and initiate outreach</p>
        </div>
      </div>

      {/* Influencer Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={influencer.profile_picture_url} />
              <AvatarFallback>{influencer.full_name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-semibold">{influencer.full_name}</CardTitle>
              <CardDescription className="text-gray-600">
                {influencer.username_handle}
              </CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span>{influencer.instagram_followers?.toLocaleString() || 'N/A'} Followers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Youtube className="h-5 w-5 text-red-500" />
              <span>{influencer.youtube_subscribers?.toLocaleString() || 'N/A'} Subscribers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Facebook className="h-5 w-5 text-blue-500" />
              <span>{influencer.facebook_followers?.toLocaleString() || 'N/A'} Likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              <span>{influencer.twitter_followers?.toLocaleString() || 'N/A'} Followers</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-gray-500" />
              <span>{influencer.est_audience_reach?.toLocaleString() || 'N/A'} Est. Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-gray-500" />
              <a href={influencer.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Website
              </a>
            </div>
          </div>

          <div className="mt-6">
            <CardDescription className="text-gray-700">
              {influencer.bio}
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Dialog open={showOutreachModal} onOpenChange={setShowOutreachModal}>
          <DialogTrigger asChild>
            <Button variant="default">
              <UserPlus className="h-4 w-4 mr-2" />
              Initiate Outreach
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Initiate AI Outreach</DialogTitle>
              <DialogDescription>
                Schedule AI-driven outreach to this influencer.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="campaign" className="text-right">
                  Campaign
                </Label>
                <select
                  id="campaign"
                  className="col-span-3 rounded-md border border-gray-200 px-2 py-1"
                  value={newOutreach.campaign_id}
                  onChange={(e) => setNewOutreach({ ...newOutreach, campaign_id: e.target.value })}
                >
                  <option value="">Select a Campaign</option>
                  {campaigns?.map(campaign => (
                    <option key={campaign.campaign_id} value={campaign.campaign_id}>
                      {campaign.campaign_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <select
                  id="method"
                  className="col-span-3 rounded-md border border-gray-200 px-2 py-1"
                  value={newOutreach.outreach_method}
                  onChange={(e) => setNewOutreach({ ...newOutreach, outreach_method: e.target.value })}
                >
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="aiAgent" className="text-right">
                  AI Agent
                </Label>
                <select
                  id="aiAgent"
                  className="col-span-3 rounded-md border border-gray-200 px-2 py-1"
                  value={newOutreach.ai_agent_name}
                  onChange={(e) => setNewOutreach({ ...newOutreach, ai_agent_name: e.target.value })}
                >
                  <option value="GPT-4">GPT-4</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Bard">Bard</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followUp" className="text-right">
                  Follow Up Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? format(selectedDate, "PPP") : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes/Alerts
                </Label>
                <Textarea
                  id="notes"
                  className="col-span-3"
                  placeholder="Any specific notes or alerts for this outreach?"
                  value={newOutreach.notes_and_alerts}
                  onChange={(e) => setNewOutreach({ ...newOutreach, notes_and_alerts: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowOutreachModal(false)}>
                Close
              </Button>
              <div className="flex space-x-2">
                <Link to={`/app/summary/${newOutreach.campaign_id}/${influencer.influencer_id}`}>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    Track on Summary Page
                  </Button>
                </Link>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InfluencerProfile;
