import Link from "next/link";

export default function TopNavLink({
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
