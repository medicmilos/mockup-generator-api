import { appApi } from "@/services/app";
import { Flex, Skeleton, Text, Tooltip } from "@radix-ui/themes";
import { ReactComponent as FolderIcon } from "@/assets/icons/folder-linear.svg";
import { ReactComponent as WidgetIcon } from "@/assets/icons/widget.svg";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import "./collections-widget.scss";
import { setSelectedCollection } from "@/redux/slices/app";

interface ICollectionsWidget {}

export const CollectionsWidget = ({}: ICollectionsWidget) => {
  const dispatch = useAppDispatch();
  const { collections, selectedCollection } = useAppSelector(
    (state) => state.appReducer
  );

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
            selectedCollection === null ? "active" : ""
          }`}
          onClick={() => {
            dispatch(setSelectedCollection(null));
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
          {collections.isLoading ? (
            <>
              <Skeleton height={"36px"} />
              <Skeleton height={"36px"} />
              <Skeleton height={"36px"} />
            </>
          ) : (
            collections?.data?.map((collection) => (
              <Flex
                key={`collection-item-${collection.uuid}`}
                className={`collection ${
                  selectedCollection === collection.uuid ? "active" : ""
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
                    dispatch(setSelectedCollection(collection.uuid));
                  }}
                >
                  <FolderIcon className="icon" />
                  <Tooltip content={collection.name}>
                    <Text className="name" title={collection.name}>
                      {collection.name}
                    </Text>
                  </Tooltip>
                </Flex>
                <>
                  <Text weight={"light"} className="collection-count">
                    {collection.mockup_count}
                  </Text>
                </>
              </Flex>
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
