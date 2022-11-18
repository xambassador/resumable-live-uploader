import { motion } from "framer-motion";

// ------------------------------------------------------------------------------------------
import TrashIcon from "../icons/TrashIcon";
import DoneIcon from "../icons/DoneIcon";

// ------------------------------------------------------------------------------------------
import classNames from "../utils/classNames";
import { trimStringFromMiddle } from "../utils/strings";

// ------------------------------------------------------------------------------------------
export default function UploadingFileCard({
  color = "bg-green-400",
  delay = 0,
  file,
  onDelete = () => {},
}: {
  color?: string;
  delay?: number;
  file?: File;
  onDelete?: (file: File | undefined | null) => void;
}) {
  return (
    <motion.li
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.5, delay }}
      className="mb-4 flex h-20 w-full origin-center items-center"
    >
      <div className={classNames("h-10 w-10 rounded-sm", color)}></div>
      <div className="ml-4 mr-2 w-9/12">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <span>{trimStringFromMiddle(file?.name, 30)}</span>
          <motion.span className="text-slate-500">100%</motion.span>
        </div>
        <motion.span
          className={classNames("mt-2 block h-2 w-full rounded-3xl", color)}
        ></motion.span>
      </div>
      <DoneIcon />
      <button onClick={() => onDelete(file)}>
        <TrashIcon />
      </button>
    </motion.li>
  );
}
