import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Video, ShoppingCart, Tv, Map } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("w-64 min-h-screen border-r bg-sidebar", className)}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold">AIAvatar</h1>
        </div>
        <nav className="flex-1">
          <SidebarNav />
        </nav>
      </div>
    </div>
  );
}

function SidebarNav() {
  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-4 text-base transition-all hover:bg-sidebar-accent",
              isActive
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-sidebar-foreground"
            )
          }
        >
          <span>我的数字人</span>
        </NavLink>
        <NavLink
          to="/voices"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-4 text-base transition-all hover:bg-sidebar-accent",
              isActive
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-sidebar-foreground"
            )
          }
        >
          <span>我的语音</span>
        </NavLink>
        <NavLink
          to="/videos"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-4 text-base transition-all hover:bg-sidebar-accent",
              isActive
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-sidebar-foreground"
            )
          }
        >
          <span>我的视频</span>
        </NavLink>

        {/* 场景 Section */}
        <div className="mt-6 pt-6 border-t border-sidebar-border">
          <h2 className="mb-2 px-3 text-sm font-semibold text-sidebar-foreground">应用场景</h2>
          <div className="grid grid-cols-2 gap-2">
            <SceneLink 
              to="/scenes/broadcasting" 
              title="数字口播" 
              icon={<Video size={18} />} 
            />
            <SceneLink 
              to="/scenes/ecommerce" 
              title="电商带货" 
              icon={<ShoppingCart size={18} />} 
            />
            <SceneLink 
              to="/scenes/livestreaming" 
              title="数字直播" 
              icon={<Tv size={18} />} 
            />
            <SceneLink 
              to="/scenes/guide" 
              title="景区向导" 
              icon={<Map size={18} />} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SceneLinkProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

function SceneLink({ to, title, icon }: SceneLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-sm transition-all hover:bg-sidebar-accent",
          isActive
            ? "bg-blue-50 text-blue-600 border border-blue-200"
            : "text-sidebar-foreground"
        )
      }
    >
      {icon}
      <span className="text-xs">{title}</span>
    </NavLink>
  );
}
