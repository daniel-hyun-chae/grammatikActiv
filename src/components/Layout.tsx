import {
  Bars3Icon,
  UserCircleIcon,
  CursorArrowRippleIcon,
} from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import SidebarLink from "./SidebarLink";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="APP v-screen w-screen flex-col">
      <div className="TOP-BAR flex w-screen items-center justify-between py-3 px-5">
        <div className="TOP-BAR-LEFT flex	basis-4/12 items-center space-x-5">
          <Bars3Icon className="h-7 w-7" />
          <div className="flex items-center space-x-2">
            <CursorArrowRippleIcon className="h-6 w-6 text-violet-400" />
            <span className="font-titilium text-lg font-semibold">
              Interactive Learning
            </span>
          </div>
        </div>
        <div className="TOP-NAV-MIDDLE flex basis-4/12 justify-center">
          <input className="h-8 w-full rounded-full" />
        </div>
        <div className="TOP-NAV-RIGHT flex basis-4/12 justify-end">
          <UserCircleIcon className="h-8 w-8" />
        </div>
      </div>
      <div className="BELOW-TOP-BAR flex">
        <div className="SIDE-BAR flex flex-col px-5">
          <nav className="SIDE-BAR-NAV flex flex-col">
            <SidebarLink href="/my-learning" text="My learning" />
            <SidebarLink href="/courses" text="Courses" />
            <SidebarLink href="/publisher" text="Publisher" />
          </nav>
        </div>
        <main className="MAIN">{children}</main>
      </div>
    </div>
  );
}
