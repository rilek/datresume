import { Link } from "@tanstack/react-router";
import { ContactForm } from "../contact";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function PageHeader() {
  return (
    <header className="p-4 flex justify-between items-center print:hidden">
      <Link to="/" className="hover:opacity-50 transition-opacity"><h1 className="font-serif text-xl font-extrabold">Datresume</h1></Link>

      <div className="flex gap-4">
        {/* <a href="https://www.producthunt.com/posts/datresume?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-datresume" target="_blank">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=855558&theme=light&t=1738915308541" alt="Datresume - Perfect&#0032;resume&#0032;for&#0032;perfect&#0032;job&#0032;&#0045;&#0032;no&#0032;sign&#0032;up&#0032;required&#0033; | Product Hunt" style={{ width: 148, height: 32 }} width="148" height="32" />
        </a> */}

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">Help Us Improve</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What do you think of <span className="font-serif font-bold">Datresume</span>?</DialogTitle>
            </DialogHeader>

            <DialogDescription>We would love to hear your feedback to improve our service. Please let us know what you think of our service.</DialogDescription>
            <ContactForm />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}