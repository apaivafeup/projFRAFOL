import CodeMirror, {
  ReactCodeMirrorRef,
  ViewPlugin,
} from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { basicSetup } from "codemirror";

interface CodeEditorViewProps {
  code?: string;
  setCode?: (code: string) => void;
  editable: boolean;
  coverageData?: { red: number[]; yellow: number[]; green: number[] };
  removeColorHighlight: boolean;
  setRemoveColorHighlight: (removeColorHighlight: boolean) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef>;
  coverageHighlightPlugin: ViewPlugin<{
    red: number[];
    yellow: number[];
    green: number[];
    removeColorHighlight: boolean;
  }>;
}

function CodeEditorView({
  code,
  setCode,
  editable,
  coverageData,
  removeColorHighlight,
  setRemoveColorHighlight,
  editorRef,
  coverageHighlightPlugin,
}: CodeEditorViewProps) {
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
}

export default CodeEditorView;
