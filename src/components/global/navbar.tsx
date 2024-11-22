// import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = async (props: Props) => {
  //   const user = await currentUser();
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 backdrop-blur-lg z-[100] flex items-center justify-between">
      <aside className="flex item-center">
        <p className="text-3xl font-bold">VAL</p>
        <p className="text-3xl font-bold text-secondary">IDEA</p>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-7 list-none">
          <li>
            <Link href="#features">Key features</Link>
          </li>
          <li>
            <Link href="#howitworks">How it works</Link>
          </li>
          <li>
            <Link href="#getstarted">Get going</Link>
          </li>
          <li>
            <Link href="#benefits">Benefits</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <Link
          href="/scraper"
          className="relative inline-flex overflow-hidden rounded-md p-[2px] cursor-pointer"
        >
          <button className="btn bg-transparent text-white border-white">
            {true ? (
              "Dashboard"
            ) : (
              <>
                Press
                <kbd className="kbd kbd-sm">v</kbd>
                to get started.
              </>
            )}
            {/* user ? "Dashboard" : "Get Started" */}
          </button>
        </Link>
        {true
          ? // <UserButton afterSignOutUrl="/" />
            null
          : null}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
};

export default Navbar;
