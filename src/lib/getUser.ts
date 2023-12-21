import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export const getUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!user) {
    throw new Error("You must be sign in");
  }

  return user;
};
