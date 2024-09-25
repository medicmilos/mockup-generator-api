import { IMockup } from "@/services/types";
import { Flex, Text, Tooltip } from "@radix-ui/themes";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useLocation } from "react-router-dom";
import "./single-template.scss";
import { setSelectedMockup } from "@/redux/slices/app";
import { useAppDispatch } from "@/hooks";

interface ISingleTemplate {
  mockup: IMockup;
}

export const SingleTemplate = ({ mockup }: ISingleTemplate) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const [loadMockup, { isLoading }] =
  //   psdEngineApi.useLoadPublicPsdMockupMutation();

  const loadPublicMockup = async () => {
    dispatch(setSelectedMockup(mockup));
    navigate(`/mockup/${mockup.uuid}`, { state: { from: location.pathname } });
  };

  return (
    <Flex
      className="single-template zoom-animate-image"
      align={"end"}
      onClick={() => loadPublicMockup()}
    >
      <LazyLoadImage
        alt={`${mockup.name}`}
        className=""
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          objectPosition: "center",
        }}
        effect="blur"
        src={mockup.thumbnail || "https://placehold.co/300x300?text=MOCKUP"}
        delayTime={0}
        placeholderSrc={
          mockup.thumbnail || "https://placehold.co/300x300?text=MOCKUP"
        }
        wrapperProps={{
          style: { transitionDelay: "0s" },
        }}
      />
      {/* <Flex className="head-wrapper" align={"center"} p={"4"} gap={"2"}>
        {mockup.is_ai_mockup ? (
          <Badge className="badge" title={"✨ AI Backgrounds"} size={"2"}>
            ✨ AI Backgrounds
          </Badge>
        ) : (
          <></>
        )}
      </Flex> */}
      <Flex className="text-wrapper" align={"end"} p={"4"}>
        <Tooltip content={mockup.name}>
          <Text size={"2"} weight={"regular"} style={{ color: "#fff" }}>
            {mockup.name}
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  );
};
