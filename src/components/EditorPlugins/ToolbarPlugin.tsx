import * as Toolbar from "@radix-ui/react-toolbar";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  NotePencil,
} from "phosphor-react";

import { $isAtNodeEnd } from "@lexical/selection";
import { ElementNode, RangeSelection, TextNode } from "lexical";

import type { LexicalEditor, NodeKey } from "lexical";

import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
  $setBlocksType_experimental,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
// import { IS_APPLE } from "shared/environment";

// import useModal from "../../hooks/useModal";
// import catTypingGif from "../../images/cat-typing.gif";
// import { $createStickyNode } from "../../nodes/StickyNode";
// import ColorPicker from "../../ui/ColorPicker";
// import DropDown, { DropDownItem } from "../../ui/DropDown";
// import { getSelectedNode } from "../../utils/getSelectedNode";
// import { sanitizeUrl } from "../../utils/url";
// import { EmbedConfigs } from "../AutoEmbedPlugin";
// import { INSERT_COLLAPSIBLE_COMMAND } from "../CollapsiblePlugin";
// import { InsertEquationDialog } from "../EquationsPlugin";
// import { INSERT_EXCALIDRAW_COMMAND } from "../ExcalidrawPlugin";
// import {
//   INSERT_IMAGE_COMMAND,
//   InsertImageDialog,
//   InsertImagePayload,
// } from "../ImagesPlugin";
// import { InsertPollDialog } from "../PollPlugin";
// import { InsertNewTableDialog, InsertTableDialog } from "../TablePlugin";

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
      <Toolbar.Separator
        className="ml-1 mr-1 border-l"
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_EXERCISE_COMMAND, undefined);
        }}
      />
      <Toolbar.Button className="group rounded p-1 hover:enabled:bg-neutral-300">
        <NotePencil size={20} className="group-disabled:text-neutral-400" />
      </Toolbar.Button>
    </Toolbar.Root>
  );
}
