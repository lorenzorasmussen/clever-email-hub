
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModernSidebar } from "@/components/ModernSidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { TaskNote } from "@/components/TaskNote";
import { EmailView } from "@/components/EmailView";
import { AIChatInterface } from "@/components/AIChatInterface";
import { EnhancedDashboard } from "@/components/EnhancedDashboard";
import { DemoDataProvider } from "@/components/DemoDataProvider";
import { AuthConfigPanel } from "@/components/AuthConfigPanel";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles, Settings, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
      case "notes": return "Tasks & Notes";
      case "auth-config": return "Auth Settings";
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
        return <TaskNote />;
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
      <div className="flex h-screen items-center justify-center" role="main" aria-live="polite">
        <div className="text-center animate-scale-in">
          <div className="loading-spinner mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-primary text-lg loading-dots">Loading</p>
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
          {/* Enhanced Header with better accessibility */}
          <header className="glass backdrop-blur-xl border-b border-white/10 mobile-padding py-4 flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="md:hidden w-12" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-primary">
                  {getPageTitle()}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {isDemoMode ? (
                    <div className="status-demo animate-bounce-subtle">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span className="hidden sm:inline">Demo Mode</span>
                    </div>
                  ) : (
                    <div className="status-auth">
                      <Settings className="h-3 w-3" aria-hidden="true" />
                      <span className="hidden sm:inline">Authenticated</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Connection status with better accessibility */}
              <div className={cn(
                "transition-all duration-200",
                isOnline ? "status-online" : "status-offline"
              )}>
                {isOnline ? <Wifi className="h-3 w-3" aria-hidden="true" /> : <WifiOff className="h-3 w-3" aria-hidden="true" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
                <span className="sr-only">Connection status: {isOnline ? 'Connected' : 'Disconnected'}</span>
              </div>

              {/* User profile section */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white/20 shadow-lg transition-transform duration-200 hover:scale-110">
                  <AvatarImage 
                    src={currentUser.user_metadata?.avatar_url} 
                    alt={`${currentUser.user_metadata?.full_name || currentUser.email}'s avatar`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-primary">
                    {currentUser.user_metadata?.full_name || currentUser.email}
                  </div>
                  <div className="text-xs text-secondary">
                    {isDemoMode ? "Demo User" : "Authenticated"}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-secondary hover:text-primary hover:bg-white/10 mobile-button"
                aria-label={isDemoMode ? "Go to login page" : "Sign out of account"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{isDemoMode ? "Login" : "Sign Out"}</span>
              </Button>
            </div>
          </header>

          {/* Main content with skip link for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50">
            Skip to main content
          </a>
          
          <main id="main-content" className="flex-1 overflow-auto" role="main">
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
