import Link from "next/link";
import type { HeroIcon } from "../types/icon";

export default function BottomNavLink({
  text,
  href,
  icon,
}: {
  text: string;
  href: string;
  icon: HeroIcon;
}) {
  const Icon = icon;
  return (
    <li className="flex flex-col items-center">
      <Icon className="h-5 w-5" />
      <Link href={href} className="text-xs">
        {text}
      </Link>
    </li>
  );
}
