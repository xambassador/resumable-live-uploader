import { useState } from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

// ------------------------------------------------------------------------------------------
import UploadingFileCard from "./components/UploadingFileCard";
import Dropzone from "./components/Dropzone";
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
function App() {
  const [files, setFiles] = useState<any>([]);
  const [ref, { height }] = useMeasure();

  // ----------
  const handleOnRemove = (file: any) => {
    if (!file) return;
    const arr = files.filter((f: any) => f !== file);
    setFiles(arr);
  };

  // ----------
  const handleOnItemsDrop = (items: any) => {
    setFiles([...files, ...items]);
  };

  // ----------
  const handleOnChange = (e: any) => {
    setFiles([...files, ...e.target.files]);
  };

  // ----------
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-green-50">
      <div className="min-w-[35rem] rounded-3xl bg-white p-10 shadow-2xl">
        <div className="py-8">
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
              accept="video/*"
              id="file-upload"
              //@ts-ignore
              onChange={handleOnChange}
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
                      file={file}
                      // @ts-ignore
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
