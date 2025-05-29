import React, { useEffect, useCallback, useState } from "react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useTheme } from "../contexts/ThemeContext";
import { Terminal, Sun, Moon, Menu } from "lucide-react";
import { cn } from "../utils/cn";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SidebarProps {
  className?: string;
  setOpenCommand: React.Dispatch<React.SetStateAction<boolean>>;
}

const tools = [
  {
    category: "Converters",
    items: [
      { name: "Unix Time", path: "/converters/unix-time" },
      { name: "Base64", path: "/converters/base64" },
      { name: "URL Encode/Decode", path: "/converters/urlencode-decode" },
      { name: "Hash Generator & Verifier", path: "/converters/hash" },
      { name: "Text Case Converter", path: "/converters/textcase" },
      { name: "Number Base Converter", path: "/converters/number-base" },
    ],
  },
  {
    category: "Generators",
    items: [
      { name: "Uuid", path: "/generators/uuid" },
      { name: "Fake Data", path: "/generators/fake-data" },
    ],
  },
  {
    category: "Debuggers",
    items: [{ name: "JWT", path: "/debuggers/jwt" }],
  },
  {
    category: "Formatters",
    items: [{ name: "JSON", path: "/formatters/json" }],
  },
  {
    category: "Tailwind",
    items: [{ name: "Colors", path: "/tailwind/colors" }],
  },
];

const Sidebar = ({ className, setOpenCommand }: SidebarProps) => {
  const [modifierKey, setModifierKey] = useState("⌘");

  useEffect(() => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    if (!isMac) {
      setModifierKey("Ctrl");
    }
  }, []);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="px-3 py-3">
        <button
          onClick={() => setOpenCommand(true)}
          className="w-full flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <span>Search tools...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">{modifierKey}</span>K
          </kbd>
        </button>
      </div>
      <Separator className="opacity-50" />
      <div className="py-3">
        {tools.map((section, i) => (
          <div key={section.category} className="px-3">
            <h4 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.category}
            </h4>
            <ul className="flex-col">
              {section.items.map((tool) => (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className={ 
                      "block w-full rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    }
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
            {i < tools.length - 1 && <Separator className="my-4 opacity-50" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [openCommand, setOpenCommand] = React.useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpenCommand(false);
    command();
  }, []);

  return (
    <div className="flex min-h-screen gap-2">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-64 border-r border-border/40">
        <div className="flex h-14 items-center gap-2 px-4 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-semibold">tinydev.tools</span>
          </Link>
        </div>
        <Sidebar setOpenCommand={setOpenCommand} />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 h-14 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden -ml-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-14 items-center gap-2 px-4 border-b border-border/40">
                  <Terminal className="w-5 h-5 text-primary" />
                  <span className="font-semibold">tinydev.tools</span>
                </div>
                <Sidebar setOpenCommand={setOpenCommand} />
              </SheetContent>
            </Sheet>

            <div className="flex-1" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="container max-w-5xl py-6 md:py-10 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
      <TanStackRouterDevtools />
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {tools.map((group) => (
            <CommandGroup key={group.category} heading={group.category}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.path}
                  value={item.name}
                  onSelect={() => {
                    runCommand(() => navigate({ to: item.path }));
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default Layout;
