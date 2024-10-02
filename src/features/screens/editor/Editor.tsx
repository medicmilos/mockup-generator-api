import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { EditorV2 } from "./components/EditorV2";
import { Colors } from "./components/Colors";
import { PreviewImage } from "./components/PreviewImage";
import { appApi } from "@/services/app";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setActiveDesignAsset,
  setActiveSmartObject,
  setSelectedMockup,
} from "@/redux/slices/app";
import { AddDesign } from "./components/AddDessign";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "@/assets/icons/arrow-left.svg";
import {
  getImageDimensions,
  getURLImageDimensions,
  resizeImageToMaxAllowedSize,
} from "@/helpers";

export interface IAssetFileConfig {
  url: string;
  width: number;
  height: number;
  transformX: number;
  transformY: number;
  smartObjectWidth: number;
  smartObjectHeight: number;
  rotate: number;
  left?: number;
  top?: number;
}

export interface IActiveSmartObject {
  width: number;
  height: number;
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
    color,
    selectedMockup,
    activeSmartObject,
    design,
    activeDesignAsset,
    mockups,
  } = useAppSelector((state) => state.appReducer);

  const [assetFileConfig, setAssetFileConfig] = useState<IAssetFileConfig>(
    null!
  );

  useEffect(() => {
    if (
      Object.keys(activeDesignAsset).length !== 0 &&
      activeDesignAsset.constructor === Object &&
      activeSmartObject
    ) {
      setAssetFileConfig({
        width: activeDesignAsset.width || 50,
        height: activeDesignAsset.height || 50,
        transformX: activeDesignAsset.left || 0,
        transformY: activeDesignAsset.top || 0,
        smartObjectWidth: activeSmartObject?.width,
        smartObjectHeight: activeSmartObject?.height,
        url: activeDesignAsset?.url,
        rotate: activeDesignAsset?.rotate || 0,
      });
    }
  }, [activeSmartObject, activeDesignAsset]);

  useEffect(() => {
    async function setDesignFileConfig() {
      if (design.file) {
        const designFileDimensions = await getImageDimensions(design.file);
        const newDesignDimensions = resizeImageToMaxAllowedSize(
          designFileDimensions.width,
          designFileDimensions.height,
          activeSmartObject?.width,
          activeSmartObject?.height
        );
        const data = {
          width: newDesignDimensions.width,
          height: newDesignDimensions.height,
          left: (activeSmartObject?.width - newDesignDimensions.width) / 2,
          top: (activeSmartObject?.height - newDesignDimensions.height) / 2,
          rotate: 0,
        };

        dispatch(setActiveDesignAsset(data));
      }
      if (design.url) {
        getURLImageDimensions(design.url)
          .then(({ width, height }) => {
            const newDesignDimensions = resizeImageToMaxAllowedSize(
              width,
              height,
              activeSmartObject?.width,
              activeSmartObject?.height
            );
            const data = {
              width: newDesignDimensions.width,
              height: newDesignDimensions.height,
              left: (activeSmartObject?.width - newDesignDimensions.width) / 2,
              top: (activeSmartObject?.height - newDesignDimensions.height) / 2,
              url: activeDesignAsset?.url,
              rotate: 0,
            };

            dispatch(setActiveDesignAsset(data));
          })
          .catch((error) => {
            console.error(error.message);
          });
      }
    }

    if (activeSmartObject) {
      setDesignFileConfig();
    }
  }, [design, activeSmartObject]);

  appApi.useGetMockupsQuery(undefined!, {
    skip: !!selectedMockup,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (mockups.data.length) {
      const mockup = mockups.data.find((mockup) => mockup.uuid === mockupUuid);
      dispatch(setSelectedMockup(mockup));
    }
  }, [mockups, mockupUuid]);

  const [generateSingleRender, { isLoading: isGenerating }] =
    appApi.useGenerateSingleRenderMutation();

  const getRenderData = (data?: Partial<IAssetFileConfig>) => {
    const formData = new FormData();
    let assetConfig: Partial<IAssetFileConfig> = { ...assetFileConfig };
    if (data) {
      assetConfig = { ...data };
    }

    if (selectedMockup) {
      formData.append("mockup_uuid", selectedMockup.uuid);
      formData.append(`export_options[image_format]`, "webp");
      formData.append(`export_options[image_size]`, "480");
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
      formData.append(`smart_objects[0][color]`, color);

      if (
        Object.keys(assetConfig).length !== 0 &&
        assetConfig.constructor === Object
      ) {
        formData.append(
          `smart_objects[0][asset][size][width]`,
          assetConfig.width as unknown as string
        );
        formData.append(
          `smart_objects[0][asset][size][height]`,
          assetConfig.height as unknown as string
        );
        formData.append(
          `smart_objects[0][asset][position][top]`,
          assetConfig.transformY as unknown as string
        );
        formData.append(
          `smart_objects[0][asset][position][left]`,
          assetConfig.transformX as unknown as string
        );
        formData.append(
          `smart_objects[0][asset][rotate]`,
          assetConfig.rotate as unknown as string
        );
      }
    }

    return formData;
  };

  const apiCallUpdateAsset = async (data: Partial<IAssetFileConfig>) => {
    setAssetFileConfig((prevObj) => {
      return {
        ...prevObj,
        ...data,
      };
    });
  };

  const renderPreviewImage = async () => {
    await generateSingleRender(getRenderData());
  };

  useEffect(() => {
    if (selectedMockup && activeSmartObject) {
      renderPreviewImage();
    }
  }, [color, assetFileConfig]);

  useEffect(() => {
    if (selectedMockup) {
      dispatch(setActiveSmartObject(selectedMockup.smart_objects[0]));
    }
  }, [selectedMockup]);

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
      </Flex>
      <Flex direction={"column"} p={"2"} gap={"4"} className="result-wrapper">
        <PreviewImage />
      </Flex>
    </Grid>
  );
};
