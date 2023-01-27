import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FillInTheBlankExercise,
  FillInTheBlankItem,
  SentencePair,
} from "../../pages/myCourse/[courseId]";
import FillInTheBlank from "./FillInTheBlank";

export default function ConnectSentence({
  sentencePairs,
  checkAnswer,
  reset,
}: {
  sentencePairs: SentencePair[];
  checkAnswer: boolean;
  reset: boolean;
}) {
  //Function to extract id of sentence pairs
  function createSentencePairIdList(sentencePairs: SentencePair[]) {
    return sentencePairs.reduce(
      (accumulator, currentValue) => [...accumulator, currentValue.id],
      [] as string[]
    );
  }

  const sentencePairIds = useRef(createSentencePairIdList(sentencePairs));
  const shuffledSentencePairIdsLeftRef = useRef<string[]>([]);
  const shuffledSentencePairIdsRightRef = useRef<string[]>([]);

  type Item = {
    id: string;
    node: HTMLDivElement;
  };
  const leftItemsRef = useRef<Array<Item>>([]);
  const rightItemsRef = useRef<Array<Item>>([]);

  // Ref to keep an left and right box node
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);

  const svgBoxRefCallback = useCallback((node: HTMLDivElement) => {
    setSvgBox(node);
    setSvgBoxWidth(svgBox?.clientWidth);
  }, []);

  const [leftBox, setLeftBox] = useState<HTMLDivElement | null>(null);
  const [rightBox, setRightBox] = useState<HTMLDivElement | null>(null);
  const [svgBox, setSvgBox] = useState<HTMLDivElement | null>(null);

  const [svgBoxWidth, setSvgBoxWidth] = useState(0);

  useEffect(() => {
    shuffledSentencePairIdsLeftRef.current = _.shuffle(sentencePairIds.current);
    shuffledSentencePairIdsRightRef.current = _.shuffle(
      sentencePairIds.current
    );
    setLeftBox(leftBoxRef.current);
    setRightBox(rightBoxRef.current);
  }, []);

  useEffect(() => {
    function handleResize() {
      setSvgBoxWidth(svgBox?.clientWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  type Connection = {
    left: string;
    right: string;
  };

  type InConnection = {
    side: "left" | "right" | null;
    id: string | null;
  };

  const [connections, setConnections] = useState<Connection[]>([]);
  const [inConnection, setinConnection] = useState<InConnection>({
    side: null,
    id: null,
  });

  useEffect(() => {
    if (reset) {
      setConnections([]);
    }
  }, [reset]);

  const getYcoornidate = (side: "left" | "right", id: string) => {
    if (side === "left") {
      const item = leftItemsRef.current.find((item) => {
        return item.id === id;
      });
      if (item && item.node && leftBox) {
        return (
          item?.node.offsetTop -
          leftBox?.offsetTop +
          item?.node.clientHeight / 2
        );
      }
    } else {
      const item = rightItemsRef.current.find((item) => {
        return item.id === id;
      });
      if (item && item.node && rightBox) {
        return (
          item?.node.offsetTop -
          rightBox?.offsetTop +
          item?.node.clientHeight / 2
        );
      }
    }
  };

  return (
    <div className="flex flex-auto">
      <div className="[LEFT-BOX] shrink space-y-2" ref={leftBoxRef}>
        {shuffledSentencePairIdsLeftRef.current.map((id) => {
          const pair = sentencePairs.find((sentencePair) => {
            return sentencePair.id === id;
          });
          if (pair) {
            return (
              <div
                key={pair.id + "leftSentence"}
                className="flex items-center justify-end space-x-2"
                ref={(node) => {
                  if (node) {
                    leftItemsRef.current.push({
                      id: pair.id,
                      node,
                    });
                  } else {
                    leftItemsRef.current = leftItemsRef.current.filter(
                      (item) => {
                        return item.id !== pair.id;
                      }
                    );
                  }
                }}
              >
                {typeof pair.left === "string" && <div>{pair.left}</div>}
                {isFillInTheblank(pair.left) && (
                  <FillInTheBlank
                    sentence={pair.left.sentence}
                    blanks={pair.left.blanks}
                    checkAnswer={checkAnswer}
                    reset={reset}
                  />
                )}
              </div>
            );
          }
        })}
      </div>
      {leftBox && rightBox && (
        <div
          className="[SVG-BOX] h-full basis-1/3 overflow-hidden"
          ref={svgBoxRefCallback}
        >
          {svgBox && (
            <svg
              className="h-full w-full"
              viewBox={`0 0 ${svgBoxWidth} ${
                leftBox.clientHeight > rightBox.clientHeight
                  ? leftBox.clientHeight
                  : rightBox.clientHeight
              }`}
            >
              <>
                {shuffledSentencePairIdsLeftRef.current.map((child) => {
                  const currentLeftItem = leftItemsRef.current.find(
                    (leftItem) => {
                      return leftItem.id === child;
                    }
                  ) as Item;

                  const clickable =
                    connections.find((connection) => {
                      return connection.left === currentLeftItem.id;
                    }) === undefined &&
                    !(
                      inConnection.side === "left" &&
                      inConnection.id === currentLeftItem.id
                    );

                  return (
                    <circle
                      className={`fill-cyan-600 stroke-cyan-600 stroke-2 ${
                        currentLeftItem.id
                      }
                  ${
                    clickable && "cursor-pointer hover:fill-amber-500"
                  }                      
                  ${
                    inConnection.side === "left" &&
                    inConnection.id === currentLeftItem.id
                      ? "fill-amber-600"
                      : null
                  }`}
                      key={currentLeftItem.id + "leftCircle"}
                      onClick={() => {
                        if (clickable) {
                          if (inConnection.side === "right") {
                            setConnections([
                              ...connections,
                              {
                                right: inConnection.id as string,
                                left: currentLeftItem.id,
                              },
                            ]);
                            setinConnection({
                              side: null,
                              id: null,
                            });
                          } else {
                            setinConnection({
                              side: "left",
                              id: currentLeftItem.id,
                            });
                          }
                        }
                      }}
                      cy={
                        currentLeftItem.node.offsetTop -
                        leftBox.offsetTop +
                        currentLeftItem.node.clientHeight / 2
                      }
                      cx="10%"
                      r={8}
                    />
                  );
                })}
                {shuffledSentencePairIdsRightRef.current.map((child) => {
                  const currentRightItem = rightItemsRef.current.find(
                    (item) => {
                      return item.id === child;
                    }
                  ) as Item;
                  const clickable =
                    connections.find((connection) => {
                      return connection.right === currentRightItem.id;
                    }) === undefined &&
                    !(
                      inConnection.side === "right" &&
                      inConnection.id === currentRightItem.id
                    );
                  return (
                    <circle
                      onClick={() => {
                        if (clickable) {
                          if (inConnection.side === "left") {
                            setConnections([
                              ...connections,
                              {
                                right: currentRightItem.id,
                                left: inConnection.id as string,
                              },
                            ]);
                            setinConnection({
                              side: null,
                              id: null,
                            });
                          } else {
                            setinConnection({
                              side: "right",
                              id: currentRightItem.id,
                            });
                          }
                        }
                      }}
                      key={currentRightItem.id + "rightCircle"}
                      cy={
                        currentRightItem.node.offsetTop -
                        rightBox.offsetTop +
                        currentRightItem.node.clientHeight / 2
                      }
                      cx="90%"
                      r={8}
                      className={`cursor-pointer fill-cyan-600 stroke-cyan-600 stroke-2 ${
                        clickable && "hover:fill-amber-500"
                      }
                    ${
                      inConnection.side === "right" &&
                      inConnection.id === currentRightItem.id
                        ? "fill-amber-600"
                        : null
                    }
                  `}
                    />
                  );
                })}
                {checkAnswer && [
                  ...connections
                    .filter((connection) => {
                      return connection.left === connection.right;
                    })
                    .map((correctConnection) => {
                      return (
                        <line
                          className="fill-green-600 stroke-green-600"
                          onClick={() => {
                            const left = correctConnection.left;
                            const newConnections = connections.filter(
                              (connection) => {
                                return connection.left !== left;
                              }
                            );
                            setConnections(newConnections);
                          }}
                          strokeWidth={4}
                          x1="10%"
                          x2="90%"
                          y1={getYcoornidate("left", correctConnection.left)}
                          y2={getYcoornidate("right", correctConnection.right)}
                          key={correctConnection.left + correctConnection.right}
                        />
                      );
                    }),
                  ...connections
                    .filter((connection) => {
                      return connection.left !== connection.right;
                    })
                    .map((correctConnection) => {
                      return (
                        <>
                          <line
                            className="fill-neutral-300 stroke-neutral-300"
                            onClick={() => {
                              const left = correctConnection.left;
                              const newConnections = connections.filter(
                                (connection) => {
                                  return connection.left !== left;
                                }
                              );
                              setConnections(newConnections);
                            }}
                            strokeWidth={4}
                            x1="10%"
                            x2="90%"
                            y1={getYcoornidate("left", correctConnection.left)}
                            y2={getYcoornidate(
                              "right",
                              correctConnection.right
                            )}
                          />
                          <line
                            className="fill-red-600 stroke-red-600"
                            onClick={() => {
                              const left = correctConnection.left;
                              const newConnections = connections.filter(
                                (connection) => {
                                  return connection.left !== left;
                                }
                              );
                              setConnections(newConnections);
                            }}
                            strokeWidth={4}
                            x1="10%"
                            x2="90%"
                            y1={getYcoornidate("left", correctConnection.left)}
                            y2={getYcoornidate("right", correctConnection.left)}
                          />
                        </>
                      );
                    }),
                  ...sentencePairIds.current
                    .filter((id) => {
                      return !connections.find((connection) => {
                        return connection.left === id;
                      });
                    })
                    .map((notSubmitted) => {
                      return (
                        <line
                          className="fill-red-600 stroke-red-600"
                          onClick={() => {
                            const left = notSubmitted;
                            const newConnections = connections.filter(
                              (connection) => {
                                return connection.left !== left;
                              }
                            );
                            setConnections(newConnections);
                          }}
                          strokeWidth={4}
                          x1="10%"
                          x2="90%"
                          y1={getYcoornidate("left", notSubmitted)}
                          y2={getYcoornidate("right", notSubmitted)}
                          key={notSubmitted}
                        />
                      );
                    }),
                ]}
                {!checkAnswer &&
                  connections.map((connection) => {
                    return (
                      <line
                        className="fill-cyan-600 stroke-cyan-600 hover:cursor-pointer hover:stroke-amber-600"
                        onClick={() => {
                          const left = connection.left;
                          const newConnections = connections.filter(
                            (connection) => {
                              return connection.left !== left;
                            }
                          );
                          setConnections(newConnections);
                        }}
                        strokeWidth={4}
                        x1="10%"
                        x2="90%"
                        y1={getYcoornidate("left", connection.left)}
                        y2={getYcoornidate("right", connection.right)}
                        key={connection.left + connection.right}
                      />
                    );
                  })}
              </>
            </svg>
          )}
        </div>
      )}
      <div className="[RIGHT-BOX] shrink space-y-2" ref={rightBoxRef}>
        {shuffledSentencePairIdsRightRef.current.map((id) => {
          const pair = sentencePairs.find((sentencePair) => {
            return sentencePair.id === id;
          });
          if (pair) {
            return (
              <div
                key={pair.id + "rightSentence"}
                className="flex items-center space-x-2"
                ref={(node) => {
                  if (node) {
                    rightItemsRef.current.push({
                      id: pair.id,
                      node,
                    });
                  } else {
                    rightItemsRef.current = rightItemsRef.current.filter(
                      (item) => {
                        return item.id !== pair.id;
                      }
                    );
                  }
                }}
              >
                {typeof pair.right === "string" && <div>{pair.right}</div>}
                {isFillInTheblank(pair.right) && (
                  <FillInTheBlank
                    sentence={pair.right.sentence}
                    blanks={pair.right.blanks}
                    checkAnswer={checkAnswer}
                    reset={reset}
                  />
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

function isFillInTheblank(
  exerciseItem: string | FillInTheBlankItem
): exerciseItem is FillInTheBlankItem {
  return (exerciseItem as FillInTheBlankItem).sentence !== undefined;
}
