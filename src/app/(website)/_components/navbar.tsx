import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LandingPageNavBar = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        {/* <Menu className="w-8 h-8" /> */}
        <Image alt="logo" src="/logo.svg" width={40} height={40} />
        Video Sharing
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          href="/"
          className={`py-2 px-5 text-lg rounded-full hover:text-[#7320DD] ${
            currentPath === "/"
              ? "text-[#7320DD] font-bold"
              : "text-black font-normal"
          }`}
        >
          Home
        </Link>
        <Link
          href="/pricing"
          className={`py-2 px-5 text-lg rounded-full hover:text-[#7320DD] ${
            currentPath === "/pricing"
              ? "text-[#7320DD] font-bold"
              : "text-black font-normal"
          }`}
        >
          Pricing
        </Link>
        <Link
          href="/contact"
          className={`py-2 px-5 text-lg rounded-full hover:text-[#7320DD] ${
            currentPath === "/contact"
              ? "text-[#7320DD] font-bold"
              : "text-black font-normal"
          }`}
        >
          Contact
        </Link>
      </div>
      <Link href="/auth/sign-in">
        <Button className="text-base flex gap-x-2">
          <User fill="#000" />
          Login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPageNavBar;
