import {
  Box,
  Button,
  Flex,
  Grid,
  Tabs,
  TextField,
  Text,
  ScrollArea,
} from "@radix-ui/themes";
import { useState } from "react";
import { EditorV2 } from "./components/EditorV2";
import { Colors } from "./components/Colors";
import { FitModes } from "./components/FitModes";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewImage } from "./components/PreviewImage";
import { Mockup } from "./components/Mockup";
import { appApi } from "@/services/app";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setApiKey } from "@/redux/slices/app";

export interface IAssetFileConfig {
  url: string;
  width: number;
  height: number;
  transformX: number;
  transformY: number;
  smartObjectWidth: number;
  smartObjectHeight: number;
  design_area_width: number;
  design_area_height: number;
  design_area_left: number;
  design_area_top: number;
  rotate: number;
}

export interface IActiveSmartObject {
  width: number;
  height: number;
  global_asset_width: number;
  global_asset_height: number;
  global_asset_top: number;
  global_asset_left: number;
  print_area: number;
  fit: string;
}

const activeDesignAsset = {
  width: 540,
  height: 360,
  top: 0,
  left: 0,
  rotate: 0,
  asset_path:
    "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
};

const activeSmartObject = {
  width: 220,
  height: 220,
  global_asset_width: 200,
  global_asset_height: 200,
  global_asset_top: 10,
  global_asset_left: 10,
  print_area: 1,
  fit: "contain",
};

export interface SingleMockup {
  id: number;
  name: string;
  url: string;
}

export const Home = () => {
  const dispatch = useAppDispatch();
  const { apiKey } = useAppSelector((state) => state.appReducer);

  const [key, setKey] = useState<string>(apiKey);

  const [assetFileConfig, setAssetFileConfig] = useState<IAssetFileConfig>({
    width: activeDesignAsset.width || 50,
    height: activeDesignAsset.height || 50,
    transformX: activeDesignAsset.left || 0,
    transformY: activeDesignAsset.top || 0,
    design_area_width: activeSmartObject.global_asset_width || 50,
    design_area_height: activeSmartObject.global_asset_height || 50,
    design_area_left: activeSmartObject.global_asset_left || 0,
    design_area_top: activeSmartObject.global_asset_top || 0,
    smartObjectWidth: activeSmartObject?.width,
    smartObjectHeight: activeSmartObject?.height,
    url: activeDesignAsset?.asset_path,
    rotate: activeDesignAsset?.rotate || 0,
  });

  const getMockups = appApi.useGetMockupsQuery(null, {
    skip: !apiKey,
    refetchOnMountOrArgChange: true,
  });

  const apiCallUpdateAsset = async (data: Partial<IAssetFileConfig>) => {
    console.log(data);
  };

  const setApiKeyAction = () => {
    dispatch(setApiKey(key));
  };

  return (
    <Grid className={"app"} columns={"1fr 2fr 3fr"} p={"4"} height={"100%"}>
      <Flex direction={"column"} gap={"4"} p={"2"}>
        <Flex className="api-key-input-wraper" gap={"3"}>
          <TextField.Root
            placeholder="API Key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Button onClick={() => setApiKeyAction()}>Set API Key</Button>
        </Flex>
        <Tabs.Root defaultValue="public">
          <Tabs.List>
            <Tabs.Trigger value="public">Public Mockups</Tabs.Trigger>
            <Tabs.Trigger value="custom">Custom Mockups</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="public">
              <ScrollArea
                type={"hover"}
                scrollbars={"vertical"}
                style={{ height: "calc(100vh - 132px)" }}
              >
                <Grid columns={"1fr"} gap={"2"} pr={"4"}>
                  {getMockups.data?.data.map((mockup) => (
                    <Mockup key={mockup.uuid} mockup={mockup} />
                  ))}
                </Grid>
              </ScrollArea>
            </Tabs.Content>

            <Tabs.Content value="custom">
              <Text size="2">Access and update your custom.</Text>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
      <Flex direction={"column"} p={"2"} gap={"4"}>
        <EditorV2
          assetFileConfig={assetFileConfig}
          activeSmartObject={activeSmartObject}
          apiCallUpdateAsset={apiCallUpdateAsset}
        />
        <Colors />
        <FitModes />
      </Flex>
      <Flex direction={"column"} p={"2"} gap={"4"}>
        <PreviewImage />
        <CodeEditor />
      </Flex>
    </Grid>
  );
};
