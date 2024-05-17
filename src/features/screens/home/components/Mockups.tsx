import { ScrollArea, Grid, Skeleton, Text } from "@radix-ui/themes";
import { Mockup } from "./Mockup";
import { useAppSelector } from "@/hooks";

export interface IMockups {}

export const Mockups = ({}: IMockups) => {
  const { mockups } = useAppSelector((state) => state.appReducer);

  return (
    <ScrollArea
      type={"hover"}
      scrollbars={"vertical"}
      style={{ height: "calc(100vh - 132px)" }}
    >
      {mockups.data.length === 0 && !mockups.isLoading ? (
        <Text size={"2"}>Set API Key to see available Mockups</Text>
      ) : (
        <Grid columns={"1fr"} gap={"2"} pr={"4"}>
          {!mockups.isLoading
            ? mockups.data.map((mockup) => (
                <Mockup key={mockup.uuid} mockup={mockup} />
              ))
            : [...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={"photoshop-files-single-template"}
                ></Skeleton>
              ))}
        </Grid>
      )}
    </ScrollArea>
  );
};
