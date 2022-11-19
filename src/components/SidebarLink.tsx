import Link from "next/link";

export default function SidebarLink({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg px-5 py-2 hover:bg-gray-800">
      {text}
    </Link>
  );
}
