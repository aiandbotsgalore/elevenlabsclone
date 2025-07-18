import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  Users,
  PhoneCall,
  Database,
  Phone,
  Settings,
  Headphones,
  Bell,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex w-[150px] flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-1 border-b border-border p-3">
        <div className="font-medium text-sm text-sidebar-foreground">
          <div>ElevenLabs</div>
          <div className="text-xs">Conversational AI</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-sm text-sidebar-accent-foreground text-left"
            >
              <Users className="h-4 w-4" />
              <span>Agents</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call History</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <Database className="h-4 w-4" />
              <span>Knowledge Base</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <Phone className="h-4 w-4" />
              <span>Phone Numbers</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-3">
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to ElevenLabs</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Audio Tools</span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>My Account</span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
