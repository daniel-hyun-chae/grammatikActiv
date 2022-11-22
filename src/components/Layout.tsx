import {
  Bars3Icon,
  UserCircleIcon,
  CursorArrowRippleIcon,
} from "@heroicons/react/24/solid";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import SidebarLink from "./SidebarLink";
import TopNavLink from "./TopNavLink";

export default function Layout({
  children,
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  children: ReactNode;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}) {
  function toggleDarkMode() {
    localStorage.setItem("darkMode", String(!darkMode));
    setDarkMode(!darkMode);
  }
  return (
    <div className="[APP] flex h-screen w-screen flex-col overflow-hidden text-sm dark:bg-gray-900 dark:text-gray-200">
      <div className="[TOP-BAR] sticky flex w-screen items-center justify-between p-1 ">
        <div className="TOP-BAR-LEFT flex	basis-4/12 items-center space-x-5">
          <Bars3Icon className="hidden h-7 w-7 lg:block" />
          <div className="flex items-center space-x-2">
            <CursorArrowRippleIcon className="h-12 w-12 text-violet-400" />
            <span className="text-md font-titilium font-semibold  lg:text-lg">
              Interactive Learning
            </span>
          </div>
        </div>
        <div className="TOP-BAR-MIDDLE flex basis-4/12 justify-center">
          <input
            className="w-full rounded-full px-3 py-2 ring-1 ring-gray-400 focus:outline-0 focus:ring-2"
            placeholder="Search"
          />
        </div>
        <div className="TOP-BAR-RIGHT flex basis-4/12 items-center justify-end space-x-3">
          <nav className="TOP-NAV flex">
            <TopNavLink href="/my-learning" text="My learning" />
            <TopNavLink href="/courses" text="Courses" />
            <TopNavLink href="/publisher" text="Publisher" />
          </nav>
          <div onClick={toggleDarkMode} className="hover:cursor-pointer">
            {darkMode ? (
              <SunIcon className="h-7 w-7" />
            ) : (
              <MoonIcon className="h-7 w-7" />
            )}
          </div>
          <UserCircleIcon className="h-7 w-7" />
        </div>
      </div>
      <div className="[BELOW-TOP-BAR] flex h-18/20 w-full overflow-y-auto pt-3">
        <div className="[SIDE-BAR] hidden lg:visible lg:flex lg:flex-col lg:px-5">
          <nav className="[SIDE-BAR-NAV] flex flex-col">
            <SidebarLink href="/publisher" text="Publisher Home" />
          </nav>
        </div>
        <main className="[MAIN] flex-grow overflow-y-auto">{children}</main>
      </div>
      <nav className="[BOTTOM-BAR] flex h-1/20 w-full justify-center bg-gray-100 lg:hidden">
        <TopNavLink href="/publisher" text="Publisher Home" />
        <TopNavLink href="/publisher" text="Publisher" />
      </nav>
    </div>
  );
}
