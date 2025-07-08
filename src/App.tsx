
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import Map from "./pages/Map";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Donations from "./pages/Donations";
import SystemCheck from "./pages/SystemCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/map" element={<Map />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/system-check" element={<SystemCheck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
