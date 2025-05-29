
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VoicesPage from "./pages/VoicesPage";
import VideosPage from "./pages/VideosPage";
import CreateAvatarPage from "./pages/CreateAvatarPage";
import EditAvatarPage from "./pages/EditAvatarPage";
import ProcessingPage from "./pages/ProcessingPage";
import NotFound from "./pages/NotFound";

// Scene Pages
import BroadcastingScenePage from "./pages/scenes/BroadcastingScenePage";
import EcommerceScenePage from "./pages/scenes/EcommerceScenePage";
import LivestreamingScenePage from "./pages/scenes/LivestreamingScenePage";
import GuideScenePage from "./pages/scenes/GuideScenePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voices" element={<VoicesPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/create-avatar" element={<CreateAvatarPage />} />
          <Route path="/edit-avatar/:id" element={<EditAvatarPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          
          {/* Scene routes */}
          <Route path="/scenes/broadcasting" element={<BroadcastingScenePage />} />
          <Route path="/scenes/ecommerce" element={<EcommerceScenePage />} />
          <Route path="/scenes/livestreaming" element={<LivestreamingScenePage />} />
          <Route path="/scenes/guide" element={<GuideScenePage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
