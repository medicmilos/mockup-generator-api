import {
  Grid,
  Flex,
  Button,
  ScrollArea,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { ReactComponent as TreeSquaresIcon } from "@/assets/icons/three-squares-linear.svg";
import { CollectionsWidget } from "./collections/CollectionsWidget";
import { appApi } from "@/services/app";
import { useAppSelector } from "@/hooks";
import { SingleTemplate } from "./collections/SingleTemplate";
import "./home.scss";

export const Home = () => {
  const { collections, mockups, selectedCollection } = useAppSelector(
    (state) => state.appReducer
  );

  appApi.useGetMockupsQuery(
    {
      uuid: selectedCollection,
    },
    {
      skip: collections.isLoading,
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <ScrollArea
      className="scroll-area-wrapper"
      type="hover"
      scrollbars="vertical"
      style={{ height: "calc(100vh)" }}
    >
      <Flex p={"5"} gap={"5"} className="home-page-wrapper">
        <CollectionsWidget />
        <Grid
          className="view-wrapper"
          gap={"2"}
          style={{
            display:
              !mockups.isLoading && mockups.data.length === 0 ? "flex" : "grid",
            height:
              !mockups.isLoading && mockups.data.length === 0
                ? "100vh"
                : "100%",
          }}
        >
          {mockups.isLoading
            ? [...Array(12)].map((item, index) => (
                <Skeleton key={`${index}-item`} className="single-template" />
              ))
            : mockups.data
                ?.slice(0)
                .reverse()
                .map((mockup) => (
                  <SingleTemplate key={mockup.uuid} mockup={mockup} />
                ))}

          {!mockups.isLoading && mockups.data.length === 0 && (
            <Flex
              direction={"column"}
              align={"center"}
              justify={"center"}
              gap={"4"}
              className="empty-page-state"
            >
              <Flex align={"center"} justify={"center"} className="cercle-wrap">
                <TreeSquaresIcon className="svg-icon" />
              </Flex>
              <Text size="2" weight="regular" align={"center"}>
                Organize Mockups in Collections by adding them from the All
                Mockups folder.
              </Text>

              <Button
                variant="solid"
                event-tracker-id="upload-psd-button"
                // onClick={() => setActiveMockupCollectionId(null)}
              >
                <Text size="1" weight="medium">
                  All Mockups
                </Text>
              </Button>
            </Flex>
          )}
        </Grid>
      </Flex>
    </ScrollArea>
  );
};
