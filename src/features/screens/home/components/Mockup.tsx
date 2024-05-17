import { Button, Flex, Text, Tooltip } from "@radix-ui/themes";
import PhotoshopIcon from "@/assets/photoshop.png";
import { IMockup } from "@/services/types";

export interface Mockup {
  mockup: IMockup;
}

export const Mockup = ({ mockup }: Mockup) => {
  const loadMockup = (uuid: string) => {
    console.log(uuid);
  };

  return (
    <Flex
      direction={"column"}
      gap={"3"}
      className={"photoshop-files-single-template"}
    >
      <Flex align={"center"} justify={"between"}>
        <Flex align={"center"} gap={"1"}>
          <img src={PhotoshopIcon} />
          <Tooltip content={mockup.name}>
            <Text className="title" size={"1"} weight={"regular"}>
              {mockup.name}
            </Text>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex
        className="single-template photoshop-files"
        align={"end"}
        height={"100%"}
      >
        <img
          className="thumbnail"
          src={mockup.thumbnail || "https://placehold.co/300x300?text=MOCKUP"}
        />

        <Flex className="text-wrapper" align={"end"} p={"4"}>
          <Button size={"1"} onClick={() => loadMockup(mockup.uuid)}>
            Use Mockup
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
