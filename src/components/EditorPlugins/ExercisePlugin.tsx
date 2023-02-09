/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type {
  DOMConversionMap,
  EditorConfig,
  NodeKey,
  SerializedElementNode,
  LexicalNode,
  Spread,
} from "lexical";
import { $createParagraphNode } from "lexical";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

import { ElementNode } from "lexical";
import React from "react";
import { useEffect } from "react";
import {
  $createExerciseTitleNode,
  ExerciseTitleNode,
} from "./ExerciseTitleNode";
import {
  $createExerciseContentNode,
  ExerciseContentNode,
} from "./ExerciseContentNode";

export const INSERT_EXERCISE_COMMAND = createCommand<void>();

export default function ExercisePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (
      !editor.hasNodes([
        ExerciseContainerNode,
        ExerciseTitleNode,
        ExerciseContentNode,
      ])
    ) {
      throw new Error(
        "ExercisePlugin: ExerciseContainerNode, ExerciseTitleNode, or ExerciseContentNode not registered on editor"
      );
    }

    return mergeRegister(
      // editor.registerNodeTransform(ExerciseContainerNode, (node) => {
      //   const children = node.getChildren();
      //   if (children.length !== 2) {
      //     for (const child of children) {
      //       node.insertBefore(child);
      //     }
      //     node.remove();
      //   }
      // }),
      editor.registerCommand(
        INSERT_EXERCISE_COMMAND,
        () => {
          editor.update(() => {
            console.log("ran");
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            const title = $createExerciseTitleNode();
            const content = $createExerciseContentNode().append(
              $createParagraphNode()
            );
            const container = $createExerciseContainerNode().append(
              title,
              content
            );
            selection.insertNodes([container]);
            title.selectStart();
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
  return null;
}

export class ExerciseContainerNode extends ElementNode {
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
    dom.classList.add("border", "rounded", "px-2", "py-1");
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
  {
    type: "exercise-container";
    version: 1;
  },
  SerializedElementNode
>;

export function $createExerciseContainerNode(): ExerciseContainerNode {
  return new ExerciseContainerNode();
}

export function $isExerciseContainerNode(
  node: LexicalNode | null | undefined
): node is ExerciseContainerNode {
  return node instanceof ExerciseContainerNode;
}
