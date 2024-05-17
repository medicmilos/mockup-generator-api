import NotFoundImage from "@/assets/404.png";
import { Container, Text } from "@radix-ui/themes";

export const NotFound = () => {
  return (
    <Container
      style={{
        height: "80%",
        backgroundImage: `url(${NotFoundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        padding: "5% 5% 0 5%",
        textAlign: "center",
      }}
    >
      <Text size={"6"} weight={"medium"}>
        PAGE NOT FOUND
      </Text>
      <br></br>
      <Text size={"5"} weight={"medium"}>
        The rabbits have been nibbling the cables again...
      </Text>
      <br></br>
      <Text size={"6"} weight={"medium"}>
        Maybe <a href="/">THIS</a> link will help
      </Text>
    </Container>
  );
};
