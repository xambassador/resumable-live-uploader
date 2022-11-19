import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------------------------------------------
import TrashIcon from "../icons/TrashIcon";
import DoneIcon from "../icons/DoneIcon";
import PauseIcon from "../icons/Pause";
import ResumeIcon from "../icons/Resume";

// ------------------------------------------------------------------------------------------
import classNames from "../utils/classNames";
import { trimStringFromMiddle } from "../utils/strings";

// ------------------------------------------------------------------------------------------
import useUploader from "../hooks/useUploader";
import useThumbnail from "../hooks/useThumbnail";
import useRandomColors from "../hooks/useRandomColors";

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

// ------------------------------------------------------------------------------------------
export default function UploadingFileCard({
  delay = 0,
  file,
  // @ts-ignore
  onDelete = (file: File | null | undefined) => {},
}: {
  delay?: number;
  file?: File;
  onDelete?: (file: File | undefined | null) => {};
}) {
  const { color } = useRandomColors();
  const { loading, thumbnail } = useThumbnail(file);
  const { ready, status, percentage, onResume, onRemove, onPause } =
    useUploader(file);

  // ----------
  return (
    <motion.li
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5, delay }}
      className="relative mb-4 flex h-20 w-full origin-center items-center"
    >
      {/* Thumbnail */}
      <div
        className={classNames("h-10 w-10 overflow-hidden rounded-sm", color)}
      >
        {!loading && thumbnail ? (
          <img
            src={thumbnail}
            alt="thumbnail"
            className="h-10 w-10 object-cover"
          />
        ) : null}
      </div>
      {/* File name and progressbar */}
      <div className="ml-4 mr-2 h-10 w-9/12">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <span>{trimStringFromMiddle(file?.name, 30)}</span>
          <AnimatePresence initial={false}>
            {ready && (
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-slate-500"
              >
                {percentage}%
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="h-2 w-full">
          <AnimatePresence initial={false} mode="wait">
            {!ready ? (
              <motion.span
                key="initializing"
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="mt-2 text-sm text-gray-600"
              >
                Initializing...
              </motion.span>
            ) : (
              <div
                key="progress-bar"
                className="relative mt-2 block h-2 w-full overflow-hidden rounded-3xl"
              >
                <motion.span
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 1 }}
                  style={{ transformOrigin: "left" }}
                  className={classNames(
                    "absolute top-0 left-0 block h-2 w-full rounded-3xl",
                    color
                  )}
                ></motion.span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: "spring" }}
                  className={classNames("block h-2 rounded-3xl", color)}
                ></motion.span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Icons */}
      {status === FILE_STATUS.COMPLETE && (
        <motion.button
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          onClick={() => onDelete(file)}
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
        >
          <ResumeIcon />
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
        >
          <TrashIcon />
        </motion.button>
      ) : null}
    </motion.li>
  );
}
