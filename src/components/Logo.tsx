import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { SwitchCamera } from "lucide-react";

const Logo = () => {
  return (
    <Link
      href="/"
      className={buttonVariants({
        className:
          "navLink !mb-10 hidden md:flex lg:!p-0 lg:hover:bg-transparent",
        variant: "ghost",
        size: "lg",
      })}
    >
      <SwitchCamera className="h-6 w-6 shrink-0 lg:hidden" />
      <div className={`hidden text-xl font-semibold lg:block`}>Pixelgram</div>
    </Link>
  );
};

export default Logo;
