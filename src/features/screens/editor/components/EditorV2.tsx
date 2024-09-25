import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import "./moveable.scss";
import { Box, Flex } from "@radix-ui/themes";
import { useAppSelector } from "@/hooks";
import { IAssetFileConfig } from "../Editor";

interface IEditorV2Props {
  assetFileConfig: IAssetFileConfig;
  apiCallUpdateAsset: (data: Partial<IAssetFileConfig>) => void;
}

interface IAssetFile {
  design_area_width: number;
  design_area_height: number;
  design_area_left: number;
  design_area_top: number;
  canvasWidth: number;
  canvasHeight: number;
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
  rotate: number;
}

export const EditorV2 = ({
  assetFileConfig,
  apiCallUpdateAsset,
}: IEditorV2Props) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { design } = useAppSelector((state) => state.appReducer);

  const [moveableKey, setMoveableKey] = useState<number>(0);
  const [maxCanvasSize, setmaxCanvasSize] = useState<number>(400);

  const [assetFile, setAssetFile] = useState<IAssetFile>(() => null!);
  const [scaledAssetFile, setScaledAssetFile] = useState<IAssetFile>(null!);

  useEffect(() => {
    if (assetFileConfig) {
      setAssetFile({
        design_area_width: assetFileConfig.width,
        design_area_height: assetFileConfig.height,
        design_area_left: assetFileConfig.transformX,
        design_area_top: assetFileConfig.transformY,
        canvasWidth: assetFileConfig.smartObjectWidth,
        canvasHeight: assetFileConfig.smartObjectHeight,
        imageWidth: assetFileConfig.width,
        imageHeight: assetFileConfig.height,
        imageX: assetFileConfig.transformX,
        imageY: assetFileConfig.transformY,
        rotate: assetFileConfig.rotate,
      });
    }
  }, [assetFileConfig]);

  useEffect(() => {console.log(assetFile)
    if (assetFile) {
      setMoveableKey((prev) => {
        return prev + 1;
      });

      if (assetFile.canvasHeight && assetFile.canvasWidth) {
        scaleAssetFile();
      }
    }
  }, [assetFile]);

  const scaleAssetFile = () => {
    // Calculate the scale factor for the canvas
    const canvasScale = Math.min(
      maxCanvasSize / assetFile.canvasWidth,
      maxCanvasSize / assetFile.canvasHeight
    );

    // Calculate the scaled dimensions of the design area
    const scaleddesign_area_width = assetFile.imageWidth * canvasScale;
    const scaleddesign_area_height = assetFile.imageHeight * canvasScale;

    // Calculate the scaled dimensions of the canvas
    const scaledCanvasWidth = assetFile.canvasWidth * canvasScale;
    const scaledCanvasHeight = assetFile.canvasHeight * canvasScale;

    // Calculate the scaled dimensions of the image
    const scaledImageWidth = assetFile.imageWidth * canvasScale;
    const scaledImageHeight = assetFile.imageHeight * canvasScale;

    // Calculate the scaled position of the image
    const scaledImageX = assetFile.imageX * canvasScale;
    const scaledImageY = assetFile.imageY * canvasScale;

    // Calculate the scaled position of the design area
    const scaleddesign_area_left = assetFile.imageX * canvasScale;
    const scaleddesign_area_top = assetFile.imageY * canvasScale;

    // Set the scaled values

    setScaledAssetFile({
      design_area_height: scaleddesign_area_height,
      design_area_width: scaleddesign_area_width,
      design_area_left: scaleddesign_area_left,
      design_area_top: scaleddesign_area_top,
      canvasWidth: scaledCanvasWidth,
      canvasHeight: scaledCanvasHeight,
      imageWidth: scaledImageWidth,
      imageHeight: scaledImageHeight,
      imageX: scaledImageX,
      imageY: scaledImageY,
      rotate: assetFile.rotate,
    });
  };

  const updateAsset = async (data: Partial<IAssetFileConfig>) => {
    apiCallUpdateAsset(data);
  };

  console.log(scaledAssetFile);

  return (
    <Flex
      direction={"column"}
      gap={"4"}
      className={`asset-editor-wrapper ${"print-area-disabled"}`}
    >
      <Flex
        className="canvas-wrapper"
        direction={"column"}
        align={"center"}
        justify={"center"}
      >
        {scaledAssetFile && (
          <Box
            key={moveableKey}
            className="editor-canvas"
            style={{
              width: `${scaledAssetFile.canvasWidth}px`,
              height: `${scaledAssetFile.canvasHeight}px`,
            }}
          >
            <Box
              className="editor-target"
              ref={targetRef}
              style={{
                backgroundImage: `url(${
                  design.url || URL.createObjectURL(design.file as File)
                })`,
                width: scaledAssetFile.imageWidth,
                height: scaledAssetFile.imageHeight,
                top: scaledAssetFile.imageY,
                left: scaledAssetFile.imageX,
              }}
            ></Box>

            <Moveable
              className="editor-moveable"
              target={targetRef}
              draggable={true}
              resizable={true}
              origin={false}
              keepRatio={true}
              useAccuratePosition={true}
              throttleDrag={1}
              throttleResize={1}
              renderDirections={["nw", "ne", "sw", "se", "s", "n", "e", "w"]}
              // onResizeStart={(e) => {
              //   e.setFixedDirection([0, 0]);
              // }}
              onDrag={(e) => {
                e.target.style.left = `${e.left}px`;
                e.target.style.top = `${e.top}px`;
              }}
              onResize={(e) => {
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.transform = e.drag.transform;
              }}
              onResizeEnd={(e) => {
                if (!e.lastEvent) return;

                // drag
                const localTransformX =
                  scaledAssetFile.imageX + e.lastEvent.drag.translate[0];
                const localTransformY =
                  scaledAssetFile.imageY + e.lastEvent.drag.translate[1];

                const transformX =
                  (localTransformX * assetFile.canvasWidth) /
                  scaledAssetFile.canvasWidth;

                const transformY =
                  (localTransformY * assetFile.canvasHeight) /
                  scaledAssetFile.canvasHeight;

                // resize

                const newWidth = e.lastEvent.width;
                const newHeight = e.lastEvent.height;

                const width =
                  (newWidth * assetFile.imageWidth) /
                  scaledAssetFile.imageWidth;
                const height =
                  (newHeight * assetFile.imageHeight) /
                  scaledAssetFile.imageHeight;

                updateAsset({
                  width: Math.round(width),
                  height: Math.round(height),
                  transformX: Math.round(transformX),
                  transformY: Math.round(transformY),
                  rotate: assetFileConfig.rotate,
                });
              }}
              onDragEnd={(e) => {
                if (!e.lastEvent) return;

                const localTransformX =
                  scaledAssetFile.imageX + e.lastEvent.translate[0];
                const localTransformY =
                  scaledAssetFile.imageY + e.lastEvent.translate[1];

                const transformX =
                  (localTransformX * assetFile.canvasWidth) /
                  scaledAssetFile.canvasWidth;

                const transformY =
                  (localTransformY * assetFile.canvasHeight) /
                  scaledAssetFile.canvasHeight;

                updateAsset({
                  width: assetFileConfig.width,
                  height: assetFileConfig.height,
                  transformX: Math.round(transformX),
                  transformY: Math.round(transformY),
                  rotate: assetFileConfig.rotate,
                });
              }}
              snappable={true}
              snapDirections={{
                left: false,
                top: false,
                right: false,
                bottom: false,
                center: true,
                middle: true,
              }}
              horizontalGuidelines={[scaledAssetFile.canvasHeight / 2]}
              verticalGuidelines={[scaledAssetFile.canvasWidth / 2]}
              rotatable={true}
              throttleRotate={0}
              rotationPosition={"top"}
              onRotate={(e) => {
                e.target.style.transform = e.drag.transform;
              }}
              onRotateEnd={(e) => {
                if (!e.lastEvent) return;

                updateAsset({
                  design_area_width: assetFileConfig.design_area_width,
                  design_area_height: assetFileConfig.design_area_height,
                  design_area_left: assetFileConfig.design_area_left,
                  design_area_top: assetFileConfig.design_area_top,
                  rotate: Math.round(e.lastEvent.rotate),
                });
              }}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
