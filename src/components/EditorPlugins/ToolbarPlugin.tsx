import * as Toolbar from "@radix-ui/react-toolbar";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  NotePencil,
} from "phosphor-react";

import { $isAtNodeEnd } from "@lexical/selection";
import type { ElementNode, RangeSelection, TextNode } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { INSERT_EXERCISE_COMMAND } from "./ExercisePlugin";
import { $isBlankNode, TOGGLE_BLANK_COMMAND } from "./BlankNode";

export function getSelectedNode(
  selection: RangeSelection
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [canToggleBlank, setCanToggleBlank] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      // Set canToggleBlank
      const nodes = selection.getNodes();
      if (nodes.find((node) => $isBlankNode(node))) {
        setCanToggleBlank(true);
      } else if (
        selection.getTextContent().startsWith(" ") ||
        selection.getTextContent().endsWith(" ")
      ) {
        setCanToggleBlank(false);
      } else if (nodes.length > 1) {
        setCanToggleBlank(false);
      } else if (selection.anchor.is(selection.focus)) {
        setCanToggleBlank(false);
      } else {
        setCanToggleBlank(true);
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, activeEditor, updateToolbar]);

  return (
    <Toolbar.Root
      className="flex w-full rounded bg-white px-2 py-1 shadow-sm"
      aria-label="Formatting options"
    >
      <div className="space-x-1">
        <Toolbar.Button
          aria-label="Undo"
          disabled={!canUndo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className="group rounded p-1 hover:active:bg-neutral-300"
        >
          <ArrowCounterClockwise
            size={20}
            className="group-disabled:text-neutral-400"
          />
        </Toolbar.Button>
        <Toolbar.Button
          disabled={!canRedo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className="group rounded p-1 hover:enabled:bg-neutral-300"
          aria-label="Redo"
        >
          <ArrowClockwise
            size={20}
            className="group-disabled:text-neutral-400"
          />
        </Toolbar.Button>
      </div>
      <Toolbar.Separator className="ml-1 mr-1 border-l" />
      <Toolbar.Button className="group rounded p-1 hover:enabled:bg-neutral-300">
        <NotePencil
          size={20}
          className="group-disabled:text-neutral-400"
          onClick={() => {
            console.log("clicked");
            activeEditor.dispatchCommand(INSERT_EXERCISE_COMMAND, undefined);
          }}
        />
      </Toolbar.Button>
      <Toolbar.Button
        disabled={!canToggleBlank}
        onClick={() => {
          activeEditor.dispatchCommand(TOGGLE_BLANK_COMMAND, undefined);
        }}
      >
        test
      </Toolbar.Button>
    </Toolbar.Root>
  );
}
