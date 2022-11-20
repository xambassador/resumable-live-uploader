import classNames from "../utils/classNames";
import useThumbnail from "../hooks/useThumbnail";

export default function Thumbnail({
  color,
  file,
}: {
  color: string;
  file: File | undefined;
}) {
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
