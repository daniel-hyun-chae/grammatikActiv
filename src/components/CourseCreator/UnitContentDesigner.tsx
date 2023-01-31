import { LineSegment, TextUnderline } from "phosphor-react";
import { useState } from "react";
import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "../EditorPlugins/ToolbarPlugin";
import ExercisePlugin from "../EditorPlugins/ExercisePlugin";

// type CustomElement = { type: "paragraph"; children: CustomText[] };
// type CustomText = { text: string };

// declare module "slate" {
//   interface CustomTypes {
//     Editor: BaseEditor & ReactEditor;
//     Element: CustomElement;
//     Text: CustomText;
//   }
// }

export default function UnitContentDesigner({
  selectedUnitId,
}: {
  selectedUnitId: string | undefined;
}) {
  if (selectedUnitId === undefined)
    return (
      <div>
        There is no unit. Please create your first unit through the table of
        content creator on the sidebar.
      </div>
    );
  return <ContentWizard />;
}

type ContentType = "fillInTheBlank" | "connectSentence";

function ContentWizard() {
  const [contentType, setContentType] = useState<null | ContentType>(null);

  return (
    <div className="[unit-content-designer] h-full w-full">
      {/* <ul className="flex space-x-2">
          <ContentTypeListItem
            onClickCallback={() => {
              setContentType("fillInTheBlank");
            }}
          >
            <span>Fill in the blank</span>
            <TextUnderline size={52} weight="thin" />
          </ContentTypeListItem>
          <ContentTypeListItem
            onClickCallback={() => {
              setContentType("connectSentence");
            }}
          >
            <span>Connect sentence</span>
            <LineSegment size={52} weight="thin" />
          </ContentTypeListItem>
        </ul> */}
      <ContentDesigner />
    </div>
  );
}

function ContentTypeListItem({
  children,
  onClickCallback,
}: {
  children: React.ReactNode;
  onClickCallback: () => void;
}) {
  return (
    <li className="w-36 shrink-0">
      <button
        className="flex h-full w-full flex-col items-center justify-between border p-2"
        onClick={onClickCallback}
      >
        {children}
      </button>
    </li>
  );
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function ContentDesigner() {
  const initialConfig = {
    namespace: "ContentDesigner",
    theme,
    onError,
    nodes: [LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="[ContentEditable] h-full w-full" />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ExercisePlugin />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <LinkPlugin />
    </LexicalComposer>
  );
}
