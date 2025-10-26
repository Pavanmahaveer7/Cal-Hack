import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mission from "./pages/Mission";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Protected Professor Routes - Coming soon */}
                <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
                  <Route path="/professor/dashboard" element={<div className="flex min-h-screen items-center justify-center"><h1 className="text-4xl font-bold">Professor Dashboard - Coming Soon</h1></div>} />
                </Route>
                
                {/* Protected Student Routes - Coming soon */}
                <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route path="/student/dashboard" element={<div className="flex min-h-screen items-center justify-center"><h1 className="text-4xl font-bold">Student Dashboard - Coming Soon</h1></div>} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
