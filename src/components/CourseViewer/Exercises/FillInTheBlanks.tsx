import type { FillInTheBlankExercise } from "../../../pages/myCourse/[courseId]";
import FillInTheBlank from "../FillInTheBlank";

export default function FillInTheBlanks({
  exercise,
  checkAnswer,
  reset,
}: {
  exercise: FillInTheBlankExercise;
  checkAnswer: boolean;
  reset: boolean;
}) {
  return (
    <ul>
      {exercise.exerciseItems.map((exerciseItem, index) => {
        return (
          <li key={exerciseItem.id} className="flex">
            {exercise.exerciseItems.length > 1 && (
              <span className="mr-2">{index + 1}.</span>
            )}
            <FillInTheBlank
              blanks={exerciseItem.blanks}
              sentence={exerciseItem.sentence}
              checkAnswer={checkAnswer}
              reset={reset}
            />
          </li>
        );
      })}
    </ul>
  );
}
