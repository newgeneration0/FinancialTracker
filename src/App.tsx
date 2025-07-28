import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ForgetPassword from "./pages/ForgetPassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // important
import EnterCode from "./pages/EnterCode";
import NewPassword from "./pages/NewPassword";

const queryClient = new QueryClient();

// This wrapper blocks access for authenticated users
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Or show loader

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/forgetpassword"
            element={
              <PublicOnlyRoute>
                <ForgetPassword />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/entercode"
            element={
              <PublicOnlyRoute>
                <EnterCode />
              </PublicOnlyRoute>
            }
          />
            <Route
            path="/newpassword"
            element={
              <PublicOnlyRoute>
                <NewPassword />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;








// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Dashboard from "./components/dashboard/Dashboard";
// // import UserProfile from "./components/dashboard/UserProfile";
// import BudgetOverview from "./components/dashboard/BudgetOverview";
// import GoalsSection from "./components/dashboard/GoalsSection";
// import Analytics from "./components/dashboard/Analytics";
// import { FinancialProvider } from "./contexts/FinancialContext";
// import ForgetPassword from "./pages/ForgetPassword";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/forgetpassword" element={<ForgetPassword />} />
//           {/* <Route path="/forgetpassword" element={<ForgetPassword />} /> */}
//           {/* <Route path="*" element={<Index />} /> */}
//           <Route path="*" element={<Navigate to="/" />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//         </Routes>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
