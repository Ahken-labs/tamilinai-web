"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Button from "../common-layout/Button";

// 200 × 300 portrait ratio (2 : 3)
const ASPECT = 2 / 3;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function getCroppedFile(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height,
  );
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob!], "profile.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.92,
    );
  });
}

type Props = {
  imageSrc: string;
  onConfirm: (file: File, previewUrl: string) => void;
  onClose: () => void;
};

export default function PhotoCropModal({ imageSrc, onConfirm, onClose }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleUse = async () => {
    if (!croppedAreaPixels) return;
    setWorking(true);
    try {
      const file = await getCroppedFile(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(file);
      onConfirm(file, previewUrl);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      {/* Crop area */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: "#000" },
            cropAreaStyle: { borderRadius: "12px" },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-4 px-6 py-4 bg-black">
        <span className="text-white text-sm select-none">−</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-[#B31B38]"
        />
        <span className="text-white text-sm select-none">+</span>
      </div>

      {/* Buttons */}
      <div className="flex max-[380px]:flex-col gap-3 px-4 pb-6 bg-black">
        <Button
          text="Cancel"
          onPress={onClose}
          className="flex-1 !bg-white !text-[#222] hover:!bg-[#F0F0F0]"
        />
        <Button
          text={working ? "Cropping…" : "Use this photo"}
          onPress={handleUse}
          className="flex-1"
        />
      </div>
    </div>
  );
}
