import { SetStateAction, useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export interface CodeEditor {}

export const CodeEditor = ({}: CodeEditor) => {
  const [value, setValue] = useState("console.log('hello world!');");

  const onChange = useCallback(
    (val: SetStateAction<string>, viewUpdate: any) => {
      console.log("val:", val);
      setValue(val);
    },
    []
  );

  return (
    <CodeMirror
      value={value}
      height="500px"
      maxWidth="100%"
      extensions={[javascript({ jsx: true, typescript: true })]}
      onChange={onChange}
      theme={vscodeDark}
    />
  );
};
