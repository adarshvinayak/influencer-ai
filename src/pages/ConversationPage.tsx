
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, StopCircle } from "lucide-react";

const ConversationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationRef = useRef<HTMLDivElement>(null);
  const influencerName = searchParams.get('influencer') || 'Influencer';
  const campaign = searchParams.get('campaign') || 'Campaign';

  useEffect(() => {
    // Add a small delay to ensure the page is fully rendered
    const timer = setTimeout(() => {
      if (conversationRef.current) {
        console.log('Creating ElevenLabs widget...');

        // Clear any existing content
        conversationRef.current.innerHTML = '';

        // Create the elevenlabs-convai element
        const convaiElement = document.createElement('elevenlabs-convai');
        convaiElement.setAttribute('agent-id', 'agent_01jwhcwysyf7xtzqr9bq7nt34t');

        // Add some styling to ensure visibility
        convaiElement.style.width = '100%';
        convaiElement.style.height = '100%';
        convaiElement.style.minHeight = '500px';
        convaiElement.style.display = 'block';

        // Append to the ref container
        conversationRef.current.appendChild(convaiElement);
        console.log('ElevenLabs widget created and appended');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Conversation Simulation</h1>
              <p className="text-gray-600">
                Speaking with {influencerName} about {campaign}
              </p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleGoBack} className="flex items-center gap-2">
            <StopCircle className="h-4 w-4" />
            End Conversation
          </Button>
        </div>

        {/* Conversation Widget Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Live AI Conversation - Start the call from the Widget below</h2>
            <p className="text-gray-600 text-sm">This is a demo simulation of how the AI agent would interact with an influencer. You can speak as the influencer to test the conversation flow. Start the call from the widget below.</p>
          </div>
          
          <div className="border rounded-lg bg-gray-50 p-4" style={{
            minHeight: '600px'
          }}>
            {/* Screenshot Image */}
            <div className="mb-4">
              <img 
                src="./screenshot.png" 
                alt="Conversation Screenshot" 
                className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
                onError={(e) => {
                  console.log('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />
            </div>
            
            <div ref={conversationRef} className="w-full h-full" style={{
              minHeight: '500px'
            }}>
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p>Loading AI conversation widget...</p>
                  <p className="text-sm mt-2">Please allow microphone access when prompted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
