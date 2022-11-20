import { motion } from "framer-motion";

// ------------------------------------------------------------------------------------------
import Thumbnail from "./Thumbnail";
import InfoPanel from "./InfoPanel";
import IconsPanel from "./IconsPanel";

// ------------------------------------------------------------------------------------------
import useUploader from "../hooks/useUploader";
import useRandomColors from "../hooks/useRandomColors";

// ------------------------------------------------------------------------------------------
export default function UploadingFileCard({
  delay = 0,
  file,
  // @ts-ignore
  onDelete = (file: File | null | undefined) => {},
  handleOnComplete,
  handleOnPause,
  handleOnResume,
}: {
  delay?: number;
  file?: File;
  onDelete?: (file: File | undefined | null) => {};
  handleOnComplete: () => void;
  handleOnPause: () => void;
  handleOnResume: () => void;
}) {
  const { color } = useRandomColors();

  const {
    ready,
    status,
    percentage,
    uploadedBytes,
    onResume,
    onRemove,
    onPause,
    onRetry,
  } = useUploader(file, handleOnComplete);

  // ----------
  return (
    <motion.li
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5, delay }}
      className="relative mb-4 flex h-20 w-full origin-center items-center"
    >
      <Thumbnail color={color} file={file} />

      <InfoPanel
        color={color}
        uploadedBytes={uploadedBytes}
        ready={ready}
        percentage={percentage}
        file={file}
        status={status}
      />

      <IconsPanel
        onDelete={onDelete}
        onPause={() => {
          handleOnPause();
          onPause();
        }}
        onRemove={onRemove}
        onResume={() => {
          handleOnResume();
          onResume();
        }}
        onRetry={onRetry}
        status={status}
        file={file}
      />
    </motion.li>
  );
}
