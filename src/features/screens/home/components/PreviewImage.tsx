import { Flex } from "@radix-ui/themes";
import { useState } from "react";

export interface PreviewImage {}

export const PreviewImage = ({}: PreviewImage) => {
  const [image, setImage] = useState("https://placehold.co/312x100?text=IMAGE");

  return (
    <Flex direction={"column"}>
      <img src={image} />
    </Flex>
  );
};
