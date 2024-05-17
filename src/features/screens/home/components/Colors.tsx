import { useAppDispatch, useAppSelector } from "@/hooks";
import { setColor } from "@/redux/slices/app";
import { Flex, SegmentedControl, Text } from "@radix-ui/themes";

export interface Colors {}

export const Colors = ({}: Colors) => {
  const dispatch = useAppDispatch();
  const { color } = useAppSelector((state) => state.appReducer);

  const setColorAction = (val: string) => {
    dispatch(setColor(val));
  };

  return (
    <Flex direction={"column"} gap={"2"}>
      <Text size={"2"}>Color:</Text>
      <SegmentedControl.Root
        defaultValue={color}
        onValueChange={(val) => setColorAction(val)}
      >
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
