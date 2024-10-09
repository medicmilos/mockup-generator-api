import { useAppDispatch, useAppSelector } from "@/hooks";
import { setColor } from "@/redux/slices/app";
import { Flex, IconButton, SegmentedControl, Text } from "@radix-ui/themes";
import { ReactComponent as AddLinearIcon } from "@/assets/icons/add-linear.svg";

export interface Colors {}

export const Colors = ({}: Colors) => {
  const dispatch = useAppDispatch();
  const { color } = useAppSelector((state) => state.appReducer);

  const setColorAction = (val: string) => {
    dispatch(setColor(val));
  };

  return (
    <Flex direction={"column"} gap={"5"}>
      <Flex align={"center"} justify={"between"}>
        <Text size={"2"} className="tool-title">
          Color options
        </Text>
        <IconButton variant={"ghost"} size={"1"} color="gray">
          <AddLinearIcon width="26px" height="26px" className="icon" />
        </IconButton>
      </Flex>
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
