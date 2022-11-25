import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function CourseContent() {
  type Chapter = {
    chapterNumber: number;
    chapterTitle: string;
  };
  const [chapters, setChapters] = useState<Chapter[]>([]);
  return (
    <div className="flex h-full p-10">
      <div className="[SIDEBAR] h-full border-r px-5 dark:bg-neutral-800">
        {chapters.length === 0 && (
          <div>
            <div className="flex cursor-pointer items-center space-x-2">
              <PlusCircleIcon className="h-5 w-5 text-cyan-600" />
              <span className="semib text-cyan-600">Add a chapter</span>
            </div>
            <div className="flex flex-col">
              <label>Chapter title: </label>
              <input type="text" />
            </div>
          </div>
        )}
      </div>
      <div className="[CONTENT]">Content planner</div>
    </div>
  );
}
