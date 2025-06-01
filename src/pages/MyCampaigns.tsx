
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MoreVertical, Instagram, Youtube, MapPin, Calendar, Users, Target, FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";

const MyCampaigns = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  // Mock campaigns data
  const campaigns = [
    {
      id: "1",
      name: "Spring Fashion Campaign",
      niche: "Fashion",
      platforms: ["instagram", "youtube"],
      status: "active-outreach",
      stats: {
        contacted: 25,
        negotiations: 8,
        deals: 4,
        duration: "Mar 1 - Mar 31, 2025"
      },
      budget: "₹2,50,000",
      description: "Targeting fashion influencers for spring collection promotion across Instagram and YouTube",
      targetLocation: "Mumbai, Delhi, Bangalore"
    },
    {
      id: "2",
      name: "Tech Gadget Reviews",
      niche: "Technology",
      platforms: ["youtube", "instagram"],
      status: "active-issues",
      stats: {
        contacted: 15,
        negotiations: 3,
        deals: 2,
        duration: "Feb 15 - Apr 15, 2025"
      },
      budget: "₹1,80,000",
      description: "Tech reviewers needed for latest smartphone and gadget reviews",
      targetLocation: "All India"
    },
    {
      id: "3",
      name: "Organic Food Fest",
      niche: "Food & Beverage",
      platforms: ["instagram"],
      status: "completed",
      stats: {
        contacted: 20,
        negotiations: 5,
        deals: 5,
        duration: "Jan 1 - Jan 31, 2025"
      },
      budget: "₹1,20,000",
      description: "Promoting organic food festival with food bloggers and health influencers",
      targetLocation: "Delhi, Pune"
    },
    {
      id: "4",
      name: "Fitness Challenge Draft",
      niche: "Health & Fitness",
      platforms: ["instagram", "youtube"],
      status: "planning",
      stats: {
        contacted: 0,
        negotiations: 0,
        deals: 0,
        duration: "Not set"
      },
      budget: "₹80,000",
      description: "Draft campaign for fitness challenge promotion",
      targetLocation: "All India"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "planning": { color: "bg-blue-100 text-blue-800", text: "Planning" },
      "active-outreach": { color: "bg-green-100 text-green-800", text: "Active - Outreach" },
      "active-issues": { color: "bg-yellow-100 text-yellow-800", text: "Active - Issues" },
      "paused": { color: "bg-gray-100 text-gray-800", text: "Paused" },
      "completed": { color: "bg-gray-100 text-gray-800", text: "Completed" },
      "archived": { color: "bg-red-100 text-red-800", text: "Archived" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["planning"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Mock delete action
    console.log("Deleting campaign:", campaignToDelete);
    setShowDeleteDialog(false);
    setCampaignToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Influencer Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage and track all your influencer marketing campaigns</p>
        </div>
        
        <Link to="/app/campaigns/create">
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </Link>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length > 0 ? (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{campaign.niche}</Badge>
                          <div className="flex items-center space-x-1">
                            {campaign.platforms.map((platform, index) => (
                              <div key={index} className="flex items-center">
                                {getPlatformIcon(platform)}
                              </div>
                            ))}
                          </div>
                          {getStatusBadge(campaign.status)}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <span>Pause Campaign</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Resume Campaign</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Archive Campaign</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Duplicate (WIP)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                          >
                            <span>Delete Campaign</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-gray-600 text-sm">{campaign.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Contacted: {campaign.stats.contacted}</span>
                      </div>
                      <div className="flex items-center text-orange-600">
                        <Target className="h-4 w-4 mr-2" />
                        <span>Negotiations: {campaign.stats.negotiations}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Deals: {campaign.stats.deals}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-xs">{campaign.stats.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{campaign.targetLocation}</span>
                        </div>
                        <div>
                          <span className="font-medium">Budget: {campaign.budget}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 lg:w-64">
                    <Button variant="outline" className="w-full">
                      View Details & Manage
                    </Button>
                    <Link to={`/app/influencers?campaign=${campaign.id}`} className="w-full">
                      <Button className="w-full bg-teal-500 hover:bg-teal-600">
                        Find Influencers for this Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderPlus className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Create your first influencer campaign to start discovering and connecting with influencers who match your brand.
            </p>
            <Link to="/app/campaigns/create">
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign!
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone. All outreach data and progress will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCampaigns;
