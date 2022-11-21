import type { FormEvent } from "react";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import * as Label from "@radix-ui/react-label";
import * as Dialog from "@radix-ui/react-dialog";
import { trpc } from "../../utils/trpc";
import ImageUploader from "../../components/ImageUploader";
import Image from "next/image";
import { PresignedPost } from "aws-sdk/clients/s3";

import { env } from "../../env/client.mjs";

export default function Publisher() {
  const { data: courses, isLoading } = trpc.course.getAll.useQuery();
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <div className="px-5">
      <div className="flex justify-between">
        <h1 className="text-2xl">My Publications</h1>
        <NewCourseCreationDialog />
      </div>
      <div className="grid">
        <ul>
          {courses?.map((course) => {
            return (
              <li key={course.id}>
                <div>{course.title}</div>
                <div>{course.publisher}</div>
                {course.coverImageUrl && (
                  <Image
                    src={course.coverImageUrl}
                    width={300}
                    height={300}
                    alt={course.title}
                  />
                )}
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

  const postCourse = trpc.course.postCourse.useMutation({
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

  // async function handleFileUpload(file: File) {
  //   try {
  //     if (!file) return;
  //     const imageUrl = postImage.mutateAsync({
  //       file,
  //     });
  //     console.log(imageUrl);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function handleFileUpload(file: File) {
    try {
      const fileName = file.name;
      const fileExtension = fileName.split(".").at(-1) as string;
      console.log("filename", fileName);
      console.log("fileExtension", fileExtension);

      const preSignedPost = await postImage.mutateAsync({
        fileExtension,
      });

      // const url = await postImage.mutateAsync({
      //   fileExtension,
      // });

      // if (url) {
      //   await fetch(url, {
      //     method: "PUT",
      //     body: file,
      //   });

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
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5">
          <Dialog.Title className="mb-2 text-xl font-semibold text-gray-800">
            Create a course
          </Dialog.Title>
          <Dialog.Description className="mb-3 text-gray-400">
            Fill in the required information for the course creation and save
            it.
          </Dialog.Description>
          <form
            className="flex flex-col space-y-5"
            onSubmit={onSubmitHandler}
            id="course-create-form"
          >
            <div className="flex items-center gap-5 text-violet-500">
              <Label.Root className="w-1/5" htmlFor="title">
                Course title:
              </Label.Root>
              <input
                className="grow rounded py-2 px-3 ring-1 ring-violet-300 focus:outline-0 focus:ring-2 focus:ring-violet-400"
                type="text"
                id="title"
                placeholder="Enter the course title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
            </div>
            <div className="flex items-center gap-5 text-violet-500 ">
              <Label.Root className="w-1/5" htmlFor="publisher">
                Publisher:
              </Label.Root>
              <input
                className="grow rounded py-2 px-3 ring-1 ring-violet-300 focus:outline-0 focus:ring-2 focus:ring-violet-400"
                type="text"
                id="publisher"
                placeholder="Enter the course publisher"
                value={formData.publisher}
                onChange={(e) => {
                  setFormData({ ...formData, publisher: e.target.value });
                }}
              />
            </div>
            <ImageUploader
              onChange={handleFileUpload}
              imageUrl={formData.coverImageUrl || ""}
            />
            <div className="flex justify-end">
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
              className="absolute top-4 right-4"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5 text-violet-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
