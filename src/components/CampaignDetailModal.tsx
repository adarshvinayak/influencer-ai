
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, Youtube, Users, Calendar, MapPin, Eye, CheckCircle, Clock, AlertTriangle, Play, Pause, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types/supabase-custom";

interface AssociatedInfluencer {
  id: string;
  name: string;
  handle: string;
  profilePic: string;
  niche: string;
  outreachStatus: string;
  lastContact: string;
  responseRate: string;
}

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onSave: (updatedCampaign: Campaign) => void;
  onViewProgress: (influencerId: string, campaignId: string) => void;
  onPause: (campaignId: string) => void;
  onResume: (campaignId: string) => void;
  onDuplicate: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const CampaignDetailModal = ({ 
  isOpen, 
  onClose, 
  campaign, 
  onSave, 
  onViewProgress,
  onPause,
  onResume,
  onDuplicate,
  onDelete
}: CampaignDetailModalProps) => {
  const { toast } = useToast();
  const [editedCampaign, setEditedCampaign] = useState<Campaign | null>(campaign);
  const [isLoading, setIsLoading] = useState(false);

  // Mock associated influencers data
  const associatedInfluencers: AssociatedInfluencer[] = [
    {
      id: "1",
      name: "Priya Sharma",
      handle: "@StyleWithPriya",
      profilePic: "/placeholder.svg",
      niche: "Fashion",
      outreachStatus: "negotiating",
      lastContact: "2 days ago",
      responseRate: "85%"
    },
    {
      id: "2",
      name: "Ananya Joshi",
      handle: "@AnanyaEats",
      profilePic: "/placeholder.svg",
      niche: "Food",
      outreachStatus: "deal-signed",
      lastContact: "1 week ago",
      responseRate: "92%"
    },
    {
      id: "3",
      name: "Rohan Verma",
      handle: "@TechWithRohan",
      profilePic: "/placeholder.svg",
      niche: "Technology",
      outreachStatus: "initial-outreach",
      lastContact: "5 days ago",
      responseRate: "78%"
    }
  ];

  const industries = [
    "Food & Beverage", "Fashion", "Health & Fitness", "Technology", 
    "Beauty & Cosmetics", "Travel", "Gaming", "Education", "Finance", 
    "Home & Garden", "Family & Kids", "Arts & Culture", "Automotive", "Pets"
  ];

  const platforms = ["Instagram", "YouTube", "TikTok", "X (Twitter)", "Facebook", "LinkedIn", "Blog"];

  const handleSave = async () => {
    if (!editedCampaign) return;
    
    setIsLoading(true);
    
    // Mock save operation
    setTimeout(() => {
      setIsLoading(false);
      onSave(editedCampaign);
      toast({
        title: "Campaign Updated",
        description: "Your campaign details have been saved successfully."
      });
      onClose();
    }, 1000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "YouTube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOutreachStatusBadge = (status: string) => {
    const statusConfig = {
      "initial-outreach": { color: "bg-blue-100 text-blue-800", text: "Initial Outreach", icon: Clock },
      "negotiating": { color: "bg-orange-100 text-orange-800", text: "Negotiating", icon: AlertTriangle },
      "deal-signed": { color: "bg-green-100 text-green-800", text: "Deal Signed", icon: CheckCircle },
      "no-response": { color: "bg-gray-100 text-gray-800", text: "No Response", icon: Clock },
      "declined": { color: "bg-red-100 text-red-800", text: "Declined", icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["initial-outreach"];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (!editedCampaign) return;
    
    setEditedCampaign(prev => ({
      ...prev!,
      desired_platforms: checked 
        ? [...(prev!.desired_platforms || []), platform]
        : (prev!.desired_platforms || []).filter(p => p !== platform)
    }));
  };

  if (!campaign || !editedCampaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Campaign Management: {campaign.campaign_name}</DialogTitle>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {campaign.status === "paused" ? (
            <Button variant="outline" onClick={() => onResume(campaign.campaign_id)} className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Resume Campaign</span>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onPause(campaign.campaign_id)} className="flex items-center space-x-2">
              <Pause className="h-4 w-4" />
              <span>Pause Campaign</span>
            </Button>
          )}
          <Button variant="outline" onClick={() => onDuplicate(campaign)} className="flex items-center space-x-2">
            <Copy className="h-4 w-4" />
            <span>Duplicate Campaign</span>
          </Button>
          <Button variant="destructive" onClick={() => onDelete(campaign.campaign_id)} className="flex items-center space-x-2">
            <Trash2 className="h-4 w-4" />
            <span>Delete Campaign</span>
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Campaign Details</TabsTrigger>
            <TabsTrigger value="influencers">Associated Influencers ({associatedInfluencers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      value={editedCampaign.campaign_name}
                      onChange={(e) => setEditedCampaign({...editedCampaign, campaign_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="niche">Primary Niche</Label>
                    <Select value={editedCampaign.niche} onValueChange={(value) => setEditedCampaign({...editedCampaign, niche: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={editedCampaign.desired_platforms?.includes(platform) || false}
                          onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                        />
                        <Label htmlFor={platform}>{platform}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea
                    id="description"
                    value={editedCampaign.description_brief}
                    onChange={(e) => setEditedCampaign({...editedCampaign, description_brief: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget ({editedCampaign.budget_currency})</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={editedCampaign.budget_amount || ""}
                      onChange={(e) => setEditedCampaign({...editedCampaign, budget_amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetLocation">Target Locations</Label>
                    <Input
                      id="targetLocation"
                      value={editedCampaign.target_locations_india?.join(', ') || ""}
                      onChange={(e) => setEditedCampaign({
                        ...editedCampaign, 
                        target_locations_india: e.target.value.split(',').map(s => s.trim())
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="bg-teal-500 hover:bg-teal-600">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Influencers for this Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {associatedInfluencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{influencer.name}</h4>
                          <p className="text-sm text-gray-500">{influencer.handle} • {influencer.niche}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-400">Last contact: {influencer.lastContact}</span>
                            <span className="text-xs text-gray-400">Response rate: {influencer.responseRate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getOutreachStatusBadge(influencer.outreachStatus)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewProgress(influencer.id, campaign.campaign_id)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Progress</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailModal;
