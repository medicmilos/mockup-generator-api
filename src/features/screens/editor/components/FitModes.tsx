import { useAppDispatch, useAppSelector } from "@/hooks";
import { Flex, SegmentedControl, Text } from "@radix-ui/themes";
import { setFitMode } from "@/redux/slices/app";
import { fitModes } from "@/redux/slices/types";

export const FitModes = () => {
  const dispatch = useAppDispatch();
  const { fitMode } = useAppSelector((state) => state.appReducer);

  const setFitModeAction = (val: fitModes) => {
    dispatch(setFitMode(val));
  };

  return (
    <Flex direction={"column"} gap={"2"}>
      <Text size={"2"}>Fit mode:</Text>
      <SegmentedControl.Root
        defaultValue={fitMode}
        onValueChange={(val: fitModes) => setFitModeAction(val)}
      >
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
