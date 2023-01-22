import { BookOpenIcon } from "@heroicons/react/24/solid";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import Link from "next/link";

export default function MyCourse() {
  const { data: courses, isLoading } = trpc.course.getAll.useQuery();
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <div className="pt-10">
      <ul className="[COURSE-LIST] grid grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses?.map((course) => {
          return (
            <li
              key={course.id}
              className="[COURSE] flex flex-col items-center justify-center"
            >
              {course.coverImageUrl && (
                <div className="relative mb-2">
                  <Image
                    src={course.coverImageUrl}
                    width={200}
                    height={266}
                    alt={course.title}
                  />
                  <Link
                    href={`/myCourse/${course.id}`}
                    className="absolute top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center font-semibold text-transparent hover:bg-neutral-700/80 hover:text-neutral-200"
                  >
                    <BookOpenIcon className="h-6 w-6" />
                    <span>Open Course</span>
                  </Link>
                </div>
              )}
              <div className="flex flex-col items-center">
                <div>{course.title}</div>
                <div>{course.publisher}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
