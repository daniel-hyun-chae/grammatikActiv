import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ConnectSentence from "../../../components/CourseViewer/ConnectSentence";
import { Button } from "../../../components/ui/Button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FillInTheBlanks from "../../../components/CourseViewer/Exercises/FillInTheBlanks";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { TableOfContentCreator } from "../../../components/CourseCreator/TableOfContentCreator";
import { TableOfContent } from "../../../components/TableOfContent";

type ExerciseBase = {
  id: string;
  title: string;
};

export type FillInTheBlankItem = {
  id: string;
  sentence: string;
  blanks: { start: number; end: number }[];
};

type ConnectSentenceItem = {
  id: string;
  left: string | FillInTheBlankItem;
  right: string | FillInTheBlankItem;
};

export type FillInTheBlankExercise = ExerciseBase & {
  type: "fillInTheBlank";
  exerciseItems: FillInTheBlankItem[];
};

type ConntectSentenceExercise = ExerciseBase & {
  type: "connectSentence";
  exerciseItems: ConnectSentenceItem[];
};

type Exercise = FillInTheBlankExercise | ConntectSentenceExercise;

export const currentUnitContext = createContext<{
  currentUnitId: string | null;
  setCurrentUnitId: Dispatch<SetStateAction<string | null>> | null;
}>({ currentUnitId: null, setCurrentUnitId: null });

export default function Course() {
  const router = useRouter();
  const courseId = router.query.courseId as string;
  const { data: course, isLoading } = trpc.course.getById.useQuery(courseId);

  const [exercises] = useState<Exercise[]>([
    {
      id: "exerciseId0",
      title: "Was passt zusammen? Kombinieren Sie.",
      type: "connectSentence",
      exerciseItems: [
        {
          id: "test",
          left: "Ich",
          right: "komme aus China",
        },
        {
          id: "test2",
          left: "du",
          right: "arbeitest in Frankfurt",
        },
        {
          id: "test3",
          left: "test3left",
          right: "test3Right",
        },
      ],
    },
    {
      id: "exerciseId1",
      title: "Ergänzen Sie die Pronomen.",
      type: "fillInTheBlank",
      exerciseItems: [
        {
          id: "1111111",
          sentence: "Sie sprechen Deutsch.",
          blanks: [{ start: 0, end: 2 }],
        },
        {
          id: "2222222",
          sentence: "Haben Sie Zeit?",
          blanks: [{ start: 6, end: 8 }],
        },
        {
          id: "333333",
          sentence: "Hilfst du mir?",
          blanks: [{ start: 7, end: 8 }],
        },
        {
          id: "4444444",
          sentence: "Er ist Programmierer.",
          blanks: [{ start: 0, end: 1 }],
        },
      ],
    },
    {
      id: "exerciseId2",
      title: "Ergänzen Sie die Pronomen.",
      type: "fillInTheBlank",
      exerciseItems: [
        {
          id: "1111111",
          sentence:
            "Das ist Herr Gupta, er kommt aus Indien.\nDas ist Frau Kioka, sie kommt aus Japan.\nHerr Gupta und Frau Kioka sind in Berlin. Sie learnen Deutsch.",
          blanks: [
            { start: 20, end: 21 },
            { start: 61, end: 63 },
          ],
        },
        {
          id: "2222222",
          sentence: "🟣Hallo, Anna, woher kommst du? 🟠Ich komme aus New York.",
          blanks: [
            { start: 28, end: 29 },
            { start: 34, end: 36 },
          ],
        },
        {
          id: "3",
          sentence:
            "🟣Marc und Dominic, wo wohnt ihr? 🟠Wir wohnen in Frankfurt",
          blanks: [
            { start: 29, end: 31 },
            { start: 36, end: 38 },
          ],
        },
      ],
    },
    {
      id: "exerciseId3",
      title: "Kleine Dialoge. Ergänzen Sie die Endungen.",
      type: "fillInTheBlank",
      exerciseItems: [
        {
          id: "1111111",
          sentence:
            "Marc: Woher kommst du?\nAlice: Ich komme aus Brasilien. Das ist meine Freund, er kommt aus Russland.\nMarc: Und wo wohnst ihr?",
          blanks: [
            { start: 16, end: 17 },
            { start: 84, end: 84 },
            { start: 117, end: 118 },
          ],
        },
      ],
    },
    {
      id: "exerciseId4",
      title: "Ergänzen Sie die Endungen.",
      type: "connectSentence",
      exerciseItems: [
        {
          id: "test",
          left: {
            id: "1111111",
            sentence: "Wie heißt du?",
            blanks: [{ start: 7, end: 8 }],
          },
          right: {
            id: "2222222",
            sentence: "Ich heiße Alexander.",
            blanks: [{ start: 7, end: 8 }],
          },
        },
        {
          id: "test1",
          left: {
            id: "3333333",
            sentence: "Kommt ihr mit ins Kino?",
            blanks: [{ start: 7, end: 8 }],
          },
          right: {
            id: "4444444",
            sentence:
              "Nein, leider nicht. Ich arbeite heute bis acht und Jana besucht ihre Eltern. Vielleicht morgen?",
            blanks: [
              { start: 30, end: 30 },
              { start: 62, end: 62 },
            ],
          },
        },
      ],
    },
  ]);

  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);

  if (isLoading) {
    <div>Loading...</div>;
  } else if (!course) {
    router.push("/500");
    return null;
  } else {
    return (
      <currentUnitContext.Provider value={{ currentUnitId, setCurrentUnitId }}>
        <div className="[COURSE] flex h-full flex-col lg:flex-row">
          <div className="[SIDE-MENU] lg:hidden">
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
                      <SideBarItem text="Unit4" />
                      <SideBarItem text="Unit2" />
                      <SideBarItem text="Unit3" />
                      <SideBarItem text="Unit4" />
                      <SideBarItem text="Unit2" />
                      <SideBarItem text="Unit3" />
                      <SideBarItem text="Unit4" />
                      <SideBarItem text="Unit2" />
                      <SideBarItem text="Unit3" />
                      <SideBarItem text="Unit4" />
                      <SideBarItem text="Unit2" />
                      <SideBarItem text="Unit3" />
                      <SideBarItem text="Unit4" />
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
          </div>
          <div className="hidden lg:flex">
            <TableOfContent courseId={courseId} sections={course.sections} />
          </div>
          <div className="[EXERCISES-CONTAINER]h-full grow overflow-y-auto px-3 py-5 ">
            {/* <Exercises exercises={exercises} /> */}
            {currentUnitId}
          </div>
        </div>
      </currentUnitContext.Provider>
    );
  }
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

function Exercise({ exercise }: { exercise: Exercise }) {
  const [checkAnswer, setCheckAnswer] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    setReset(false);
  }, [reset, setReset]);

  return (
    <div key={exercise.id} className="border-b pb-3">
      <div className="font-semibold">{exercise.title}</div>
      {exercise.type === "fillInTheBlank" && (
        <FillInTheBlanks
          exercise={exercise}
          checkAnswer={checkAnswer}
          reset={reset}
        />
      )}
      {exercise.type === "connectSentence" && (
        <ConnectSentence
          sentencePairs={exercise.exerciseItems}
          checkAnswer={checkAnswer}
          reset={reset}
        />
      )}
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

function SideBarItem({ text }: { text: string }) {
  return <li className="py-2 text-neutral-600 dark:text-white">{text}</li>;
}
