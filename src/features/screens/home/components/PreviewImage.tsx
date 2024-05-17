import { useAppDispatch, useAppSelector } from "@/hooks";
import { Flex, Skeleton, Spinner } from "@radix-ui/themes";
import { useState } from "react";

export interface PreviewImage {}

export const PreviewImage = ({}: PreviewImage) => {
  const dispatch = useAppDispatch();
  const { singleRender } = useAppSelector((state) => state.appReducer);

  return (
    <Flex
      className="preview-image-wrapper"
      direction={"column"}
      align={"center"}
      justify={"center"}
      height={"300px"}
    >
      {!singleRender.isLoading ? (
        <img
          src={
            singleRender.data.export_path ||
            "https://placehold.co/800x500?text=IMAGE RENDER"
          }
        />
      ) : (
        <Flex
          width={"100%"}
          height={"100%"}
          align={"center"}
          justify={"center"}
        >
          <Skeleton width={"100%"} height={"100%"} />
          <Spinner className="spinner" size={"3"} />
        </Flex>
      )}
    </Flex>
  );
};
