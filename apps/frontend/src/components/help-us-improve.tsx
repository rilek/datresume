import { ContactForm } from "./contact";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const HelpUsImprove = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Help Us Improve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            What do you think of <span className="font-serif font-bold">Datresume</span>?
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          We would love to hear your feedback to improve our service. Please let us know what you think of our service.
        </DialogDescription>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
};
