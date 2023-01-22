import { useEffect, useState } from "react";
import ConnectSentence from "../../../components/CourseViewer/ConnectSentence";
import FillInTheBlank from "../../../components/CourseViewer/FillInTheBlank";
import { Button } from "../../../components/ui/Button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Exercise = {
  id: string;
  title: string;
  exerciseItems: ExerciseItem[];
};

type ExerciseItem = FillInTheBlank | ConnectSentence;

type FillInTheBlank = {
  id: string;
  type: "fillInTheBlank";
  sentenceArray: string[];
  blanks: number[];
};

type ConnectSentence = {
  id: string;
  type: "connectSentence";
  sentencePairs: SentencePair[];
};

export type SentencePair = {
  left: string | FillInTheBlank;
  right: string | FillInTheBlank;
  id: string;
};

export default function MyCourse() {
  const [exercises] = useState<Exercise[]>([
    {
      id: "exerciseId0",
      title: "Was passt zusammen? Kombinieren Sie.",
      exerciseItems: [
        {
          id: "111111",
          type: "connectSentence",
          sentencePairs: [
            {
              id: "test",
              left: "Ich",
              right: "kommen aus China",
            },
            {
              id: "test2",
              left: "due",
              right: "arbeitest in Frankfurt",
            },
            {
              id: "test3",
              left: "test3left",
              right: "test3Right",
            },
          ],
        },
      ],
    },
    {
      id: "exerciseId1",
      title: "Ergänzen Sie die Pronomen.",
      exerciseItems: [
        {
          id: "1111111",
          type: "fillInTheBlank",
          sentenceArray: ["Sie", "sprechen", "Deutsch."],
          blanks: [0],
        },
        {
          id: "2222222",
          type: "fillInTheBlank",
          sentenceArray: ["Haben", "Sie", "Zeit?"],
          blanks: [1],
        },
        {
          id: "333333",
          type: "fillInTheBlank",
          sentenceArray: ["Hilfst", "du", "mir?"],
          blanks: [1],
        },
        {
          id: "4444444",
          type: "fillInTheBlank",
          sentenceArray: ["Er", "ist", "Programmierer."],
          blanks: [0],
        },
      ],
    },
    {
      id: "exerciseId2",
      title: "Ergänzen Sie die Pronomen.",
      exerciseItems: [
        {
          id: "1111111",
          type: "fillInTheBlank",
          sentenceArray: [
            "Das ist Herr Gupta,",
            "er",
            "kommt aus Indien",
            "\n",
            "Das ist Frau Kioka,",
            "sie",
            "kommt aus Japan.",
            "\n",
            "Herr Gupta und Frau Kioka sind in Berlin.",
            "Sie",
            "learnen Deutsch.",
          ],
          blanks: [1, 5, 9],
        },
        {
          id: "2222222",
          type: "fillInTheBlank",
          sentenceArray: [
            "🟣 Hallo, Anna, woher kommst",
            "du",
            "?",
            "🟠",
            "Ich",
            "komme aus New York.",
          ],
          blanks: [1, 4],
        },
      ],
    },
  ]);

  const [sideBarOpen, setSideBarOpen] = useState(false);

  function SideBarItem({ text }: { text: string }) {
    return <li className="py-2 text-white">{text}</li>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* <div className="h-full w-96 border-r">side</div> */}
      <Dialog.Root>
        <div className="flex items-center space-x-4 border-b border-neutral-600 py-2 px-3">
          <Dialog.Trigger asChild>
            <button>
              <Bars3Icon className="h-5 w-5" />
            </button>
          </Dialog.Trigger>
          <span>Unit title</span>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 overflow-auto bg-neutral-700/50">
            <Dialog.DialogContent className="relative min-h-full w-10/12 bg-neutral-800">
              <ul className="p-5">
                <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" />
                <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" /> <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" /> <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" /> <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" /> <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" /> <SideBarItem text="Unit1" />
                <SideBarItem text="Unit2" />
                <SideBarItem text="Unit3" />
                <SideBarItem text="Unit4" />
              </ul>
              <Dialog.Close asChild>
                <button
                  className="absolute top-5 right-5 h-5 w-5 text-white"
                  aria-label="Close"
                >
                  <XMarkIcon />
                </button>
              </Dialog.Close>
            </Dialog.DialogContent>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>

      {sideBarOpen && <div>sideBar</div>}
      <div className="h-full grow px-3 py-5">
        <Exercises exercises={exercises} />
      </div>
    </div>
  );
}

function Exercise({ exercise }: { exercise: Exercise }) {
  const [checkAnswer, setCheckAnswer] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    setReset(false);
  }, [reset, setReset]);

  return (
    <div key={exercise.id} className="border-b pb-3">
      <div className="font-semibold">{exercise.title}</div>
      <ul className="mb-2">
        {exercise.exerciseItems.map((exerciseItem, index) => {
          return (
            <li key={exerciseItem.id} className="flex">
              <span className="mr-2">{index + 1}.</span>
              {exerciseItem.type === "fillInTheBlank" && (
                <FillInTheBlank
                  blanks={exerciseItem.blanks}
                  sentenceArray={exerciseItem.sentenceArray}
                  checkAnswer={checkAnswer}
                  reset={reset}
                />
              )}
              {exerciseItem.type === "connectSentence" && (
                <ConnectSentence sentencePairs={exerciseItem.sentencePairs} />
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end space-x-3">
        <Button
          label="Reset answers"
          onClick={() => {
            setCheckAnswer(false);
            setReset(true);
          }}
        />
        <Button
          disabled={checkAnswer}
          label="Check answers"
          onClick={() => {
            setCheckAnswer(true);
          }}
        />
      </div>
    </div>
  );
}

function Exercises({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="space-y-5">
      {exercises.map((exercise) => {
        return <Exercise key={exercise.id} exercise={exercise} />;
      })}
    </div>
  );
}
