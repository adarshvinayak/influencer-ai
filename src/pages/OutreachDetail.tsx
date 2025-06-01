
import { useParams } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useUserBrand } from "@/hooks/useUserBrand";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import OutreachHeader from "@/components/outreach/OutreachHeader";
import OutreachOverview from "@/components/outreach/OutreachOverview";
import OutreachTabs from "@/components/outreach/OutreachTabs";

const OutreachDetail = () => {
  const { outreachId } = useParams();

  console.log('OutreachDetail rendered with outreachId:', outreachId);

  const { outreachActivities, isLoading: isLoadingOutreach, error: outreachError } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});
  const { userBrand } = useUserBrand();
  
  // Find the specific outreach activity by ID
  const outreach = outreachActivities?.find(item => item.outreach_id === outreachId);
  const { communicationLogs, isLoading: isLoadingLogs } = useCommunicationLogs(outreachId);

  console.log('Found outreach activity:', !!outreach, outreach);
  console.log('Communication logs count:', communicationLogs?.length || 0);
  console.log('Outreach activities total:', outreachActivities?.length || 0);

  const campaign = campaigns?.find(c => c.campaign_id === outreach?.campaign_id);
  const influencer = influencers?.find(i => i.influencer_id === outreach?.influencer_id);

  // Show loading state while any required data is loading
  if (isLoadingOutreach || isLoadingLogs) {
    return (
      <div className="space-y-6">
        <OutreachHeader 
          influencerName="Loading..." 
          campaignName="Loading..." 
          status="Loading..." 
        />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  // Show error state if outreach not found or there was an error
  if (outreachError || !outreach) {
    return (
      <div className="space-y-6">
        <OutreachHeader 
          influencerName="Unknown" 
          campaignName="Unknown" 
          status="Error" 
        />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Outreach Activity Not Found</h3>
            <p className="text-gray-600 mb-4">
              {outreachError ? `Error: ${outreachError.message}` : 'The outreach activity you\'re looking for doesn\'t exist or couldn\'t be loaded.'}
            </p>
            <p className="text-sm text-gray-500">
              Outreach ID: {outreachId || 'None provided'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OutreachHeader 
        influencerName={influencer?.full_name || 'Unknown Influencer'}
        campaignName={campaign?.campaign_name || 'Unknown Campaign'}
        status={outreach.status}
      />

      <OutreachOverview 
        outreach={outreach}
        influencerName={influencer?.full_name}
        influencerHandle={influencer?.username_handle}
        campaignName={campaign?.campaign_name}
        campaignPlatforms={campaign?.desired_platforms}
      />

      <OutreachTabs 
        outreach={outreach}
        communicationLogs={communicationLogs}
        campaign={campaign}
        influencer={influencer}
      />
    </div>
  );
};

export default OutreachDetail;
