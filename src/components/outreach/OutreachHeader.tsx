
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface OutreachHeaderProps {
  influencerName?: string;
  campaignName?: string;
  status: string;
}

const OutreachHeader = ({ influencerName, campaignName, status }: OutreachHeaderProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "AI Drafting": { color: "bg-blue-100 text-blue-800", text: "AI Drafting" },
      "AI Reaching Out": { color: "bg-blue-100 text-blue-800", text: "AI Reaching Out" },
      "Waiting for Response": { color: "bg-yellow-100 text-yellow-800", text: "Waiting for Response" },
      "Response - Positive Interest": { color: "bg-green-100 text-green-800", text: "Positive Response" },
      "Response - Not Interested": { color: "bg-red-100 text-red-800", text: "Not Interested" },
      "Response - In Negotiation": { color: "bg-orange-100 text-orange-800", text: "In Negotiation" },
      "Response - Needs More Information": { color: "bg-purple-100 text-purple-800", text: "Needs Info" },
      "Payment Link Sent": { color: "bg-cyan-100 text-cyan-800", text: "Payment Link Sent" },
      "Contract Signed": { color: "bg-emerald-100 text-emerald-800", text: "Contract Signed" },
      "Deal Finalized": { color: "bg-green-100 text-green-800", text: "Deal Finalized" },
      "Issue: AI Needs Human Help": { color: "bg-red-100 text-red-800", text: "Needs Attention" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Waiting for Response"];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outreach Details</h1>
          <p className="text-gray-600">
            {influencerName} × {campaignName}
          </p>
        </div>
      </div>
      {getStatusBadge(status)}
    </div>
  );
};

export default OutreachHeader;
