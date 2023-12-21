import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

interface Props {
  user: User;
  isActive?: boolean;
}

const UserAvatar = ({ user, isActive }: Props) => {
  return (
    <Avatar>
      <AvatarImage
        src={user.image || "/blank-profile.svg"}
        alt="profile image"
        className={`${isActive && "ring-2 border-white"}`}
      />
      <AvatarFallback>
        <AvatarImage src="/blank-profile.svg" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
