import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorConfig, LexicalNode, NodeKey } from "lexical";
import { $applyNodeReplacement, $createTextNode } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import { COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { TextNode } from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";

// -----------------------------------------------------------NODE--------------------------------------------------------------
export class BlankNode extends TextNode {
  static getType(): string {
    return "blank";
  }

  static clone(node: BlankNode): BlankNode {
    return new BlankNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.classList.add(
      "border-b-4",
      "border-black",
      "border-double",
      "border-cyan-500"
    );
    return element;
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): true {
    return true;
  }
}

export function $isBlankNode(node: LexicalNode | null | undefined) {
  return node instanceof BlankNode;
}

export function $createBlankNode(text = ""): BlankNode {
  // return new BlankNode();
  return $applyNodeReplacement(new BlankNode(text));
}

// -----------------------------------------------------------PLUGIN--------------------------------------------------------------
export const TOGGLE_BLANK_COMMAND = createCommand<void>();

export default function BlankPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([BlankNode])) {
      throw new Error("BlankNodePlugin: BlankNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        TOGGLE_BLANK_COMMAND,
        () => {
          toggleBlank();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(BlankNode, (node) => {
      const textContent = node.getTextContent();
      if (textContent.endsWith(" ")) {
        node.__text = node.__text.slice(0, node.__text.length - 1);
        node.insertAfter($createTextNode(" "));
        node.selectNext();
      }
    });

    return () => {
      removeTransform();
    };
  }, [editor]);
  return null;
}

function toggleBlank() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();

  const blankNodes = nodes.filter((node) => {
    return $isBlankNode(node);
  });

  if (blankNodes.length > 0) {
    blankNodes.forEach((blankNode) => {
      const textNode = $createTextNode(blankNode.__text);
      blankNode.replace(textNode);
    });
    return
  }

  const blankNode = $createBlankNode(nodes[0]?.getTextContent());

  nodes[0]?.insertBefore(blankNode);
  nodes[0]?.remove();
}
