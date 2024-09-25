import { appApi } from "@/services/app";
import { Flex, Text } from "@radix-ui/themes";
import { ReactComponent as FolderIcon } from "@/assets/icons/folder-linear.svg";
import { ReactComponent as WidgetIcon } from "@/assets/icons/widget.svg";
import { useState } from "react";
import { useAppSelector } from "@/hooks";
import "./collections-widget.scss";

interface ICollectionsWidget {}

export const CollectionsWidget = ({}: ICollectionsWidget) => {
  const { collections } = useAppSelector((state) => state.appReducer);
  const [activeMockupCollectionUuid, setActiveMockupCollectionUuid] = useState<
    string | null
  >(null);

  appApi.useGetCollectionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  // const geyAllMyProjects = workspaceApi.useGetMyProjectsQuery(
  //   { collectionId: 0 },
  //   {
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  return (
    <Flex
      className="collections-widget-wrapper"
      p={"4"}
      height={"100%"}
      direction={"column"}
      gap={"2"}
    >
      <Flex className="head" justify={"between"} align={"center"}>
        <Text>COLLECTIONS</Text>
      </Flex>
      <Flex className="collections" direction={"column"} gap={"2"}>
        <Flex
          className={`collection default ${
            activeMockupCollectionUuid === null ? "active" : ""
          }`}
          onClick={() => {
            setActiveMockupCollectionUuid(null);
          }}
          align={"center"}
          justify={"between"}
          gap={"2"}
          px={"3"}
          py={"2"}
          width={"100%"}
        >
          <Flex align={"center"} gap={"3"}>
            <WidgetIcon className="icon" width={"20px"} height={"20px"} />
            <Text>All Mockups</Text>
          </Flex>
          {/* <Text weight={"light"}>{geyAllMyProjects.data?.data.length}</Text> */}
        </Flex>
        <Flex direction={"column"} className="collection-items">
          {collections?.map((collection) => (
            <Flex
              key={`collection-item-${collection.uuid}`}
              className={`collection ${
                activeMockupCollectionUuid === collection.uuid ? "active" : ""
              }`}
              align={"center"}
              gap={"2"}
              px={"3"}
              py={"2"}
              width={"100%"}
              justify={"between"}
            >
              <Flex
                align={"center"}
                gap={"2"}
                width={"100%"}
                onClick={() => {
                  setActiveMockupCollectionUuid(collection.uuid);
                }}
              >
                <FolderIcon className="icon" />
                <Text className="name" title={collection.name}>
                  {collection.name}
                </Text>
              </Flex>
              <>
                <Text weight={"light"} className="collection-count">
                  {collection.mockup_count}
                </Text>
              </>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
