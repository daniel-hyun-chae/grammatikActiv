import * as Tabs from "@radix-ui/react-tabs";

export default function TabsContent<T extends string[] = never>({
  tabsValue,
  children,
}: {
  tabsValue: T extends { length: 1 } ? never : T[number];
  children: React.ReactNode;
}) {
  return (
    <Tabs.TabsContent className="h-full w-full" value={tabsValue}>
      {children}
    </Tabs.TabsContent>
  );
}
