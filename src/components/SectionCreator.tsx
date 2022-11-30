import {
  ChevronUpDownIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Collapsible from "@radix-ui/react-collapsible";
import { sectionFormSchema } from "../types/section";
import { useRouter } from "next/router";

import type { SectionForm } from "../types/section";
import type { SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";

type SectionCreatorInitialProps = {
  initial: true;
  number?: undefined;
  title?: undefined;
  sectionId: null;
};

type SectionCreatorProps = {
  initial?: false;
  sectionId: string;
  number: number;
  title: string;
};

function SectionCreationForm({
  onSubmitCallback,
  sectionId = null,
}: {
  onSubmitCallback: () => void;
  sectionId: string | null;
}) {
  const router = useRouter();

  const { register, handleSubmit } = useForm<SectionForm>({
    resolver: zodResolver(sectionFormSchema),
  });

  const postSession = trpc.section.postSection.useMutation();

  const onSubmitHandler: SubmitHandler<SectionForm> = (data) => {
    postSession.mutate({
      sectionId,
      courseId: router.query.id,
      title: data.title,
    });
    onSubmitCallback();
  };

  return (
    <form
      className="flex flex-col pl-7"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <input
        className="mt-2 border-b bg-transparent p-1 text-sm"
        placeholder="Enter section title"
        type="text"
        {...register("title")}
      />
      <div className="mt-2 flex justify-end space-x-1">
        <button
          className="rounded bg-slate-500 p-1 text-sm font-semibold text-neutral-100"
          onClick={() => {
            onSubmitCallback();
          }}
        >
          Cancel
        </button>
        <button
          className="rounded bg-cyan-500 p-1 text-sm font-semibold text-neutral-100"
          type="submit"
        >
          Save Section
        </button>
      </div>
    </form>
  );
}

export default function SectionCreator({
  title,
  sectionId,
  initial = false,
}: SectionCreatorProps | SectionCreatorInitialProps) {
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  const sectionCreationFormCallback = () => {
    setSectionFormOpen(false);
  };

  if (initial) {
    return (
      <>
        {!sectionFormOpen && (
          <button
            className="flex items-center space-x-2 text-cyan-500"
            onClick={() => {
              setSectionFormOpen(true);
            }}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add a section</span>
          </button>
        )}
        {sectionFormOpen && (
          <SectionCreationForm
            sectionId={null}
            onSubmitCallback={sectionCreationFormCallback}
          />
        )}
      </>
    );
  } else {
    return (
      <div>
        <Collapsible.Root open={sectionOpen} onOpenChange={setSectionOpen}>
          <div className="[SECTION-HEADER] group flex items-center justify-between">
            <div className="[SECTION-HEADER-LEFT] flex items-center space-x-2">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    className={`invisible ${
                      !sectionFormOpen && "group-hover:visible"
                    }`}
                  >
                    <button
                      className="flex items-center"
                      onClick={() => {
                        setSectionFormOpen(true);
                      }}
                    >
                      <PlusIcon
                        className={`h-5 w-5 rounded hover:bg-neutral-100  hover:dark:bg-neutral-700`}
                      />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      sideOffset={5}
                      className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
                    >
                      Click to add a new section below
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
              <span>{title}</span>
            </div>
            <Collapsible.Trigger asChild>
              <button>
                <ChevronUpDownIcon className="h-5 w-5" />
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content className="pl-10"></Collapsible.Content>
        </Collapsible.Root>
        {sectionFormOpen && (
          <SectionCreationForm
            sectionId={sectionId}
            onSubmitCallback={sectionCreationFormCallback}
          />
        )}
      </div>
    );
  }
}
