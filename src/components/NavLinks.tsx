"use client";
import {
  Clapperboard,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "", icon: Home },
  {
    name: "Search",
    href: "/search",
    icon: Search,
    hideOnMobile: true,
  },
  { name: "Explore", href: "/explore", icon: Compass },
  {
    name: "Reels",
    href: "/reels",
    icon: Clapperboard,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Heart,
    hideOnMobile: true,
  },
  {
    name: "Create",
    href: "/create",
    icon: PlusSquare,
  },
];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", {
                "hidden md:flex ": link.hideOnMobile,
              }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6" />
            <p
              className={cn("hidden lg:block", {
                "font-extrabold": isActive,
              })}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
