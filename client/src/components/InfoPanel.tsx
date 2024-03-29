import { motion, AnimatePresence } from "framer-motion";
import byteSize from "byte-size";
// ------------------------------------------------------------------------------------------

import classNames from "../utils/classNames";
import { trimStringFromMiddle } from "../utils/strings";

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

interface IInfoPanel {
  file: File | undefined;
  ready: boolean;
  percentage: number;
  uploadedBytes: number;
  color: string;
  status: string;
}

// ------------------------------------------------------------------------------------------
export default function InfoPanel({
  file,
  ready,
  percentage,
  uploadedBytes,
  color,
  status,
}: IInfoPanel) {
  return (
    <div className="ml-4 mr-2 h-10 w-9/12">
      <div className="flex justify-between text-sm font-medium">
        <span>{trimStringFromMiddle(file?.name, 30)}</span>
        <AnimatePresence initial={false}>
          {ready && status !== FILE_STATUS.PENDING && (
            <motion.span
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={classNames(
                "text-slate-300",
                status === FILE_STATUS.ERROR ? "text-red-400" : "",
                status === FILE_STATUS.FAILED ? "text-red-400" : ""
              )}
            >
              {percentage}%
            </motion.span>
          )}
          {ready && status === FILE_STATUS.PENDING && (
            <motion.span
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Initializing...
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="h-2 w-full">
        <AnimatePresence initial={false} mode="wait">
          {ready && (
            <motion.p
              className={classNames(
                "mt-1 text-sm text-slate-500",
                status === FILE_STATUS.ERROR ? "text-red-400" : "",
                status === FILE_STATUS.FAILED ? "text-red-400" : ""
              )}
            >
              {byteSize(uploadedBytes).toString()}
              {" / "}
              {byteSize(file?.size || 1).toString()}
              {(status === FILE_STATUS.ERROR ||
                status === FILE_STATUS.FAILED) && (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="ml-2 text-sm text-red-500"
                >
                  Upload failed
                </motion.span>
              )}
            </motion.p>
          )}
          {!ready ? (
            <motion.span
              key="initializing"
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="mt-2 text-sm"
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
              {(status === FILE_STATUS.ERROR ||
                status === FILE_STATUS.FAILED) && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `50%` }}
                  transition={{ type: "spring" }}
                  className={"block h-2 rounded-3xl bg-red-300"}
                ></motion.span>
              )}
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
  );
}
