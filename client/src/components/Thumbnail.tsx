import classNames from "../utils/classNames";
import useThumbnail from "../hooks/useThumbnail";
// ------------------------------------------------------------------------------------------

interface IThumbnail {
  color: string;
  file: File | undefined;
}

// ------------------------------------------------------------------------------------------
export default function Thumbnail({ color, file }: IThumbnail) {
  const { loading, thumbnail } = useThumbnail(file);

  return (
    <div className={classNames("h-10 w-10 overflow-hidden rounded-sm", color)}>
      {!loading && thumbnail ? (
        <img
          src={thumbnail}
          alt="thumbnail"
          className="h-10 w-10 object-cover"
        />
      ) : null}
    </div>
  );
}
