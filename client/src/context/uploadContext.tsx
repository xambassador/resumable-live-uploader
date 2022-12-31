import { createContext, useContext, ReactNode, useState } from "react";
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

const UploadContext = createContext({
  files: [],
  error: "",
  totalCompleted: 0,
  totalPaused: 0,
  totalCancelled: 0,
  handleOnRemove: (file: any) => {},
  handleOnComplete: (file: any) => {},
  handleOnPause: (file: any) => {},
  handleOnResume: (file: any) => {},
  handleOnItemsDrop: (items: any) => {},
  handleOnChange: (e: any) => {},
});

function useUploadContext() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUploadContext must be used within a UploadProvider");
  }
  return context;
}

function UploadProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<any>([]);
  const [error, setError] = useState("");
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPaused, setTotalPaused] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);

  // ----------
  const handleOnRemove = (file: any) => {
    if (!file) return;
    const arr = files.filter((f: any) => f !== file);
    if (file.percentage === 100) {
      setFiles(arr);
      return;
    }
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
      // Process only 3 items.
      setFiles([...arr.slice(0, 3)]);
      setError("Can't add more then 3 items");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // ----------
  const handleOnChange = (e: any) => {
    setError("");
    const arr = [...files, ...e.target.files];
    if (arr.length < 4) {
      setFiles(arr);
    } else {
      // Process only 3 items.
      setFiles([...arr.slice(0, 3)]);
      setError("Can't add more then 3 items");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // ----------
  const value = {
    files,
    error,
    totalCompleted,
    totalPaused,
    totalCancelled,
    handleOnRemove,
    handleOnComplete,
    handleOnPause,
    handleOnResume,
    handleOnItemsDrop,
    handleOnChange,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export { UploadProvider, useUploadContext };
