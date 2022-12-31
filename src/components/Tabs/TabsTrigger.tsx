import * as Tabs from "@radix-ui/react-tabs";

export default function TabsTrigger<T extends string[] = never>({
  value,
  text,
}: {
  value: T extends { length: 1 } ? never : T[number];
  text: string;
}) {
  return (
    <Tabs.Trigger
      className="border-b border-neutral-400 px-10 py-2 data-[state='active']:border-b-2 data-[state='active']:border-cyan-500"
      value={value}
    >
      {text}
    </Tabs.Trigger>
  );
}
