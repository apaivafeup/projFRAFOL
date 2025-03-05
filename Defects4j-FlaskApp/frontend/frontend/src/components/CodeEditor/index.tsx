import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  EditorView,
  Decoration,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { useCurrentProject } from "../../context";
import CodeEditorView from "./CodeEditor.view";

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
    <CodeEditorView
      code={code}
      setCode={setCode}
      editable={editable || false}
      coverageData={coverageData}
      removeColorHighlight={removeColorHighlight}
      setRemoveColorHighlight={setRemoveColorHighlight}
      editorRef={editorRef}
      coverageHighlightPlugin={coverageHighlightPlugin}
    />
  );
};
