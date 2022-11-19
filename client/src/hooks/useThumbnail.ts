import { useState, useEffect } from "react";

// ------------------------------------------------------------------------------------------
import { getVideoCover } from "../utils";

// -------------------------------
export default function useThumbnail(file: any) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // ----------
  useEffect(() => {
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
  }, [file]);

  // ----------
  return { thumbnail, loading };
}
