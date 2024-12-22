import supabase from "@/utils/supabase";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function Menu() {
  const { user, fetched } = useRouteContext({ from: "/(app)" });

  // disable logging in for now
  return;

  if (!fetched) return;

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/login" search={{ redirectTo: window.location.pathname }}>
              <Button variant="outline" size="icon-lg"><LogIn /></Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Log in</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-lg" onClick={() => supabase.auth.signOut()}><LogOut /></Button>
          </TooltipTrigger>
          <TooltipContent side="right">Log out</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}