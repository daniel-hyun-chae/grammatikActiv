import { FormEvent, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import * as Label from "@radix-ui/react-label";
import * as Dialog from "@radix-ui/react-dialog";

export default function Publisher() {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <div className="px-5">
      <div className="flex justify-between">
        <h1 className="text-2xl">My Publications</h1>
        <CreateNewCourseDialog />
        {/* <button
          className="rounded-full bg-violet-600 px-5 py-2"
          onClick={() => {
            setModalOpened(true);
          }}
        >
          Publish a new course
        </button> */}
      </div>
    </div>
  );
}

function CreateNewCourseDialog() {
  function onSubmitHandler(e: FormEvent) {
    e.preventDefault();
    console.log("reached");
    console.log(e.target);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="">Edit profile</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-700/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5">
          <Dialog.Title className="mb-2 text-lg font-semibold text-gray-800">
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
              />
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="submit"
                  name="course-create-form"
                  className="justify-self-end rounded bg-green-100 px-3 py-2 font-medium text-green-700"
                >
                  Save course
                </button>
              </Dialog.Close>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4"
              aria-label="Close"
            >
              <XMarkIcon className="h-4 w-4 text-violet-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
