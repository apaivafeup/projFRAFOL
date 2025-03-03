import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { basicSetup } from "codemirror";
import {
  EditorView,
  Decoration,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { useCurrentProject } from "../../context";

interface CodeEditorProps {
  content?: string;
  editable?: boolean;
  code?: string;
  setCode?: (code: string) => void;
  jumpToLine?: boolean;
  coverageData?: { red: number[]; yellow: number[]; green: number[] };
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  editable,
  jumpToLine,
  coverageData,
}) => {
  const [removeColorHighlight, setRemoveColorHighlight] = useState(false);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const {
    jumpToLineNumberOnClassUnderMutation,
    setJumpToLineNumberOnClassUnderMutation,
  } = useCurrentProject();

  const scrollToLine = useCallback((lineNumber: number) => {
    if (editorRef.current && editorRef.current.view) {
      const view = editorRef.current.view;
      const state = view.state;
      const line = state.doc.line(lineNumber);

      view.dispatch({
        selection: { anchor: line.from, head: line.from },
        effects: EditorView.scrollIntoView(line.from, { y: "center" }),
      });

      view.focus();
    }
  }, []);

  useEffect(() => {
    if (jumpToLine !== undefined) {
      scrollToLine(jumpToLineNumberOnClassUnderMutation || 0);
      setTimeout(() => {
        scrollToLine(jumpToLineNumberOnClassUnderMutation || 0);
      }, 10);
    }
  }, [
    jumpToLine,
    jumpToLineNumberOnClassUnderMutation,
    scrollToLine,
    setJumpToLineNumberOnClassUnderMutation,
  ]);

  const coverageHighlightPlugin = useMemo(
    () =>
      ViewPlugin.fromClass(
        class {
          decorations;
          constructor(view: EditorView) {
            this.decorations = this.createDecorations(view);
          }

          createDecorations(view: EditorView) {
            if (!coverageData || removeColorHighlight) return Decoration.none;

            const builder = new RangeSetBuilder<Decoration>();

            const createDecoration = (color: string) =>
              Decoration.line({
                attributes: { style: `background-color: ${color};` },
              });

            const sortedLines = [
              ...coverageData.red.map((line) => ({
                line,
                color: "rgba(255, 0, 0, 0.3)",
              })),
              ...coverageData.yellow.map((line) => ({
                line,
                color: "rgba(255, 255, 0, 0.3)",
              })),
              ...coverageData.green.map((line) => ({
                line,
                color: "rgba(0, 255, 0, 0.3)",
              })),
            ].sort((a, b) => a.line - b.line);

            sortedLines.forEach(({ line, color }) => {
              const pos = view.state.doc.line(line).from;
              builder.add(pos, pos, createDecoration(color));
            });

            return builder.finish();
          }

          update(update: ViewUpdate) {
            if (update.docChanged) {
              this.decorations = this.createDecorations(update.view);
            }
          }
        },
        { decorations: (v) => v.decorations },
      ),
    [coverageData, removeColorHighlight],
  );

  return (
    <div className="flex flex-col max-w-full flex-grow min-h-0 overflow-hidden">
      <CodeMirror
        ref={editorRef}
        value={code}
        height="738px"
        extensions={[basicSetup, java(), coverageHighlightPlugin]}
        onChange={setCode}
        basicSetup={{ lineNumbers: true }}
        editable={editable || false}
      />
      {coverageData && (
        <div className="mt-1 items-center flex font-semibold">
          <input
            type="checkbox"
            checked={removeColorHighlight}
            onChange={() => setRemoveColorHighlight(!removeColorHighlight)}
            className="w-4 h-4 text-gray-100 bg-gray-100 border-gray-300 rounded-sm"
          />
          <label
            htmlFor="default-checkbox"
            className="ms-2 text-sm font-medium text-gray-900"
          >
            Remove color highlight
          </label>
        </div>
      )}
    </div>
  );
};
