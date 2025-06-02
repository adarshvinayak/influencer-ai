
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import CreateCampaign from "./pages/CreateCampaign";
import FindInfluencers from "./pages/FindInfluencers";
import InfluencerProfile from "./pages/InfluencerProfile";
import OutreachDetail from "./pages/OutreachDetail";
import Summary from "./pages/Summary";
import Analytics from "./pages/Analytics";
import MyCampaigns from "./pages/MyCampaigns";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import ConversationPage from "./pages/ConversationPage";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Summary />} />
              <Route path="dashboard/:campaignId/:influencerId" element={<Summary />} />
              <Route path="campaigns" element={<MyCampaigns />} />
              <Route path="campaigns/create" element={<CreateCampaign />} />
              <Route path="influencers" element={<FindInfluencers />} />
              <Route path="influencers/:id" element={<InfluencerProfile />} />
              <Route path="outreach/:outreachId" element={<OutreachDetail />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
