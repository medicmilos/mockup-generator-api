import {
  Box,
  Button,
  Flex,
  Grid,
  Tabs,
  Text,
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
  setActiveSmartObject,
  setApiKey,
  updateActiveSmartObject,
} from "@/redux/slices/app";
import { Mockups } from "./components/Mockups";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AddDesign } from "./components/AddDessign";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "@/assets/icons/arrow-left.svg";

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

export const Editor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mockupUuid } = useParams();
  const {
    apiKey,
    fitMode,
    color,
    selectedMockup,
    activeSmartObject,
    design,
    activeDesignAsset,
  } = useAppSelector((state) => state.appReducer);

  const [key, setKey] = useState<string>(apiKey);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

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

  // appApi.useGetMockupsQuery(null, {
  //   skip: !apiKey,
  //   refetchOnMountOrArgChange: true,
  // });

  const [generateSingleRender, { isLoading: isGenerating }] =
    appApi.useGenerateSingleRenderMutation();

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

  const clearApiKeyAction = () => {
    dispatch(resetAppState());
  };

  return (
    <Grid className={"app"} height={"100%"}>
      <Flex direction={"column"} p={"4"} gap={"4"} className="editor">
        <Flex gap={"5"} px={"2"} align={"center"}>
          <Button
            variant="ghost"
            color="gray"
            className="back-button"
            size={"1"}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/`)}
          >
            <ArrowLeft width="14px" height="14px" className="icon" />
          </Button>

          <Text weight={"medium"} size={"2"}>
            {selectedMockup?.name}
          </Text>
        </Flex>
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
      </Flex>
    </Grid>
  );
};
