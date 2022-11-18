import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

// ------------------------------------------------------------------------------------------
import UploadingFileCard from "./components/UploadingFileCard";
import FolderIcon from "./icons/FolderIcon";

// -------------------------------
// store each upload request for tracking them
const fileRequests = new WeakMap();

// -------------------------------
// default options of each requests
const defaultOptions = {
  url: "/",
  fileId: null,
  startingByte: 0,
  onComplete() {},
  onProgress() {},
  onError() {},
  onAbort() {},
  onTimeout() {},
};

// -------------------------------
const colors = [
  "bg-red-200",
  "bg-yellow-400",
  "bg-green-300",
  "bg-blue-200",
  "bg-indigo-300",
  "bg-purple-400",
  "bg-pink-400",
  "bg-gray-600",
];

// -------------------------------
function App() {
  const [files, setFiles] = useState<any>([]);
  const [ref, { height }] = useMeasure();
  const dropZoneRef = useRef<any>();

  // ----------
  const uploadFileInChunks = () => {};

  // ----------
  const cancelFileUpload = () => {};

  // ----------
  const clearUploads = () => {};

  // ----------
  const resumeFileUpload = () => {};

  // ----------
  const retryFileUpload = () => {};

  // ----------
  const handleOnRemove = (file: any) => {
    if (!file) return;
    const arr = files.filter((f: any) => f !== file);
    setFiles(arr);
  };

  // ----------
  // Drag and drop handler
  const handleOnDrop = (ev: any) => {
    const arr: any[] = [];
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // todo: Check file types. Only videos are supported
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

    setFiles([...files, ...arr]);
  };

  // ----------
  const handleOnDragOver = (ev: any) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  // ----------
  const handleOnDragEnter = () => {
    dropZoneRef.current.classList.add("bg-green-100");
  };

  // ----------
  const handleOnDragLeave = () => {
    dropZoneRef.current.classList.remove("bg-green-100");
  };

  // ----------
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-green-50">
      <div className="min-w-[28rem] rounded-3xl bg-white p-10 shadow-2xl">
        <div className="py-8">
          <h1 className="text-center font-sans text-2xl font-medium text-gray-900">
            Upload your files
          </h1>
          <p className="mt-2 text-center font-sans text-gray-500">
            Files should be video and images.
          </p>
          <div className="relative w-full">
            <label
              className="mt-10 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-400 bg-green-50 text-lg font-medium text-gray-800"
              htmlFor="file-upload"
              id="drop-zone"
              onDrop={handleOnDrop}
              onDragOver={handleOnDragOver}
              onDragEnter={handleOnDragEnter}
              onDragLeave={handleOnDragLeave}
              ref={dropZoneRef}
            >
              <FolderIcon />
              Upload or Drag and Drop your files
            </label>
            <input
              type="file"
              className="hidden"
              multiple
              accept="video/*"
              id="file-upload"
              //@ts-ignore
              onChange={(e) => setFiles([...files, ...e.target.files])}
            />
          </div>
          <motion.div
            animate={{ height: height }}
            transition={{ duration: 0.5 }}
            key="items-container"
          >
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
                <ul className="mt-6 w-full" ref={ref}>
                  {files.map((file: any) => (
                    <UploadingFileCard
                      key={file.name}
                      delay={0.6}
                      color={colors[files.indexOf(file) % colors.length]}
                      file={file}
                      onDelete={handleOnRemove}
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
