import { getServerSession } from "next-auth";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import Profile from "./Profile";
import MoreDropdown from "./MoreDropdown";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SideNav = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white dark:bg-neutral-950">
      <div className="md:h-full fixed bottom-0 z-50 -ml-3 flex h-16 w-full flex-1 flex-row justify-evenly space-x-2 border-t md:relative md:ml-0 md:justify-between md:border-none md:flex-col md:space-x-0 md:space-y-2 p-2">
        <Logo />
        <NavLinks />
        {session?.user && <Profile />}
      </div>

      <div className="hidden md:flex relative md:mt-auto flex-1 items-end w-full">
        <MoreDropdown />
      </div>
    </div>
  );
};

export default SideNav;
