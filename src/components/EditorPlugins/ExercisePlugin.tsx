/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DOMConversionMap,
  EditorConfig,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

import { ElementNode } from "lexical";
import React from "react";
import { useEffect } from "react";

export const INSERT_EXERCISE_COMMAND = createCommand<void>();

export default function ExercisePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (
      !editor.hasNodes([
        // ExerciseContainerNode,
        // ExerciseTitleNode,
        // ExerciseContentNode,
      ])
    ) {
      throw new Error(
        "ExercisePlugin: ExerciseContainerNode, ExerciseTitleNode, or ExerciseContentNode not registered on editor"
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_EXERCISE_COMMAND,
        () => {
          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            const container = $createExerciseContainerNode();
            selection.insertNodes([container]);
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
  return null;
}

class ExerciseContainerNode extends ElementNode {
  constructor(key?: NodeKey) {
    super(key);
  }

  static getType(): string {
    return "exercise-container";
  }

  static clone(node: ExerciseContainerNode): ExerciseContainerNode {
    return new ExerciseContainerNode(node.__key);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("article");
    dom.classList.add("bg-white border rounded");
    return dom;
  }

  updateDOM(_previousNode: ExerciseContainerNode, _dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(
    _serializedNode: SerializedExerciseContainerNode
  ): ExerciseContainerNode {
    const node = $createExerciseContainerNode();
    return node;
  }

  exportJSON(): SerializedExerciseContainerNode {
    return {
      ...super.exportJSON(),
      type: "exercise-container",
      version: 1,
    };
  }
}

type SerializedExerciseContainerNode = Spread<
  { type: "exercise-container"; version: 1 },
  SerializedElementNode
>;

export function $createExerciseContainerNode(): ExerciseContainerNode {
  return new ExerciseContainerNode();
}
