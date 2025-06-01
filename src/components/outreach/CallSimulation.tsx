
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { simulatePhoneCall } from "@/services/callSimulationService";
import { OutreachActivity } from "@/hooks/useOutreachActivities";

interface CallSimulationProps {
  outreach: OutreachActivity;
  outreachId: string;
  influencerName?: string;
  campaignName?: string;
  brandName?: string;
}

const CallSimulation = ({ 
  outreach, 
  outreachId, 
  influencerName, 
  campaignName, 
  brandName 
}: CallSimulationProps) => {
  const { toast } = useToast();
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);

  const handleSimulateCall = async () => {
    if (!influencerName || !campaignName || !brandName) {
      toast({
        title: "Missing Data",
        description: "Unable to simulate call due to missing information.",
        variant: "destructive"
      });
      return;
    }

    if (outreach.outreach_method !== 'phone') {
      toast({
        title: "Invalid Outreach Method",
        description: "Call simulation is only available for phone outreach.",
        variant: "destructive"
      });
      return;
    }

    setIsSimulatingCall(true);
    try {
      const result = await simulatePhoneCall(
        outreachId,
        influencerName,
        campaignName,
        brandName
      );

      if (result.success) {
        toast({
          title: "Call Simulated Successfully!",
          description: "The simulated call transcript has been recorded in the communication log."
        });
        window.location.reload();
      } else {
        toast({
          title: "Simulation Failed",
          description: result.error || "Failed to simulate call. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error simulating call:', error);
      toast({
        title: "Error",
        description: "Failed to simulate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSimulatingCall(false);
    }
  };

  if (outreach.outreach_method !== 'phone') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PhoneCall className="h-5 w-5 mr-2 text-teal-500" />
          Call Simulation
        </CardTitle>
        <CardDescription>
          Simulate a phone call conversation using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSimulateCall} 
          disabled={isSimulatingCall}
          className="bg-teal-500 hover:bg-teal-600"
        >
          {isSimulatingCall ? "Simulating Call..." : "Simulate Phone Call"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CallSimulation;
