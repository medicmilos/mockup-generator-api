import { Flex, SegmentedControl, Text } from "@radix-ui/themes";
import { useState } from "react";

export interface Colors {}

export const Colors = ({}: Colors) => {
  const [Colors, setColors] = useState([]);

  return (
    <Flex direction={"column"} gap={"2"}>
      <Text size={"2"}>Color:</Text>
      <SegmentedControl.Root defaultValue="#5753c6">
        <SegmentedControl.Item value="#5753c6">
          <Text color="iris" weight={"bold"}>
            Iris
          </Text>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="#ad6200">
          <Text color="amber" weight={"bold"}>
            Amber
          </Text>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="#5c7c2f">
          <Text color="lime" weight={"bold"}>
            Lime
          </Text>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="#ca244d">
          <Text color="ruby" weight={"bold"}>
            Ruby
          </Text>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  );
};
