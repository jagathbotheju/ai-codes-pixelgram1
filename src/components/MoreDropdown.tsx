"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Activity,
  Bookmark,
  ChevronLeft,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import BackDrop from "./Backdrop";
import { User } from "@prisma/client";

const MoreDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [showMode, setShowMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!event.target) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowMode(false);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  return (
    <>
      <DropdownMenu open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            variant="ghost"
            size="lg"
            className="md:w-full justify-center lg:justify-start space-x-2 px-3 focus-visible:ring-transparent"
          >
            <Menu />
            <div className="hidden lg:block">More</div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          ref={ref}
          className={cn(
            "dark:bg-neutral-800 w-64 rounded-xl p-0 transition-opacity",
            !open && "opacity-0"
          )}
          align="end"
          alignOffset={-40}
        >
          {!showMode && (
            <>
              <DropdownMenuItem className="menuItem">
                <Settings size={20} />
                <p>Settings</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="menuItem">
                <Activity size={20} />
                <p>Your Activity</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="menuItem">
                <Bookmark size={20} />
                <p>Saved</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="menuItem"
                onClick={() => setShowMode(true)}
              >
                <Moon size={20} />
                <p>Switch Appearance</p>
              </DropdownMenuItem>

              <DropdownMenuItem className="menuItem" onClick={() => signOut()}>
                <LogOut size={20} />
                <p>Logout</p>
              </DropdownMenuItem>
            </>
          )}

          {showMode && (
            <>
              <div className="flex items-center border-b border-gray-200 dark:border-neutral-700 py-3.5 px-2.5">
                <ChevronLeft size={18} onClick={() => setShowMode(false)} />
                <p className="font-bold ml-1">Switch Mode</p>
                {theme === "dark" ? (
                  <Moon size={20} className="ml-auto" />
                ) : (
                  <Sun size={20} className="ml-auto" />
                )}
              </div>

              <Label htmlFor="dark-mode" className="menuItem">
                DarkMode
                <DropdownMenuItem className="ml-auto p-0">
                  <Switch
                    id="dark-mode"
                    className="ml-auto"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                    }}
                  />
                </DropdownMenuItem>
              </Label>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {open && <BackDrop onClick={() => setOpen(!open)} />} */}
    </>
  );
};

export default MoreDropdown;
