import type {
  DOMConversionMap,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from "lexical";
import { $createParagraphNode, $isElementNode, ElementNode } from "lexical";

import { $isExerciseContainerNode } from "./ExercisePlugin";
// import { $isExerciseContentNode } from "./ExerciseContentNode";

type SerializedExerciseTitleNode = Spread<
  {
    type: "exercise-title";
    version: 1;
  },
  SerializedElementNode
>;

export class ExerciseTitleNode extends ElementNode {
  static getType(): string {
    return "exercise-title";
  }

  static clone(node: ExerciseTitleNode): ExerciseTitleNode {
    return new ExerciseTitleNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("summary");
    dom.textContent = "Enter exercise title";
    dom.classList.add(
      "text-lg",
      "list-none",
      "font-semibold",
      "px-2",
      "py-1",
      "border-b"
    );
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(): ExerciseTitleNode {
    return $createExerciseTitleNode();
  }

  exportJSON(): SerializedExerciseTitleNode {
    return {
      ...super.exportJSON(),
      type: "exercise-title",
      version: 1,
    };
  }

  // collapseAtStart(): boolean {
  //   this.getParentOrThrow().insertBefore(this);
  //   return true;
  // }

  insertNewAfter(_: RangeSelection, restoreSelection = true): ElementNode {
    const containerNode = this.getParentOrThrow();

    if (!$isExerciseContainerNode(containerNode)) {
      throw new Error(
        "ExerciseTitleNode expects to be child of ExerciseContainerNode"
      );
    }

    // if (containerNode.getOpen()) {
    //   const contentNode = this.getNextSibling() as LexicalNode;
    //   if (!$isExerciseContentNode(contentNode)) {
    //     throw new Error(
    //       "ExerciseTitleNode expects to have ExerciseContentNode sibling"
    //     );
    //   }

    //   const firstChild = contentNode.getFirstChild();
    //   if ($isElementNode(firstChild)) {
    //     return firstChild;
    //   } else {
    //     const paragraph = $createParagraphNode();
    //     contentNode.append(paragraph);
    //     return paragraph;
    //   }
    // } else {
    const paragraph = $createParagraphNode();
    containerNode.insertAfter(paragraph, restoreSelection);
    return paragraph;
    // }
  }
}

export function $createExerciseTitleNode(): ExerciseTitleNode {
  return new ExerciseTitleNode();
}

export function $isExerciseTitleNode(
  node: LexicalNode | null | undefined
): node is ExerciseTitleNode {
  return node instanceof ExerciseTitleNode;
}
