import {
  Box,
  Button,
  Flex,
  Grid,
  Tabs,
  TextField,
  Text,
  ScrollArea,
  IconButton,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { EditorV2 } from "./components/EditorV2";
import { Colors } from "./components/Colors";
import { FitModes } from "./components/FitModes";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewImage } from "./components/PreviewImage";
import { Mockup } from "./components/Mockup";
import { appApi } from "@/services/app";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { resetAppState, setApiKey } from "@/redux/slices/app";
import { Mockups } from "./components/Mockups";
import {
  Cross2Icon,
  DotsHorizontalIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";

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
    "https://cdni.iconscout.com/illustration/premium/thumb/cat-doing-space-surfing-4238796-3518554.png",
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
  const { apiKey, fitMode, color, selectedMockup } = useAppSelector(
    (state) => state.appReducer
  );

  const [key, setKey] = useState<string>(apiKey);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

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

  appApi.useGetMockupsQuery(null, {
    skip: !apiKey,
    refetchOnMountOrArgChange: true,
  });

  const [generateSingleRender, { isLoading: isGenerating }] =
    appApi.useGenerateSingleRenderMutation();

  const apiCallUpdateAsset = async (data: Partial<IAssetFileConfig>) => {
    console.log(data);

    const smData = {
      print_area: activeSmartObject?.print_area,
      fit: activeSmartObject?.fit,
      global_asset_top: data.design_area_top,
      global_asset_left: data.design_area_left,
      global_asset_width: data.design_area_width,
      global_asset_height: data.design_area_height,
    };

    const renderData = {
      mockup_uuid: selectedMockup.uuid,
      export_label: "demo render",
      smart_objects: [
        {
          uuid: selectedMockup.smart_objects[0].uuid,
          asset: {
            url: "https://cdni.iconscout.com/illustration/premium/thumb/cat-doing-space-surfing-4238796-3518554.png",
            fit: fitMode,
          },
          color: color,
        },
      ],
    };

    await generateSingleRender(renderData);
  };

  const setApiKeyAction = () => {
    dispatch(setApiKey(key));
  };

  const clearApiKeyAction = () => {
    dispatch(resetAppState());
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
          >
            <TextField.Slot></TextField.Slot>
            <TextField.Slot>
              <IconButton
                size="1"
                variant="ghost"
                onClick={() => clearApiKeyAction()}
              >
                <Cross2Icon height="14" width="14" />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>
          <Button onClick={() => setApiKeyAction()}>Set API Key</Button>
        </Flex>
        <Tabs.Root defaultValue="public">
          <Tabs.List>
            <Tabs.Trigger value="public">Public Mockups</Tabs.Trigger>
            <Tabs.Trigger value="custom">Custom Mockups</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="public">
              <Mockups />
            </Tabs.Content>

            <Tabs.Content value="custom">
              <Mockups />
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
