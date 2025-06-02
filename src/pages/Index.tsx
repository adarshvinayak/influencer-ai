import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, UsersRound, BrainCircuit, BotMessageSquare, MailCheck, AreaChart, FileLock2 } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  const features = [{
    icon: Target,
    title: "1. Set Up & Strategize",
    description: "Sign up, detail your brand, and craft targeted campaigns (niche, platforms, content goals, detailed brief)."
  }, {
    icon: BrainCircuit,
    title: "2. Find Your Match with AI",
    description: "Explore our curated Indian influencer database. Smart filters & AI (custom embeddings) match your campaign brief to relevant profiles."
  }, {
    icon: BotMessageSquare,
    title: "3. Automate Smart Outreach",
    description: "Our AI agents (GPT-4 for messages, ElevenLabs/Whisper for voice) initiate personalized, multilingual outreach and handle basic negotiations."
  }, {
    icon: AreaChart,
    title: "4. Monitor, Sign & Succeed",
    description: "Track outreach status, manage e-signed contracts (DocuSign/Native), process payments (Razorpay/Stripe), and analyze campaign performance."
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold text-gray-900">Influencer-AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/app/dashboard">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-teal-500 hover:bg-teal-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Personalized Influencer Campaigns That{" "}
          <br />
          <span className="text-teal-500">Close Themselves</span>
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl px-0 text-center my-[38px] mx-[212px] text-xl font-normal">The first end-to-end platform to automate creator discovery, outreach, voice negotiation, contracts, payments and reporting. 10x your ROI without the overheads.</p>
        <Link to="/signup">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-lg px-8 py-3">
            Start Your AI Campaign Today
          </Button>
        </Link>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Influencer-AI Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform streamlines every step of influencer marketing, from discovery to deal closure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-teal-100 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-lg text-gray-600">Experience the future of influencer marketing automation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <BrainCircuit className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle>GPT-4 Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">AI crafts personalized outreach messages and handles negotiations automatically</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <BotMessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Voice AI Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">ElevenLabs enable natural voice conversations with influencers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-md">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Custom embeddings analyze campaign briefs to find the perfect influencer matches</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Influencer Marketing?</h2>
          <p className="text-xl mb-8 opacity-90">Join brands already using AI to scale their influencer campaigns</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BrainCircuit className="h-6 w-6 text-teal-400" />
            <span className="text-xl font-semibold">Influencer-AI</span>
          </div>
          <p className="text-gray-400">© 2025 Influencer-AI. Transforming influencer marketing with artificial intelligence.</p>
        </div>
      </footer>
    </div>;
};
export default Index;