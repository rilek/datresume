import { Link, useRouteContext } from "@tanstack/react-router";
import { ContactForm } from "../contact";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";



export default function PageHeader({ links }: { links?: React.ReactNode }) {
  return (
    <header className="p-4 flex justify-between items-center">
      <Link to="/" className="hover:opacity-50 transition-opacity"><h1 className="font-serif text-xl font-extrabold">Datresume</h1></Link>

      <div className="flex gap-4">
        {links}
      </div>
    </header>
  )
}