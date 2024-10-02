import { useAppSelector } from "@/hooks";
import { Flex, Skeleton, Spinner } from "@radix-ui/themes";
import { LazyLoadImage } from "react-lazy-load-image-component";

export interface PreviewImage {}

export const PreviewImage = ({}: PreviewImage) => {
  const { singleRender, selectedMockup } = useAppSelector(
    (state) => state.appReducer
  );

  return (
    <Flex
      className="preview-image-wrapper"
      direction={"column"}
      align={"center"}
      justify={"center"}
    >
      {singleRender.data.export_path ? (
        <Flex align={"center"} justify={"center"}>
          {singleRender.isLoading && <Spinner size={"3"} className="spinner" />}
          <LazyLoadImage
            style={{
              filter: singleRender.isLoading ? "blur(3px)" : "blur(0)",
            }}
            effect="blur"
            src={
              singleRender.data.export_path ||
              selectedMockup?.thumbnail ||
              "https://placehold.co/800x500?text=IMAGE"
            }
            delayTime={0}
            placeholderSrc={
              singleRender.data.export_path ||
              selectedMockup?.thumbnail ||
              "https://placehold.co/800x500?text=IMAGE"
            }
          />
        </Flex>
      ) : singleRender.isLoading ? (
        <Flex
          width={"100%"}
          height={"100%"}
          align={"center"}
          justify={"center"}
        >
          <Skeleton width={"100%"} height={"100%"} />
          <Spinner className="spinner" size={"3"} />
        </Flex>
      ) : (
        <LazyLoadImage
          effect="blur"
          src={
            selectedMockup?.thumbnail ||
            "https://placehold.co/800x500?text=IMAGE"
          }
          delayTime={0}
          placeholderSrc={
            selectedMockup?.thumbnail ||
            "https://placehold.co/800x500?text=IMAGE"
          }
        />
      )}
    </Flex>
  );
};
