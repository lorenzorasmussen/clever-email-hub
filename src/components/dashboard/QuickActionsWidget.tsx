
import { Calendar as CalendarIcon, Mail, StickyNote, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const QuickActionsWidget = () => {
  const actions = [
    {
      icon: Mail,
      label: "Compose Email",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: CalendarIcon,
      label: "New Event",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200"
    },
    {
      icon: StickyNote,
      label: "Quick Note",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      icon: Users,
      label: "Schedule Meeting",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <Card className="mt-6 bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 font-semibold">Quick Actions</CardTitle>
        <CardDescription className="text-gray-600">Get things done faster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex-col gap-2 ${action.bgColor} ${action.borderColor} border-2 transition-all duration-200 hover:scale-105 hover:shadow-md`}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-sm font-medium text-gray-800">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
