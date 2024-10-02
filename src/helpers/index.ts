export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = event.target?.result as string;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const getURLImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
};

export const resizeImageToMaxAllowedSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;

  const ratio = Math.min(widthRatio, heightRatio);

  const width = originalWidth * ratio;
  const height = originalHeight * ratio;

  return { width, height };
};
