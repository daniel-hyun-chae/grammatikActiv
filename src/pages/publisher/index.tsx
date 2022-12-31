import type { FormEvent } from "react";
import { useState } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import * as Label from "@radix-ui/react-label";
import * as Dialog from "@radix-ui/react-dialog";
import { trpc } from "../../utils/trpc";
import ImageUploader from "../../components/ImageUploader";
import Image from "next/image";

import { env } from "../../env/client.mjs";
import Link from "next/link";

export default function Publisher() {
  const { data: courses, isLoading } = trpc.course.getAll.useQuery();
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <div className="p-5">
      <div className="mb-8 flex justify-between">
        <h1 className="text-2xl">My Publications</h1>
        <NewCourseCreationDialog />
      </div>
      <div>
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
                      href={`/publisher/courses/${course.id}`}
                      className="absolute top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center font-semibold text-transparent hover:bg-neutral-700/80 hover:text-neutral-200"
                    >
                      <PencilSquareIcon className="h-6 w-6" />
                      <span>Edit Course</span>
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
    </div>
  );
}

type CreateCourseFormData = {
  title: string;
  publisher: string;
  coverImageUrl: string;
};

function NewCourseCreationDialog() {
  const initialFormData = {
    title: "",
    publisher: "",
    coverImageUrl: "",
  };
  const [formData, setFormData] =
    useState<CreateCourseFormData>(initialFormData);
  const [open, setOpen] = useState(false);

  const utils = trpc.useContext();

  const postCourse = trpc.course.post.useMutation({
    onMutate: () => {
      utils.course.getAll.cancel();
      const optimisticUpdate = utils.course.getAll.getData();
      if (optimisticUpdate) {
        utils.course.getAll.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.course.getAll.invalidate();
    },
  });

  function onSubmitHandler(e: FormEvent) {
    e.preventDefault();

    postCourse.mutate({
      title: formData.title,
      publisher: formData.publisher,
      coverImageUrl: formData.coverImageUrl,
      edition: null,
    });
    setFormData(initialFormData);
    setOpen(false);
  }

  const postImage = trpc.courseImage.postPresignedPost.useMutation();

  async function handleFileUpload(file: File) {
    try {
      const fileName = file.name;
      const fileExtension = fileName.split(".").at(-1) as string;
      const preSignedPost = await postImage.mutateAsync({
        fileExtension,
      });

      if (preSignedPost) {
        const coverImageInForm = new FormData();

        Object.entries({ ...preSignedPost.fields, file }).forEach(
          ([key, value]) => {
            coverImageInForm.append(key, value);
          }
        );

        await fetch(preSignedPost.url, {
          method: "POST",
          body: coverImageInForm,
        });

        console.log(preSignedPost);

        setFormData({
          ...formData,
          coverImageUrl: `https://${env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${preSignedPost.fields.key}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="">Create course</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-700/30" />
        <Dialog.Content className="fixed top-1/3 left-1/2 flex w-11/12 max-w-screen-sm -translate-x-1/2 -translate-y-1/2 flex-col rounded bg-white text-gray-700 dark:bg-neutral-600 dark:text-gray-100 lg:top-1/2">
          <Dialog.Title className="mb-3 border-b px-3 py-2 text-lg font-semibold">
            Create a course
          </Dialog.Title>
          <Dialog.Description className="mb-5 px-4">
            Fill in the required information for the course creation and save
            it.
          </Dialog.Description>
          <form
            className="[FORM] flex flex-col px-4 pb-4"
            onSubmit={onSubmitHandler}
          >
            <div className="[FORM-CONTENT] mb-4 flex">
              <div className="[FORM-CONTENT-LEFT] mr-4 flex flex-col justify-center">
                <ImageUploader
                  onChange={handleFileUpload}
                  imageUrl={formData.coverImageUrl || ""}
                />
              </div>
              <div className="[FORM-COTENT-RIGHT] flex min-w-0 grow flex-col justify-evenly">
                <div className="flex flex-col">
                  <Label.Root htmlFor="title">Course title</Label.Root>
                  <input
                    className="rounded bg-neutral-200 py-2 px-3 ring-1 ring-amber-300 focus:outline-0 focus:ring-2 focus:ring-amber-400 dark:bg-neutral-700"
                    type="text"
                    id="title"
                    placeholder="Enter the course title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <Label.Root htmlFor="publisher">Publisher</Label.Root>
                  <input
                    className="rounded bg-neutral-200 py-2 px-3 ring-1 ring-amber-300 focus:outline-0 focus:ring-2 focus:ring-amber-400 dark:bg-neutral-700"
                    type="text"
                    id="publisher"
                    placeholder="Enter the course publisher"
                    value={formData.publisher}
                    onChange={(e) => {
                      setFormData({ ...formData, publisher: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="[FORM-SUBMIT] flex justify-end">
              <button
                type="submit"
                name="course-create-form"
                className="justify-self-end rounded bg-green-100 px-3 py-2 font-medium text-green-700"
              >
                Save course
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-3 right-3"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
