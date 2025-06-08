
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModernSidebar } from "@/components/ModernSidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { Notes } from "@/components/Notes";
import { EmailView } from "@/components/EmailView";
import { AIChatInterface } from "@/components/AIChatInterface";
import { EnhancedDashboard } from "@/components/EnhancedDashboard";
import { DemoDataProvider } from "@/components/DemoDataProvider";
import { AuthConfigPanel } from "@/components/AuthConfigPanel";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles, Settings, Wifi } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ViewType = "dashboard" | "ai" | "inbox" | "calendar" | "notes" | "auth-config";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // For demo mode, we'll use a mock user if no real user is logged in
  const demoUser = {
    email: "demo@gmail-ai.com",
    user_metadata: {
      full_name: "Demo User",
      avatar_url: null
    }
  };

  const currentUser = user || demoUser;
  const isDemoMode = !user;

  // Redirect to auth if not logged in and not in demo mode
  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      navigate('/auth');
    }
  }, [user, loading, navigate, isDemoMode]);

  const handleSignOut = async () => {
    if (isDemoMode) {
      navigate('/auth');
      return;
    }
    
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard": return "Dashboard";
      case "ai": return "AI Assistant";
      case "inbox": return "Inbox";
      case "calendar": return "Calendar";
      case "notes": return "Notes";
      case "auth-config": return "Authentication Settings";
      default: return "Dashboard";
    }
  };

  const renderMainContent = () => {
    if (selectedEmail) {
      return <EmailView email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
    }

    switch (currentView) {
      case "dashboard":
        return <EnhancedDashboard />;
      case "ai":
        return <AIChatInterface />;
      case "inbox":
        return <EmailList onEmailSelect={setSelectedEmail} />;
      case "calendar":
        return <Calendar />;
      case "notes":
        return <Notes />;
      case "auth-config":
        return (
          <div className="p-6 animate-fade-in">
            <AuthConfigPanel />
          </div>
        );
      default:
        return <EnhancedDashboard />;
    }
  };

  // Show loading state only for real auth, not demo mode
  if (loading && !isDemoMode) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-white/80 loading-dots">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <DemoDataProvider>
      <div className="flex h-screen overflow-hidden">
        <ModernSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          showAuthConfig={!isDemoMode}
        />
        
        <div className="flex-1 flex flex-col min-w-0 md:ml-0">
          {/* Enhanced Header */}
          <div className="glass backdrop-blur-xl border-b border-white/10 mobile-padding py-4 flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="md:hidden w-12" /> {/* Spacer for mobile menu button */}
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                {getPageTitle()}
              </h2>
              {isDemoMode && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 glass rounded-full animate-bounce-subtle">
                  <Sparkles className="h-3 w-3 text-purple-300" />
                  <span className="text-xs font-medium text-purple-200">Demo Mode</span>
                </div>
              )}
              {!isDemoMode && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 glass rounded-full">
                  <Settings className="h-3 w-3 text-green-300" />
                  <span className="text-xs font-medium text-green-200">Authenticated</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {/* Connection status */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
                isOnline ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
              )}>
                <Wifi className="h-3 w-3" />
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-white/20 shadow-lg transition-transform duration-200 hover:scale-110">
                  <AvatarImage src={currentUser.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">
                    {currentUser.user_metadata?.full_name || currentUser.email}
                  </div>
                  <div className="text-xs text-white/60">
                    {isDemoMode ? "Demo User" : "Authenticated"}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{isDemoMode ? "Login" : "Sign Out"}</span>
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </DemoDataProvider>
  );
};

export default Index;
