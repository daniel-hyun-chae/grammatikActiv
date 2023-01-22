import { useEffect, useState } from "react";

export default function FillInTheBlank({
  sentenceArray,
  blanks,
  checkAnswer,
  reset,
}: {
  sentenceArray: string[];
  blanks: number[];
  checkAnswer: boolean;
  reset: boolean;
}) {
  return (
    <div className="whitespace-pre-wrap">
      {sentenceArray.map((sentenceElement, index) => {
        return blanks.includes(index) ? (
          <span key={index}>
            {index !== 0 && <span> </span>}
            <Blank
              sentenceElement={sentenceElement}
              checkAnswer={checkAnswer}
              reset={reset}
            />
          </span>
        ) : (
          <span key={index}>
            <span> </span>
            <span>{sentenceElement}</span>
          </span>
        );
      })}
    </div>
  );
}

function Blank({
  sentenceElement,
  checkAnswer,
  reset,
}: {
  sentenceElement: string;
  checkAnswer: boolean;
  reset: boolean;
}) {
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    if (reset) {
      setUserAnswer("");
    }
  }, [reset]);

  const correctAnswer = sentenceElement
    .toLowerCase()
    .split("|")
    .includes(userAnswer.toLowerCase());

  if (checkAnswer) {
    if (correctAnswer) {
      return <span className="text-green-500">{sentenceElement}</span>;
    } else {
      return (
        <>
          <span className="text-red-500 line-through">{userAnswer}</span>
          <span className="text-red-500"> {sentenceElement}</span>
        </>
      );
    }
  } else {
    return (
      <input
        className="border-b bg-neutral-800 text-center"
        size={sentenceElement.length}
        value={userAnswer}
        onChange={(e) => {
          setUserAnswer(e.target.value);
        }}
      />
    );
  }
}
