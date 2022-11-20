import { useState, useEffect } from "react";

// ------------------------------------------------------------------------------------------
import { getVideoCover } from "../utils";

const getIcon = (type: string) => {
  if (type.includes("application/zip")) {
    return "/zip.jpg";
  }
  if (type.includes("audio")) {
    return "/sound.jpg";
  }
};

// -------------------------------
export default function useThumbnail(file: any) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // ----------
  useEffect(() => {
    if (file.type.includes("image")) {
      setThumbnail(URL.createObjectURL(file));
      setLoading(false);
    } else if (!file.type.includes("video")) {
      setThumbnail(getIcon(file.type));
      setLoading(false);
    } else {
      (async () => {
        if (file && !thumbnail) {
          try {
            const cover = await getVideoCover(file, 1.5);
            setThumbnail(URL.createObjectURL(cover as Blob));
            setLoading(false);
          } catch (ex) {
            setLoading(false);
          }
        }
      })();
    }
  }, [file]);

  // ----------
  return { thumbnail, loading };
}
