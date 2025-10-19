import clsx from "clsx";
import { ComponentProps } from "react";

export const Label = ({ className, ...props }: ComponentProps<"label">) =>
  <label {...props} className={clsx("block text-xs font-bold text-gray-700 mb-0.5", className)} />