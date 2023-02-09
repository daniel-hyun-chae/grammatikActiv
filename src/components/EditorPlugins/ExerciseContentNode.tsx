import type {
  DOMConversionMap,
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
  Spread,
} from "lexical";
import { ElementNode } from "lexical";

type SerializedExerciseContentNode = Spread<
  {
    type: "exercise-content";
    version: 1;
  },
  SerializedElementNode
>;

export class ExerciseContentNode extends ElementNode {
  static getType(): string {
    return "exercise-content";
  }

  static clone(node: ExerciseContentNode): ExerciseContentNode {
    return new ExerciseContentNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(): ExerciseContentNode {
    return $createExerciseContentNode();
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportJSON(): SerializedExerciseContentNode {
    return {
      ...super.exportJSON(),
      type: "exercise-content",
      version: 1,
    };
  }
}

export function $createExerciseContentNode(): ExerciseContentNode {
  return new ExerciseContentNode();
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined
): node is ExerciseContentNode {
  return node instanceof ExerciseContentNode;
}
