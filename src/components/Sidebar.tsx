
import { cn } from "@/lib/utils";
import { Mail, Calendar, FileText, Inbox, Star, Send, Archive, Trash2, Tag, Zap } from "lucide-react";
import { ViewType } from "@/pages/Index";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const mainMenuItems = [
    { id: "inbox" as ViewType, label: "Inbox", icon: Inbox, count: 12 },
    { id: "calendar" as ViewType, label: "Calendar", icon: Calendar },
    { id: "notes" as ViewType, label: "Notes", icon: FileText },
  ];

  const emailCategories = [
    { label: "Starred", icon: Star, count: 3 },
    { label: "Sent", icon: Send },
    { label: "Archive", icon: Archive },
    { label: "Trash", icon: Trash2 },
  ];

  const aiFeatures = [
    { label: "Smart Tags", icon: Tag },
    { label: "AI Summary", icon: Zap },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="h-6 w-6 text-blue-600" />
          Gmail AI
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <ul className="space-y-1">
            {mainMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    currentView === item.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Categories */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Email
          </h3>
          <ul className="space-y-1">
            {emailCategories.map((item) => (
              <li key={item.label}>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Features */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AI Features
          </h3>
          <ul className="space-y-1">
            {aiFeatures.map((item) => (
              <li key={item.label}>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <item.icon className="h-4 w-4 text-purple-600" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
