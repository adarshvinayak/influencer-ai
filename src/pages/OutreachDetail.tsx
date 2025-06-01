
import { useParams } from "react-router-dom";
import { useOutreachActivities } from "@/hooks/useOutreachActivities";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useUserBrand } from "@/hooks/useUserBrand";
import { useCommunicationLogs } from "@/hooks/useCommunicationLogs";
import OutreachHeader from "@/components/outreach/OutreachHeader";
import OutreachOverview from "@/components/outreach/OutreachOverview";
import CallSimulation from "@/components/outreach/CallSimulation";
import AIScriptGenerator from "@/components/outreach/AIScriptGenerator";
import OutreachTabs from "@/components/outreach/OutreachTabs";

const OutreachDetail = () => {
  const { outreachId } = useParams();

  console.log('OutreachDetail rendered with outreachId:', outreachId);

  const { outreachActivities, isLoading: isLoadingOutreach } = useOutreachActivities();
  const { campaigns } = useCampaigns();
  const { influencers } = useInfluencers({});
  const { userBrand } = useUserBrand();
  const outreach = outreachActivities?.find(item => item.outreach_id === outreachId);
  const { communicationLogs } = useCommunicationLogs(outreachId);

  console.log('Found outreach activity:', !!outreach);
  console.log('Communication logs count:', communicationLogs?.length || 0);

  const campaign = campaigns?.find(c => c.campaign_id === outreach?.campaign_id);
  const influencer = influencers?.find(i => i.influencer_id === outreach?.influencer_id);

  if (isLoadingOutreach || !outreach) {
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

  return (
    <div className="space-y-6">
      <OutreachHeader 
        influencerName={influencer?.full_name}
        campaignName={campaign?.campaign_name}
        status={outreach.status}
      />

      <OutreachOverview 
        outreach={outreach}
        influencerName={influencer?.full_name}
        influencerHandle={influencer?.username_handle}
        campaignName={campaign?.campaign_name}
        campaignPlatforms={campaign?.desired_platforms}
      />

      <CallSimulation 
        outreach={outreach}
        outreachId={outreachId!}
        influencerName={influencer?.full_name}
        campaignName={campaign?.campaign_name}
        brandName={userBrand?.brand_name}
      />

      <AIScriptGenerator 
        outreach={outreach}
        influencer={influencer}
        campaign={campaign}
        userBrand={userBrand}
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
