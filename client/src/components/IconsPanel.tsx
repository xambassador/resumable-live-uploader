import { motion } from "framer-motion";
import TrashIcon from "../icons/TrashIcon";
import DoneIcon from "../icons/DoneIcon";
import PauseIcon from "../icons/Pause";
import ResumeIcon from "../icons/Resume";
import Retry from "../icons/RetryIcon";
import AlertIcon from "../icons/AlertIcon";

// ------------------------------------------------------------------------------------------
const FILE_STATUS = {
  PENDING: "pending",
  UPLOADING: "uploading",
  ERROR: "error",
  COMPLETE: "complete",
  PAUSED: "paused",
  FAILED: "failed",
  IDLE: "idle",
};

// -------------------------------
interface IIconsPanel {
  status: string;
  file: File | undefined;
  onDelete: (file: File | undefined | null) => {};
  onPause: () => void;
  onResume: () => void;
  onRemove: (onDelete: (file: File | undefined | null) => {}) => void;
  onRetry: () => void;
}

// ------------------------------------------------------------------------------------------
export default function IconsPanel({
  status,
  file,
  onDelete,
  onPause,
  onResume,
  onRemove,
  onRetry,
}: IIconsPanel) {
  return (
    <div className="flex items-center">
      {status === FILE_STATUS.COMPLETE && (
        <motion.button
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          onClick={() => onDelete(file)}
          className="mr-1"
        >
          <DoneIcon />
        </motion.button>
      )}
      {status === FILE_STATUS.UPLOADING && (
        <motion.button
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          onClick={() => onPause()}
          className="mr-1"
        >
          <PauseIcon />
        </motion.button>
      )}
      {status === FILE_STATUS.PAUSED && (
        <motion.button
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          onClick={() => onResume()}
          className="mr-1"
        >
          <ResumeIcon />
        </motion.button>
      )}
      {(status === FILE_STATUS.FAILED || status === FILE_STATUS.ERROR) && (
        <motion.button
          key="alert"
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="mr-1"
        >
          <AlertIcon />
        </motion.button>
      )}
      {(status === FILE_STATUS.FAILED || status === FILE_STATUS.ERROR) && (
        <motion.button
          key="retry"
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="mr-1"
          onClick={() => onRetry()}
        >
          <Retry />
        </motion.button>
      )}
      {status === FILE_STATUS.PAUSED ||
      status === FILE_STATUS.FAILED ||
      status === FILE_STATUS.ERROR ||
      status === FILE_STATUS.COMPLETE ? (
        <motion.button
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          onClick={() => onRemove(onDelete)}
          className="mr-1"
        >
          <TrashIcon />
        </motion.button>
      ) : null}
    </div>
  );
}
