import { Link } from "@tanstack/react-router";
import { EllipsisVerticalIcon, StarIcon } from "lucide-react";
import type { Resume } from "@/types/supabase/entities";
import { Button } from "../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { NewResumeButton } from "./new-resume-button";

const ResumeCard = ({ resume: { id, name, created_at, updated_at, content, is_default } }: { resume: Resume }) => (
  <Card key={id} className="relative ">
    <CardHeader className="order-1">
      <CardTitle>{name}</CardTitle>
      <CardDescription>Last updated: {new Date(updated_at || created_at).toLocaleDateString()}</CardDescription>
      <CardAction>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-lg">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to="/app/resumes/$resumeId" params={{ resumeId: id }}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardAction>
    </CardHeader>
    <CardContent className="border-b">
      {is_default && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-3 right-3 p-2 rounded text-xs">
                <StarIcon />
              </div>
            </TooltipTrigger>
            <TooltipContent>Default resume</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="prose font-serif max-h-54 overflow-hidden max-w-none select-none" style={{ fontSize: "4px" }}>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: just because */}
        <div dangerouslySetInnerHTML={{ __html: content.html || "" }} />
      </div>
    </CardContent>
  </Card>
);

export const Resumes = ({ resumes }: { resumes: Resume[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}

      <NewResumeButton />
    </div>
  );
};
