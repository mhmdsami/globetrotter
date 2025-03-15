import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function tw(...classNames: ClassValue[]) {
  return twMerge(clsx(classNames));
}
