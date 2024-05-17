import { Flex, SegmentedControl, Text } from "@radix-ui/themes";
import { useState } from "react";

export interface FitModes {}

export const FitModes = ({}: FitModes) => {
  const [FitModes, setFitModes] = useState([]);

  return (
    <Flex direction={"column"} gap={"2"}>
      <Text size={"2"}>Fit mode:</Text>
      <SegmentedControl.Root defaultValue="contain">
        <SegmentedControl.Item value="contain">
          <Text weight={"medium"}>Contain</Text>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="cover">
          <Text weight={"medium"}>Cover</Text>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="stretch">
          <Text weight={"medium"}>Stretch</Text>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  );
};
