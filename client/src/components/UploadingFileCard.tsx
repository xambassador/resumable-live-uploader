import { motion } from "framer-motion";
import classNames from "../utils/classNames";
import { trimStringFromMiddle } from "../utils/strings";

export default function UploadingFileCard({
  color = "bg-green-400",
  delay = 0,
  file,
}: {
  color?: string;
  delay?: number;
  file?: File;
}) {
  return (
    <motion.li
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", duration: 0.5, delay }}
      className="mb-4 flex h-20 w-full origin-center items-center"
    >
      <div
        className={classNames("h-10 w-10 rounded-sm bg-green-400", color)}
      ></div>
      <div className="ml-4 mr-2 w-9/12">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <span>{trimStringFromMiddle(file?.name, 30)}</span>
          <motion.span className="text-slate-500">100%</motion.span>
        </div>
        <motion.span
          className={classNames("mt-2 block h-2 w-full rounded-3xl", color)}
        ></motion.span>
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.li>
  );
}
