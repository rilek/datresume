import { cn } from "@/utils";
import { ComponentProps } from "react";

export const Input = ({ className, ...props }: ComponentProps<"input">) =>
  <input {...props} className={cn("w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent", className)} />