import { SetStateAction, useCallback, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useAppSelector } from "@/hooks";

export interface CodeEditor {}

export const CodeEditor = ({}: CodeEditor) => {
  const { apiKey, fitMode, color, selectedMockup, activeSmartObject, design } =
    useAppSelector((state) => state.appReducer);

  const [value, setValue] = useState("");

  useEffect(() => {
    if (selectedMockup && activeSmartObject) {
      setValue(`
// Data to be sent in the request body
const formData = new FormData();
formData.append("mockup_uuid", "${selectedMockup.uuid}");
formData.append("export_label", "demo render");
formData.append("smart_objects[0][uuid]", "${activeSmartObject.uuid}");
${
  design.url
    ? `formData.append("smart_objects[0][asset][url]", "${design.url}");`
    : `formData.append("smart_objects[0][asset][file]", "${design.file}");`
}
formData.append("smart_objects[0][asset][fit]", "${fitMode}");
formData.append("smart_objects[0][color]", "${color}");
// API endpoint
const apiUrl = "https://design-copilot-laravel-develop.gitlab.designcopilot.io/api/v1/renders";
// Create headers
const headers = new Headers();
headers.append("X-API-KEY", "${apiKey}");
headers.append("Accept", "application/json");
// Fetch options
const options = {
  method: "POST",
  headers: headers,
  body: formData,
};
// Perform the fetch request
fetch(apiUrl, options)
  .then((response) => response.json())
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error));
`);
    }
  }, [fitMode, color, selectedMockup, activeSmartObject, design]);

  const onChange = useCallback(
    (val: SetStateAction<string>, viewUpdate: any) => {
      console.log("val:", val);
      setValue(val);
    },
    []
  );

  return (
    <CodeMirror
      className="code-editor-wrapper"
      value={value}
      height="100%"
      width="100%"
      extensions={[javascript({ jsx: true, typescript: true })]}
      onChange={onChange}
      theme={vscodeDark}
    />
  );
};
