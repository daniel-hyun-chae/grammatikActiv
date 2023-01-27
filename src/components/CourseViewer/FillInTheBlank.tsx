import { useEffect, useState } from "react";

export default function FillInTheBlank({
  sentence,
  blanks,
  checkAnswer,
  reset,
}: {
  sentence: string;
  blanks: { start: number; end: number }[];
  checkAnswer: boolean;
  reset: boolean;
}) {
  let currentCursor = 0;

  return (
    <div className="whitespace-pre-wrap">
      {blanks.map((blank) => {
        const beforeBlank = sentence.slice(currentCursor, blank.start);
        const answer = sentence.slice(blank.start, blank.end + 1);
        currentCursor = blank.end + 1;
        return (
          <>
            {beforeBlank && <span>{beforeBlank}</span>}
            <Blank answer={answer} checkAnswer={checkAnswer} reset={reset} />
          </>
        );
      })}
      {currentCursor !== sentence.length && (
        <span>{sentence.slice(currentCursor)}</span>
      )}
    </div>
  );
}

function Blank({
  answer,
  checkAnswer,
  reset,
}: {
  answer: string;
  checkAnswer: boolean;
  reset: boolean;
}) {
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    if (reset) {
      setUserAnswer("");
    }
  }, [reset]);

  const correctAnswer = answer
    .toLowerCase()
    .split("|")
    .includes(userAnswer.toLowerCase());

  if (checkAnswer) {
    if (correctAnswer) {
      return <span className="text-green-500">{answer}</span>;
    } else {
      return (
        <>
          <span className="text-red-500 line-through">{userAnswer}</span>
          <span className="text-red-500"> {answer}</span>
        </>
      );
    }
  } else {
    return (
      <input
        className="border-b text-center dark:bg-neutral-800"
        size={answer.length}
        value={userAnswer}
        onChange={(e) => {
          setUserAnswer(e.target.value);
        }}
      />
    );
  }
}
