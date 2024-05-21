import {
  Box,
  Button,
  Flex,
  Grid,
  Tabs,
  TextField,
  IconButton,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { EditorV2 } from "./components/EditorV2";
import { Colors } from "./components/Colors";
import { FitModes } from "./components/FitModes";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewImage } from "./components/PreviewImage";
import { appApi } from "@/services/app";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  resetAppState,
  setAccessToken,
  setActiveSmartObject,
  setApiKey,
  updateActiveSmartObject,
} from "@/redux/slices/app";
import { Mockups } from "./components/Mockups";
import { Cross2Icon } from "@radix-ui/react-icons";
import { tempApi } from "@/services/temp";
import { AddDesign } from "./components/AddDessign";

export interface IAssetFileConfig {
  id: number;
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
  left?: number;
  top?: number;
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

export interface SingleMockup {
  id: number;
  name: string;
  url: string;
}

export const Home = () => {
  const dispatch = useAppDispatch();
  const {
    apiKey,
    fitMode,
    color,
    selectedMockup,
    accessToken,
    activeSmartObject,
    design,
    activeDesignAsset,
  } = useAppSelector((state) => state.appReducer);

  const [key, setKey] = useState<string>(apiKey);
  const [token, setToken] = useState<string>(accessToken);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setToken(token);
  }, [accessToken]);

  const [assetFileConfig, setAssetFileConfig] = useState<IAssetFileConfig>({
    id: 2360,
    width: activeDesignAsset.width || 50,
    height: activeDesignAsset.height || 50,
    transformX: activeDesignAsset.left || 0,
    transformY: activeDesignAsset.top || 0,
    design_area_width: activeSmartObject?.global_asset_width || 50,
    design_area_height: activeSmartObject?.global_asset_height || 50,
    design_area_left: activeSmartObject?.global_asset_left || 0,
    design_area_top: activeSmartObject?.global_asset_top || 0,
    smartObjectWidth: activeSmartObject?.width,
    smartObjectHeight: activeSmartObject?.height,
    url: activeDesignAsset?.url,
    rotate: activeDesignAsset?.rotate || 0,
  });

  useEffect(() => {
    setAssetFileConfig({
      id: 2360,
      width: activeDesignAsset.width || 50,
      height: activeDesignAsset.height || 50,
      transformX: activeDesignAsset.left || 0,
      transformY: activeDesignAsset.top || 0,
      design_area_width: activeSmartObject?.global_asset_width || 50,
      design_area_height: activeSmartObject?.global_asset_height || 50,
      design_area_left: activeSmartObject?.global_asset_left || 0,
      design_area_top: activeSmartObject?.global_asset_top || 0,
      smartObjectWidth: activeSmartObject?.width,
      smartObjectHeight: activeSmartObject?.height,
      url: activeDesignAsset?.url,
      rotate: activeDesignAsset?.rotate || 0,
    });
  }, [activeSmartObject, activeDesignAsset]);

  appApi.useGetMockupsQuery(null, {
    skip: !apiKey,
    refetchOnMountOrArgChange: true,
  });

  const [generateSingleRender, { isLoading: isGenerating }] =
    appApi.useGenerateSingleRenderMutation();
  const [updateAsset, { isLoading: isUpdatingAsset }] =
    tempApi.useUpdateDesignAssetMutation();

  const getRenderData = () => {
    const formData = new FormData();

    formData.append("mockup_uuid", selectedMockup.uuid);
    formData.append(`export_label`, "demo render");
    formData.append(
      `smart_objects[0][uuid]`,
      selectedMockup.smart_objects[0].uuid
    );
    if (design.file) {
      formData.append(`smart_objects[0][asset][file]`, design.file);
    }
    if (design.url) {
      formData.append(`smart_objects[0][asset][url]`, design.url);
    }
    formData.append(`smart_objects[0][asset][fit]`, fitMode);
    formData.append(`smart_objects[0][color]`, color);

    return formData;
  };

  const apiCallUpdateAsset = async (data: Partial<IAssetFileConfig>) => {
    console.log(data);
    setAssetFileConfig((prevObj) => {
      return {
        ...prevObj,
        ...data,
      };
    });

    dispatch(
      updateActiveSmartObject({
        print_area: activeSmartObject?.print_area,
        fit: activeSmartObject?.fit,
        global_asset_top: data.design_area_top,
        global_asset_left: data.design_area_left,
        global_asset_width: data.design_area_width,
        global_asset_height: data.design_area_height,
      })
    );

    await updateAsset({
      id: activeDesignAsset?.id,
      smart_object_id: activeSmartObject?.id,
      design_area_height: data.design_area_height,
      design_area_width: data.design_area_width,
      design_area_top: data.design_area_top,
      design_area_left: data.design_area_left,
      height: data.height,
      width: data.width,
      top: data.transformY,
      left: data.transformX,
      rotate: data.rotate,
    });

    await generateSingleRender(getRenderData());
  };

  const initThumbRenderImage = async () => {
    await generateSingleRender(getRenderData());
  };

  useEffect(() => {
    if (selectedMockup && activeSmartObject && (design.url || design.file)) {
      initThumbRenderImage();
    }
  }, [fitMode, color, selectedMockup, activeSmartObject, design]);

  useEffect(() => {
    if (selectedMockup) {
      dispatch(setActiveSmartObject(selectedMockup.smart_objects[0]));
    }
  }, [selectedMockup]);

  const setApiKeyAction = () => {
    dispatch(setApiKey(key));
  };

  const setAccessTokenAction = () => {
    dispatch(setAccessToken(token));
  };

  const clearApiKeyAction = () => {
    dispatch(resetAppState());
  };

  return (
    <Grid className={"app"} p={"4"} height={"100%"}>
      <Flex direction={"column"} gap={"4"} p={"2"}>
        <Flex className="api-key-input-wraper" gap={"3"}>
          <TextField.Root
            placeholder="Access Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
          <Button onClick={() => setAccessTokenAction()}>
            Set Access Token
          </Button>
        </Flex>
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
      <Flex direction={"column"} p={"2"} gap={"4"} className="editor">
        <AddDesign />
        <EditorV2
          assetFileConfig={assetFileConfig}
          apiCallUpdateAsset={apiCallUpdateAsset}
        />
        <Colors />
        <FitModes />
      </Flex>
      <Flex direction={"column"} p={"2"} gap={"4"} className="result-wrapper">
        <PreviewImage />
        <CodeEditor />
      </Flex>
    </Grid>
  );
};
