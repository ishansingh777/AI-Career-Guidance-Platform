import { useState } from "react";
import { Bell, Brain, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";

type NavbarProps = {
  scrolled?: boolean;
};

export function Navbar({ scrolled = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Careers", path: "/careers" },
    { label: "Skill Gap", path: "/skill-gap" },
    { label: "Roadmap", path: "/roadmap" },
    { label: "AI Mentor", path: "/mentor" },
  ];
  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500",
      scrolled
        ? "bg-white/80 backdrop-blur-2xl shadow-md shadow-blue-500/10 border-b border-white/60"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PathAI</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                currentPath === item.path
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              )}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>
          {/* Auth state */}
          <AuthButtons />
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/60 px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => { navigate(item.path); setMenuOpen(false); }}
              className={cn("px-4 py-2.5 rounded-xl text-sm font-medium text-left",
                currentPath === item.path ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50"
              )}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function AuthButtons() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />;

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <button onClick={() => navigate('/login')} className="px-3 py-1 rounded-md text-sm text-slate-700 hover:bg-slate-50">Sign in</button>
        <button onClick={() => navigate('/signup')} className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white">Sign up</button>
      </div>
    );
  }

  const initials = (user.name || user.email || "U").split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/30">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-xl object-cover" /> : initials}
      </button>
      <button onClick={() => logout()} className="px-3 py-1 rounded-md text-sm text-slate-700 hover:bg-slate-50">Sign out</button>
    </div>
  );
}
