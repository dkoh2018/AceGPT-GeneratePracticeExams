import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider, Box, MenuItem, Select } from '@mui/material';
import {
  GenerateFormValues,
  generateFormSchema,
  models,
  marks,
} from './constants';

interface FormSectionProps {
  onSubmit: (values: GenerateFormValues) => void;
  isLoading: boolean;
  response: string | null;
}

const FormSection: React.FC<FormSectionProps> = ({
  onSubmit,
  isLoading,
  response,
}) => {
  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: 'onChange',
    defaultValues: {
      apiKey: '',
      model: 'gpt-4o',
      prompt: '',
      file: undefined,
      difficulty: 5,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* ... Form Fields ... */}
          <Button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center max-w-[200px] mx-auto w-full"
          >
            {isLoading ? 'Loading...' : response ? '✨ Regenerate' : 'Generate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormSection;
