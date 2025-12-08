import type { Database } from "./db";

export type Resume = Database["public"]["Tables"]["resumes"]["Row"] & {
  content: {
    html: string;
    name: string;
    is_default: boolean;
  };
};
