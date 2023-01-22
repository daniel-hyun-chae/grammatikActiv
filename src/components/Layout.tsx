import {
  CursorArrowRippleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import {
  PlayCircleIcon,
  MagnifyingGlassCircleIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import BottomNavLink from "./BottomNavLink";
import Link from "next/link";

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
    <div
      className={`[APP] flex h-full min-h-full w-full flex-col overflow-hidden text-gray-700 dark:bg-neutral-800 dark:text-gray-200`}
    >
      <div className="[TOP-BAR-CONTAINER] flex w-full justify-center border-b dark:border-neutral-700">
        <div className="[TOP-BAR] flex max-w-screen-2xl flex-grow items-center justify-between p-2">
          <div className="[TOP-BAR-LEFT] flex items-center space-x-5">
            <div className="[TOP-BAR-LEFT-ICON] flex items-center gap-1">
              <CursorArrowRippleIcon className="h-6 w-6 text-cyan-500" />
              <span className="[TOP-BAR-LEFT-TEXT] text-lg">
                Interactive Learning
              </span>
            </div>
          </div>
          <div className="[TOP-BAR-RIGHT] flex flex-row items-center justify-end gap-3">
            <nav className="hidden lg:block">
              <ul className="flex gap-10">
                <li>
                  <Link href="/courses">Discover Courses</Link>
                </li>
                <li>
                  <Link href="/myCourse">My Courses</Link>
                </li>
                <li>
                  <Link href="/publisher">Publisher</Link>
                </li>
              </ul>
            </nav>
            <div
              onClick={toggleDarkMode}
              className="ml-6 border-gray-500 pl-6 hover:cursor-pointer lg:border-l"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-cyan-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-cyan-500" />
              )}
            </div>
            <UserCircleIcon className="h-7 w-7 text-neutral-800 dark:text-neutral-300" />
          </div>
        </div>
      </div>
      <div className={`[CONTENT-CONTAINER] w-full flex-grow overflow-y-auto`}>
        <div className="[CONTENT] m-auto flex h-full max-w-screen-2xl flex-grow">
          <main className="[CONTENT-MAIN] h-full flex-grow">{children}</main>
        </div>
      </div>
      <nav className="[BOTTOM-BAR-CONTAINER] w-full border-t dark:border-neutral-700 dark:bg-neutral-800 lg:hidden">
        <ul className="flex justify-around gap-3 py-1 ">
          <BottomNavLink
            href="/courses"
            text="Courses"
            icon={MagnifyingGlassCircleIcon}
          />
          <BottomNavLink
            href="/myCourse"
            text="My Courses"
            icon={PlayCircleIcon}
          />
          <BottomNavLink
            href="/publisher"
            text="Publisher"
            icon={PencilSquareIcon}
          />
        </ul>
      </nav>
    </div>
  );
}
