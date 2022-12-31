import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

// ------------------------------------------------------------------------------------------
import UploadingFileCard from "./components/UploadingFileCard";
import Dropzone from "./components/Dropzone";

// ------------------------------------------------------------------------------------------
import FolderIcon from "./icons/FolderIcon";
import CancleIcon from "./icons/CancelIcon";
import DoneIcon from "./icons/DoneIcon";
import PauseIcon from "./icons/Pause";

// ------------------------------------------------------------------------------------------
import { useUploadContext } from "./context";

// -------------------------------
function App() {
  const [ref, { height }] = useMeasure();
  const {
    files,
    error,
    totalCancelled,
    totalCompleted,
    totalPaused,
    handleOnItemsDrop,
    handleOnComplete,
    handleOnPause,
    handleOnResume,
    handleOnChange,
    handleOnRemove,
  } = useUploadContext();

  // ----------
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900">
      <div className="min-w-[35rem] rounded-3xl bg-slate-800 p-10 pb-8 text-slate-400 shadow-2xl">
        <div className="py-8">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring" }}
              className="mb-4 text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
          <h1 className="text-center font-sans text-2xl font-medium text-slate-50">
            Upload your files
          </h1>
          <p className="mt-2 text-center font-sans">
            Files should be video, images, audio, zip or rar.
          </p>
          <div className="relative w-full">
            <Dropzone htmlFor="file-upload" onItemsDrop={handleOnItemsDrop}>
              <FolderIcon />
              Upload or Drag and Drop your files
            </Dropzone>
            <input
              type="file"
              className="hidden"
              multiple
              accept="video/*,image/*,application/zip,audio/*,application/vnd.rar"
              id="file-upload"
              //@ts-ignore
              onChange={handleOnChange}
            />
          </div>
          <div className="mt-4 flex w-full items-center">
            <div className="mr-2 flex w-10">
              <span className="mr-1">{totalCompleted}</span> <DoneIcon />
            </div>
            <div className="mr-2 flex w-10">
              <span className="mr-1">{totalCancelled}</span>
              <CancleIcon />
            </div>
            <div className="flex">
              <span className="mr-1">{totalPaused}</span>
              <PauseIcon />
            </div>
          </div>
          {files && files.length ? (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.3, delay: 0.5 }}
                className="mt-6 font-medium text-slate-200"
              >
                Uploading Files
              </motion.h2>
            </>
          ) : null}
          <motion.div
            animate={{ height: height }}
            transition={{ duration: 0.5 }}
            key="items-container"
          >
            {files && files.length ? (
              <>
                <ul className="mt-6 w-full" ref={ref}>
                  {files.map((file: any) => (
                    <UploadingFileCard
                      key={file.name}
                      delay={0.6}
                      file={file}
                      // @ts-ignore
                      onDelete={handleOnRemove}
                      // @ts-ignore
                      handleOnComplete={handleOnComplete}
                      // @ts-ignore
                      handleOnPause={handleOnPause}
                      // @ts-ignore
                      handleOnResume={handleOnResume}
                    />
                  ))}
                </ul>
              </>
            ) : null}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default App;
