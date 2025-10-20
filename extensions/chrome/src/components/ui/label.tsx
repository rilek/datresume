import { cn } from "@/utils";
import { ComponentProps } from "react";

export const Label = ({ className, ...props }: ComponentProps<"label">) =>
  <label {...props} className={cn("block text-xs font-bold text-gray-700 mb-0.5", className)} />