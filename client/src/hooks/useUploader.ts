import { useState, useEffect, useRef } from "react";

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
const ping = ({ url, timeout }: { url: string; timeout: number }) => {
  return new Promise((resolve) => {
    const isOnline = () => resolve(true);
    const isOffline = () => resolve(false);

    const xhr = new XMLHttpRequest();

    xhr.onerror = isOffline;
    xhr.ontimeout = isOffline;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        if (xhr.status) {
          isOnline();
        } else {
          isOffline();
        }
      }
    };

    xhr.open("GET", url);
    xhr.timeout = timeout;
    xhr.send();
  });
};

// -------------------------------
interface IUploadEvents {
  onCompleted?: () => void;
  onProgress?: (
    e: any,
    loaded: any,
    filesize: number,
    percentage: number
  ) => void;
  onError?: (e: any) => void;
  onAbort?: (e: any) => void;
}

// -------------------------------
export default function useUploader(file: any, customEvents: IUploadEvents) {
  // Is the file ready to be uploaded
  const [isReady, setIsReady] = useState(false);
  // Store the request object so we can track the progress
  const [request, setRequest] = useState<any>(null);
  // Current status of the file
  const [status, setStatus] = useState(FILE_STATUS.IDLE);
  // Percentage of the file uploaded
  const [percentage, setPercentage] = useState(0);
  // Bytes uploaded
  const [uploadedBytes, setUploadedBytes] = useState(0);

  // ----------
  // Store the token in a ref so we can access it in the event handlers
  const tokenRef = useRef<string | null | undefined>(null);

  // ----------
  // Upload url
  const url = `http://${location.hostname}:3001/upload`;

  // ----------
  // onprogress event handler
  const handleOnProgress = (e: any, loaded: any, filesize: number) => {
    const percentage = Math.round((loaded / filesize) * 100);
    file.percentage = percentage;
    setUploadedBytes(loaded);
    setPercentage(percentage);
    customEvents.onProgress &&
      customEvents.onProgress(e, loaded, filesize, percentage);
  };

  // ----------
  // onPaused event handler
  const handleOnPause = () => {
    request.abort();
    setStatus(FILE_STATUS.PAUSED);
  };

  // ----------
  // onResumed event handler
  const handleOnResume = () => {
    setStatus(FILE_STATUS.PENDING);
    ping({
      url: `http://${location.hostname}:3001/heartbeat`,
      timeout: 500,
    }).then((v) => {
      if (v) {
        fetch(
          `http://${location.hostname}:3001/upload-status?token=${tokenRef.current}&filename=${file?.name}`
        )
          .then((res) => res.json())
          .then((res) => {
            setStatus(FILE_STATUS.UPLOADING);
            uploadFileInChunks(
              tokenRef.current as string,
              res.totalChunkUploaded
            );
          })
          .catch((e) => {
            setStatus(FILE_STATUS.FAILED);
          });
      } else {
        setStatus(FILE_STATUS.FAILED);
      }
    });
  };

  // ----------
  // onRetry event handler
  const handleOnRetry = () => {
    setStatus(FILE_STATUS.PENDING);
    ping({
      url: `http://${location.hostname}:3001/heartbeat`,
      timeout: 500,
    })
      .then((v) => {
        if (v) {
          fetch(
            `http://${location.hostname}:3001/upload-status?token=${tokenRef.current}&filename=${file?.name}`
          )
            .then((res) => res.json())
            .then((res) => {
              setStatus(FILE_STATUS.UPLOADING);
              uploadFileInChunks(
                tokenRef.current as string,
                res.totalChunkUploaded
              );
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          setStatus(FILE_STATUS.FAILED);
        }
      })
      .catch((e) => {
        setStatus(FILE_STATUS.FAILED);
      });
  };

  // ----------
  // onerror event handler
  const handleOnError = (e: any) => setStatus(FILE_STATUS.ERROR);

  // ----------
  // onabort event handler
  const handleOnAbort = (e: any) => setStatus(FILE_STATUS.PAUSED);

  // ----------
  // onload event handler
  const handleOnComplete = (e: any) => {
    customEvents.onCompleted && customEvents.onCompleted();
    setPercentage(100);
    setStatus(FILE_STATUS.COMPLETE);
  };

  // ----------
  const handleOnRemove = (onDelete: (file: File | null | undefined) => {}) => {
    onDelete(file);
    ping({ url: `http://${location.hostname}:3001/heartbeat`, timeout: 500 })
      .then((v) => {
        if (v) {
          fetch(
            `http://${location.hostname}:3001/delete-upload?filename=${file?.name}&token=${tokenRef.current}`,
            {
              method: "DELETE",
            }
          )
            .then((res) => res.json())
            .then((res) => {})
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {});
  };

  // ----------
  // Upload the file in small chunks
  const uploadFileInChunks = async (token: string, startingByte: number) => {
    if (!file) return;
    // Create a new request object
    const req = new XMLHttpRequest();
    // Create a new form data object
    const formData = new FormData();
    // Create a new file chunk
    const chunk = file.slice(startingByte);

    // Add the file chunk to the form data
    formData.append("chunk", chunk, file.name);
    formData.append("token", token);

    // Open the request
    req.open("POST", url, true);
    // Set the custom request headers
    req.setRequestHeader("X-File-Token", token);
    req.setRequestHeader("X-Filename", file.name);
    // req.setRequestHeader("Content-Length", chunk.size); // Browser set this header for us
    req.setRequestHeader(
      "Content-Range",
      // example: bytes=0-999/10000
      // chunk size = file.size - startingByte
      // For set correct endingByte, need to do startingByte + chunk.size
      // Example: totalByte: 25678, startingByte: 10, endingByte: 10 + (25678 - 10) = 25678
      `bytes=${startingByte}-${startingByte + chunk.size}/${file.size}`
    );

    // after upload is complete
    req.onload = (e) => handleOnComplete(e);
    // when request is send
    req.onloadstart = (e) => {};
    // when request is finished
    req.onloadend = (e) => {};

    req.onerror = (e) => handleOnError(e);
    req.ontimeout = (e) => {};
    req.upload.onprogress = (e) => {
      // calculate total loaded bytes by adding startingByte and e.loaded.
      // e.loaded is total uploaded bytes in current request
      const loaded = startingByte + e.loaded;
      handleOnProgress(e, loaded, file.size);
    };
    req.onabort = (e) => handleOnAbort(e);
    req.onreadystatechange = (e) => handleOnError(e);
    req.send(formData);
    // set request to track it,
    setRequest(req);
  };

  // ----------
  const uploadFile = async () => {
    /**
     Handshake with server for initiating an upload request
     Type is POST. Sending filename as Body. Server generates
     a unique token for current uploading file and creates a
     new empty file with combining token and filename.
     */
    setStatus(FILE_STATUS.PENDING);
    ping({ url: `http://${location.hostname}:3001/heartbeat`, timeout: 500 })
      .then((v) => {
        if (v) {
          fetch(`http://${location.hostname}:3001/handshake`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: file?.name }),
          })
            .then(async (res) => res.json())
            .then(async (res) => {
              /**
                 Receiving ok and token in response from server indicating that handshake is complete and client is now
                 ready to upload file to server in small chunks.
                 Token is used to identify the file on server and for further communication with server.
                 */
              tokenRef.current = res.token;
              setStatus(FILE_STATUS.UPLOADING);
              await uploadFileInChunks(res.token as string, 0);
            })
            .catch((err) => {
              console.log(err);
              setStatus(FILE_STATUS.FAILED);
            });
        } else {
          setStatus(FILE_STATUS.FAILED);
        }
      })
      .catch((e) => {
        console.log("Error from ping", e);
        setStatus(FILE_STATUS.FAILED);
      });
  };

  // ----------
  // Effect that register a fake timeout to show progress bar animation
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 2000);
  }, []);

  // ----------
  // Effect that trigger uploadFile when isReady is true
  useEffect(() => {
    isReady &&
      setTimeout(() => {
        // set timeout to show progress bar animation
        uploadFile();
      }, 2000);
  }, [isReady]);

  // ----------
  return {
    ready: isReady,
    status,
    percentage,
    uploadedBytes,
    onPause: handleOnPause,
    onResume: handleOnResume,
    onRemove: handleOnRemove,
    onRetry: handleOnRetry,
  };
}
