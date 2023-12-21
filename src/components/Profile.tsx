"use client";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import UserAvatar from "./UserAvatar";
// import UserAvatar from "./UserAvatar";

const Profile = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as User;
  const href = `/user/${user.id}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: isActive ? "secondary" : "ghost",
        className: "navLink",
        size: "lg",
      })}
    >
      <UserAvatar user={user} isActive={isActive} />

      <p
        className={cn("hidden lg:block", {
          "font-extrabold": isActive,
        })}
      >
        {user.name}
      </p>
    </Link>
  );
};

export default Profile;
