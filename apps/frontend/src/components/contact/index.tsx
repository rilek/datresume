import { useForm } from "react-hook-form";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { supabase } from '@/utils/supabase/client';

export const ContactForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const { reset, control } = form;

  const onSubmit = ({ name, email, message }: any) => {
    reset();
    supabase.functions.invoke("contact", { body: { name, email, message } });
    window.umami?.track("submit_contact_form");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Input {...field} />
          </div>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input {...field} />
          </div>
        )}
      />
      <FormField
        control={control}
        name="message"
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <Label>Message *</Label>
            <Textarea {...field} />
          </div>
        )} />

      <Button type="submit" disabled={form.formState.isSubmitSuccessful}>Submit</Button>
      {form.formState.isSubmitting && <p className="text-sm text-gray-500">Submitting...</p>}
      {form.formState.isSubmitSuccessful && <p className="text-sm text-green-600">Thank you for your message. We will get back to you soon.</p>}
    </form>
  )
};