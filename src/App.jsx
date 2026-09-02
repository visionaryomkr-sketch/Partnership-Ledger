import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import WorkLog from '@/pages/WorkLog';
import Expenses from '@/pages/Expenses';
import Revenue from '@/pages/Revenue';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Equity from '@/pages/Equity';
import Decisions from '@/pages/Decisions';
import Milestones from '@/pages/Milestones';
import Documents from '@/pages/Documents';
import Roles from '@/pages/Roles';
import History from '@/pages/History';
import Layout from '@/components/ledger/Layout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show a quiet dashboard skeleton while access is verified
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] p-6">
        <div className="mx-auto max-w-[1200px] animate-pulse space-y-8">
          <div className="h-16 rounded-xl bg-[#E8E6E1]" />
          <div className="h-12 w-64 rounded-lg bg-[#E8E6E1]" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-56 rounded-2xl bg-[#E8E6E1]" />)}
          </div>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/work" element={<WorkLog />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/equity" element={<Equity />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App