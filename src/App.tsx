
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import CreateCampaign from "./pages/CreateCampaign";
import FindInfluencers from "./pages/FindInfluencers";
import InfluencerProfile from "./pages/InfluencerProfile";
import Summary from "./pages/Summary";
import Analytics from "./pages/Analytics";
import MyCampaigns from "./pages/MyCampaigns";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Summary />} />
            <Route path="campaigns" element={<MyCampaigns />} />
            <Route path="campaigns/create" element={<CreateCampaign />} />
            <Route path="influencers" element={<FindInfluencers />} />
            <Route path="influencers/:id" element={<InfluencerProfile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
