import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

// ------------------------------------------------------------------------------------------
import classNames from "../utils/classNames";

// ------------------------------------------------------------------------------------------
const getRandomTransformOrigin = () => {
  const value = (16 + 40 * Math.random()) / 100;
  const value2 = (15 + 36 * Math.random()) / 100;
  return {
    originX: value,
    originY: value2,
  };
};

// ------------------------------------------------------------------------------------------
const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

// ------------------------------------------------------------------------------------------
const randomDuration = () => Math.random() * 0.07 + 0.23;

// ------------------------------------------------------------------------------------------
const variants = {
  start: (i: number) => ({
    rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
    transition: {
      delay: getRandomDelay(),
      repeat: Infinity,
      duration: randomDuration(),
    },
  }),
  reset: {
    rotate: 0,
  },
};

// ------------------------------------------------------------------------------------------
const checkValidFileType = (type: string) => {
  const validTypes = [
    "video",
    "image",
    "application/zip",
    "application/vnd.rar",
    "audio",
  ];
  return validTypes.find((value: string) => type.includes(value));
};

// ------------------------------------------------------------------------------------------
export default function Dropzone({
  children,
  htmlFor = "dropzone",
  onItemsDrop = (items: any) => {},
}: {
  children?: any;
  onItemsDrop?: (items: any) => void;
  htmlFor?: string;
}) {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidDragItem, setIsValidDragItem] = useState(true);

  // ----------
  // Drag and drop handler
  const handleOnDrop = (ev: any) => {
    controls.start("reset");
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (!isValidDragItem) {
      setIsValidDragItem(true);
      return;
    }

    const arr: any[] = [];

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          arr.push(item.getAsFile());
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        arr.push(file);
      });
    }

    setIsDragging(false);
    onItemsDrop(arr);
  };

  // ----------
  const handleOnDragOver = (ev: any) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    let isValidFile = false;
    [...ev.dataTransfer.items].forEach((item) => {
      if (item.kind === "file" && checkValidFileType(item.type)) {
        isValidFile = true;
      }
    });

    !isValidDragItem ? controls.start("start") : controls.start("reset");
    setIsValidDragItem(isValidFile);
  };

  // ----------
  const handleOnDragEnter = () => setIsDragging(true);

  // ----------
  const handleOnDragLeave = () => {
    setIsDragging(false);
    setIsValidDragItem(true);
    controls.start("reset");
  };

  return (
    <motion.label
      className={classNames(
        "mt-10 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-400 bg-green-50 text-lg font-medium text-gray-800",
        isDragging ? "bg-green-200" : "",
        isValidDragItem ? "" : "border-red-400 bg-red-300"
      )}
      style={{
        ...getRandomTransformOrigin(),
      }}
      variants={variants}
      animate={controls}
      htmlFor={htmlFor}
      id="drop-zone"
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
    >
      {children}
    </motion.label>
  );
}
