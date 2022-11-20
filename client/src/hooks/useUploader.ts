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
export default function useUploader(file: any, onComplete?: () => void) {
  const [isReady, setIsReady] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [status, setStatus] = useState(FILE_STATUS.IDLE);
  const [percentage, setPercentage] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);

  // ----------
  const tokenRef = useRef<string | null | undefined>(null);

  // ----------
  const url = `http://${location.hostname}:3001/upload`;

  // ----------
  const handleOnProgress = (e: any, loaded: any, filesize: number) => {
    const percentage = Math.round((loaded / filesize) * 100);
    setUploadedBytes(loaded);
    setPercentage(percentage);
  };

  // ----------
  const handleOnPause = () => {
    request.abort();
    setStatus(FILE_STATUS.PAUSED);
  };

  // ----------
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
  const handleOnError = (e: any) => setStatus(FILE_STATUS.ERROR);

  // ----------
  const handleOnAbort = (e: any) => setStatus(FILE_STATUS.PAUSED);

  // ----------
  const handleOnComplete = (e: any) => {
    setPercentage(100);
    setStatus(FILE_STATUS.COMPLETE);
    onComplete && onComplete();
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
  const uploadFileInChunks = async (token: string, startingByte: number) => {
    if (!file) return;
    const req = new XMLHttpRequest();
    const formData = new FormData();
    const chunk = file.slice(startingByte);

    formData.append("chunk", chunk, file.name);
    formData.append("token", token);

    req.open("POST", url, true);
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
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 2000);
  }, []);

  // ----------
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
