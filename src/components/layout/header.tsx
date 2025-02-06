import { ContactForm } from "../contact";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function PageHeader() {
  return (
    <header className="p-4 flex justify-between items-center print:hidden">
      <h1 className="font-serif text-xl font-extrabold">Datresume</h1>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">Help Us Improve</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What do you think of <span className="font-serif font-bold">Datresume</span>?</DialogTitle>
            </DialogHeader>

            <p className="mt-4">We would love to hear your feedback to improve our service. Please let us know what you think of our service.</p>
            <ContactForm />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}