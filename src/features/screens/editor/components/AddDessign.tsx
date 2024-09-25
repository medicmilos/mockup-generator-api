import { useAppDispatch, useAppSelector } from "@/hooks";
import { Button, Text, TextField, Flex } from "@radix-ui/themes";
import { setDesignFile, setDesignUrl } from "@/redux/slices/app";
import { useState, useEffect, useRef } from "react";

export const AddDesign = () => {
  const dispatch = useAppDispatch();
  const { design } = useAppSelector((state) => state.appReducer);

  const [url, setUrl] = useState<string>(design.url || "");
  const fileRef = useRef();

  useEffect(() => {
    if (design.url) setUrl(design.url);
  }, [design.url]);

  const setDesignUrlAction = () => {
    dispatch(setDesignUrl(url));
    (fileRef?.current as any).value = null;
  };

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDesignFile(event.target.files?.[0]));
    setUrl("");
  };

  return (
    <Flex
      direction={"column"}
      align={"center"}
      gap={"2"}
      className="add-design-wrapper"
    >
      {/* <Flex gap={"3"} width={"100%"}>
        <TextField.Root
          placeholder="Design URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={() => setDesignUrlAction()}>Set Design URL</Button>
      </Flex>
      <Text size={"2"}>or</Text> */}
      <Flex direction={"column"} width={"100%"}>
        <input
          ref={fileRef as any}
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(event) => onFileUpload(event)}
          onClick={(event) => {
            (event.target as any).value = null;
          }}
        />
      </Flex>
    </Flex>
  );
};
