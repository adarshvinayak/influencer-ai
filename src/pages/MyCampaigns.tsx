import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, MoreVertical, Instagram, Youtube, MapPin, Calendar, Users, Target, FolderPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Campaign } from "@/types/supabase-custom";
const MyCampaigns = () => {
  const {
    toast
  } = useToast();
  const location = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const {
    campaigns,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    isCreatingCampaign,
    isUpdatingCampaign,
    isDeletingCampaign
  } = useCampaigns();

  // Check for new campaigns from navigation state
  useEffect(() => {
    if (location.state?.newCampaign) {
      const newCampaignData = {
        campaign_name: location.state.newCampaign.name,
        niche: location.state.newCampaign.niche,
        desired_platforms: location.state.newCampaign.platforms,
        target_locations_india: location.state.newCampaign.targetLocation ? [location.state.newCampaign.targetLocation] : [],
        description_brief: location.state.newCampaign.description,
        budget_amount: parseFloat(location.state.newCampaign.budget.replace(/[₹,]/g, '')) || 0,
        budget_currency: 'INR',
        status: 'Planning Phase'
      };
      createCampaign(newCampaignData);
      toast({
        title: "Campaign Created!",
        description: `"${newCampaignData.campaign_name}" has been added to your campaigns.`
      });

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, createCampaign, toast]);
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Planning Phase": {
        color: "bg-blue-100 text-blue-800",
        text: "Planning Phase"
      },
      "active-outreach": {
        color: "bg-green-100 text-green-800",
        text: "Active - Outreach"
      },
      "active-issues": {
        color: "bg-yellow-100 text-yellow-800",
        text: "Active - Issues"
      },
      "paused": {
        color: "bg-gray-100 text-gray-800",
        text: "Paused"
      },
      "completed": {
        color: "bg-gray-100 text-gray-800",
        text: "Completed"
      },
      "archived": {
        color: "bg-red-100 text-red-800",
        text: "Archived"
      }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Planning Phase"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "YouTube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };
  const handlePauseCampaign = (campaignId: string) => {
    updateCampaign({
      campaignId,
      updates: {
        status: "paused"
      }
    });
    toast({
      title: "Campaign Paused",
      description: "The campaign has been paused and can be resumed later."
    });
  };
  const handleResumeCampaign = (campaignId: string) => {
    updateCampaign({
      campaignId,
      updates: {
        status: "active-outreach"
      }
    });
    toast({
      title: "Campaign Resumed",
      description: "The campaign has been resumed and is now active."
    });
  };
  const handleArchiveCampaign = (campaignId: string) => {
    updateCampaign({
      campaignId,
      updates: {
        status: "archived"
      }
    });
    toast({
      title: "Campaign Archived",
      description: "The campaign has been moved to archived status."
    });
  };
  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    setShowDeleteDialog(true);
  };
  const confirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete);
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been permanently deleted."
      });
    }
    setShowDeleteDialog(false);
    setCampaignToDelete(null);
  };
  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };
  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    updateCampaign({
      campaignId: updatedCampaign.campaign_id,
      updates: {
        campaign_name: updatedCampaign.campaign_name,
        niche: updatedCampaign.niche,
        description_brief: updatedCampaign.description_brief,
        desired_platforms: updatedCampaign.desired_platforms,
        target_locations_india: updatedCampaign.target_locations_india,
        budget_amount: updatedCampaign.budget_amount,
        budget_currency: updatedCampaign.budget_currency
      }
    });
  };
  const handleViewProgress = (influencerId: string, campaignId: string) => {
    toast({
      title: "View Progress",
      description: `Opening detailed progress for influencer ${influencerId} in campaign ${campaignId}`
    });
  };
  if (isLoading) {
    return <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Influencer Campaigns</h1>
            <p className="text-gray-600 mt-2">Manage and track all your influencer marketing campaigns</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Influencer Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage and track all your influencer marketing campaigns</p>
        </div>
        
        <Link to="/app/campaigns/create">
          
        </Link>
      </div>

      {/* Campaigns Grid */}
      {campaigns && campaigns.length > 0 ? <div className="grid gap-6">
          {campaigns.map(campaign => <Card key={campaign.campaign_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {campaign.campaign_name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{campaign.niche}</Badge>
                          <div className="flex items-center space-x-1">
                            {campaign.desired_platforms?.map((platform, index) => <div key={index} className="flex items-center">
                                {getPlatformIcon(platform)}
                              </div>)}
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
                          {campaign.status === "paused" ? <DropdownMenuItem onClick={() => handleResumeCampaign(campaign.campaign_id)}>
                              <span>Resume Campaign</span>
                            </DropdownMenuItem> : <DropdownMenuItem onClick={() => handlePauseCampaign(campaign.campaign_id)}>
                              <span>Pause Campaign</span>
                            </DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => handleArchiveCampaign(campaign.campaign_id)}>
                            <span>Archive Campaign</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Duplicate Campaign</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCampaign(campaign.campaign_id)}>
                            <span>Delete Campaign</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-gray-600 text-sm">{campaign.description_brief}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Budget: {campaign.budget_currency} {campaign.budget_amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-xs">
                          {campaign.start_date && campaign.end_date ? `${new Date(campaign.start_date).toLocaleDateString()} - ${new Date(campaign.end_date).toLocaleDateString()}` : 'Dates not set'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{campaign.target_locations_india?.join(', ') || 'All India'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 lg:w-64">
                    <Button variant="outline" className="w-full" onClick={() => handleViewDetails(campaign)}>
                      View Details & Manage
                    </Button>
                    <Link to={`/app/influencers?campaign=${campaign.campaign_id}`} className="w-full">
                      <Button className="w-full bg-teal-500 hover:bg-teal-600">
                        Find Influencers for this Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div> : (/* Empty State */
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
        </Card>)}

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
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeletingCampaign}>
              {isDeletingCampaign ? 'Deleting...' : 'Delete Campaign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default MyCampaigns;