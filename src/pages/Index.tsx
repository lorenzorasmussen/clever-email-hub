
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedSidebar } from "@/components/EnhancedSidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { TaskNote } from "@/components/TaskNote";
import { EmailView } from "@/components/EmailView";
import { AIChatInterface } from "@/components/AIChatInterface";
import { EnhancedDashboard } from "@/components/EnhancedDashboard";
import { DemoDataProvider } from "@/components/DemoDataProvider";
import { AuthConfigPanel } from "@/components/AuthConfigPanel";
import { PersistentAIChat } from "@/components/PersistentAIChat";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  const { user, signOut } = useAuth();
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

  const handleSignOut = async () => {
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
      case "auth-config": return "Settings";
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
          <div className="p-6">
            <AuthConfigPanel />
          </div>
        );
      default:
        return <EnhancedDashboard />;
    }
  };

  // Show loading state
  if (!user) {
    return (
      <ThemeProvider>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground text-lg">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DemoDataProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <EnhancedSidebar 
            currentView={currentView} 
            onViewChange={setCurrentView}
            showAuthConfig={true}
          />
          
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {/* Header */}
            <header className="bg-background/95 backdrop-blur-xl border-b border-border py-4 px-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="md:hidden w-12" />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                    {getPageTitle()}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-sm font-medium">
                      <Settings className="h-3 w-3 text-green-600 dark:text-green-400" aria-hidden="true" />
                      <span className="hidden sm:inline text-green-700 dark:text-green-300">Authenticated</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Connection status */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                  isOnline 
                    ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300" 
                    : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                )}>
                  {isOnline ? <Wifi className="h-3 w-3" aria-hidden="true" /> : <WifiOff className="h-3 w-3" aria-hidden="true" />}
                  <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
                </div>

                {/* User profile section */}
                 <div className="flex items-center gap-3">
                   <Avatar className="h-8 w-8 ring-2 ring-border">
                     <AvatarImage 
                       src={user.user_metadata?.avatar_url} 
                       alt={`${user.user_metadata?.full_name || user.email}'s avatar`}
                     />
                     <AvatarFallback className="bg-primary text-primary-foreground">
                       <User className="h-4 w-4" />
                     </AvatarFallback>
                   </Avatar>
                   
                   <div className="hidden sm:block">
                     <div className="text-sm font-medium text-foreground">
                       {user.user_metadata?.full_name || user.email}
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Authenticated
                     </div>
                   </div>
                 </div>
                
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleSignOut}
                   className="text-muted-foreground hover:text-foreground"
                   aria-label="Sign out of account"
                 >
                   <LogOut className="h-4 w-4 mr-2" />
                   <span className="hidden sm:inline">Sign Out</span>
                 </Button>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-auto bg-background" role="main">
              <div className="animate-fade-in">
                {renderMainContent()}
              </div>
            </main>
          </div>

          {/* Persistent AI Chat */}
          <PersistentAIChat />
        </div>
      </DemoDataProvider>
    </ThemeProvider>
  );
};

export default Index;
