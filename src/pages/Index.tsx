
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { Notes } from "@/components/Notes";
import { EmailView } from "@/components/EmailView";

export type ViewType = "inbox" | "calendar" | "notes";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const renderMainContent = () => {
    if (selectedEmail) {
      return <EmailView email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
    }

    switch (currentView) {
      case "inbox":
        return <EmailList onEmailSelect={setSelectedEmail} />;
      case "calendar":
        return <Calendar />;
      case "notes":
        return <Notes />;
      default:
        return <EmailList onEmailSelect={setSelectedEmail} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Index;
