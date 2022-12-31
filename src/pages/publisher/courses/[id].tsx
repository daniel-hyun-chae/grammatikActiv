import * as Tabs from "@radix-ui/react-tabs";
import CourseContentCreator from "../../../components/CourseCreator/ContentCreator";
import TabsContent from "../../../components/Tabs/TabsContent";
import TabsTrigger from "../../../components/Tabs/TabsTrigger";

type CourseEditPageTabsValue = [
  "course-advertisement",
  "course-content",
  "course-publish"
];

export default function CourseEditPage() {
  return (
    <Tabs.Root
      className="mt-5 flex h-full w-full flex-col"
      defaultValue="course-content"
    >
      <Tabs.List className="flex w-full items-center justify-center">
        <TabsTrigger<CourseEditPageTabsValue>
          value="course-content"
          text="Course Content"
        />
        <TabsTrigger<CourseEditPageTabsValue>
          value="course-advertisement"
          text="Course Advertisement"
        />
        <TabsTrigger<CourseEditPageTabsValue>
          value="course-publish"
          text="Course Publish"
        />
      </Tabs.List>
      <TabsContent<CourseEditPageTabsValue> tabsValue="course-content">
        <CourseContentCreator />
      </TabsContent>
      <TabsContent<CourseEditPageTabsValue> tabsValue="course-advertisement">
        course ads
      </TabsContent>
      <TabsContent<CourseEditPageTabsValue> tabsValue="course-publish">
        course publish
      </TabsContent>
      <Tabs.Content value="course-publish">test2</Tabs.Content>
    </Tabs.Root>
  );
}
