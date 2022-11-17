import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// store each upload request for tracking them
const fileRequests = new WeakMap();

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

function UploadingFileCard({ color = "bg-green-400" }: { color?: string }) {
  return (
    <motion.div className="flex w-full items-center py-4">
      <div
        className={classNames("h-10 w-10 rounded-sm bg-green-400", color)}
      ></div>
      <div className="ml-4 mr-2 w-9/12">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <span>Down to hell</span>
          <span className="text-slate-500">100%</span>
        </div>
        <span
          className={classNames("mt-2 block h-2 w-full rounded-3xl", color)}
        ></span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="h-10 w-10"
      >
        <path
          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#16a34a"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </motion.div>
  );
}

function App() {
  const [files, setFiles] = useState([]);

  const uploadFileInChunks = () => {};

  const cancelFileUpload = () => {};

  const clearUploads = () => {};

  const resumeFileUpload = () => {};

  const retryFileUpload = () => {};

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-green-50">
      <div className="min-h-[31.5rem] min-w-[28rem] rounded-3xl bg-white p-10 shadow-2xl">
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
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload or Drag and Drop your files
          </label>
          <input
            type="file"
            className="hidden"
            multiple
            accept="video/*"
            id="file-upload"
          ></input>
        </div>
        <AnimatePresence initial={false}>
          <motion.h2 className="mt-6 font-medium text-gray-500">
            Uploading Files
          </motion.h2>
          <div className="mt-6 w-full">
            <UploadingFileCard />
          </div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
