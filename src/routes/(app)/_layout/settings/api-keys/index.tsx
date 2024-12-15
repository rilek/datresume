import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useApiKeys } from '@/stores/keys'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/(app)/_layout/settings/api-keys/')({
  component: RouteComponent,
})

const KeysForm = ({ defaultValue }: { defaultValue?: string }) => {
  const { toast } = useToast();
  const saveKey = useApiKeys(state => state.saveKey);
  const form = useForm({
    defaultValues: {
      openai: defaultValue ?? '',
    }
  });

  const onSubmit = (data: { openai: string }) => saveKey(toast, data.openai);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="openai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI</FormLabel>
              <FormControl>
                <Input placeholder="Place your API key here..." {...field} />
              </FormControl>
              <FormDescription>
                It will be stored encrypted in DB
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-8'>

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

function RouteComponent() {
  const loading = useApiKeys(state => state.loading);
  const fetched = useApiKeys(state => state.fetched);
  const loadKey = useApiKeys(state => state.loadKey);
  const key = useApiKeys(state => state.key);

  useEffect(() => {
    loadKey();
  }, []);

  return <div className="container py-12 mx-auto">
    <h1 className='text-3xl font-bold'>API Keys</h1>

    {(loading && !fetched) ? <Loader2 /> : <div className="max-w-lg my-12">
      <KeysForm defaultValue={key} />
    </div>}
  </div>
}
