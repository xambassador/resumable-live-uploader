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

// -------------------------------
function App() {
  const [files, setFiles] = useState<any>([]);
  const [ref, { height }] = useMeasure();
  const [error, setError] = useState("");
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPaused, setTotalPaused] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);

  // ----------
  const handleOnRemove = (file: any) => {
    if (!file) return;
    const arr = files.filter((f: any) => f !== file);
    setTotalCancelled(totalCancelled + 1);
    setFiles(arr);
  };

  // ----------
  const handleOnComplete = () => {
    setTotalCompleted(totalCompleted + 1);
  };

  // ----------
  const handleOnPause = () => {
    setTotalPaused(totalPaused + 1);
  };

  // ----------
  const handleOnResume = () => {
    setTotalPaused(totalPaused - 1);
  };

  // ----------
  const handleOnItemsDrop = (items: any) => {
    setError("");
    const arr = [...files, ...items];
    if (arr.length < 4) {
      setFiles(arr);
    } else {
      setFiles([]);
      setError("Can't add more then 3 items");
    }
  };

  // ----------
  const handleOnChange = (e: any) => {
    setError("");
    const arr = [...files, ...e.target.files];
    if (arr.length < 4) {
      setFiles(arr);
    } else {
      setFiles([]);
      setError("Can't add more then 3 items");
    }
  };

  // ----------
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-green-50">
      <div className="min-w-[35rem] rounded-3xl bg-white p-10 pb-8 shadow-2xl">
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
          <h1 className="text-center font-sans text-2xl font-medium text-gray-900">
            Upload your files
          </h1>
          <p className="mt-2 text-center font-sans text-gray-500">
            Files should be video and images.
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
                className="mt-6 font-medium text-gray-500"
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
                      handleOnComplete={handleOnComplete}
                      handleOnPause={handleOnPause}
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
