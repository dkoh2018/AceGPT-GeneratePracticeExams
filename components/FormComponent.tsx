import * as React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Slider, Box, MenuItem, Select } from '@mui/material';
import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loadingdots';

const generateFormSchema = z.object({
  apiKey: z.string().min(3),
  model: z.string().min(3),
  prompt: z.string().min(3).max(4000),
  file: z.any().optional(),
  difficulty: z.number().min(1).max(10).default(5),
  additionalInstructions: z.string().optional(),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const models = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
  { value: 'gpt-4', label: 'gpt-4' },
  { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
];

const marks = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

interface FormComponentProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: GenerateFormValues) => void;
  isLoading: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
  onSubmit,
  isLoading,
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
      additionalInstructions: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paste OpenAI API Key here</FormLabel>
                <FormControl>
                  <Input placeholder="Your OpenAI API Key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Model</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    displayEmpty
                  >
                    {models.map((model) => (
                      <MenuItem key={model.value} value={model.value}>
                        {model.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paste/Write your questions here</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Example question: Explain the process of photosynthesis. Include the chemical equation and describe the roles of chlorophyll, light, water, and carbon dioxide in the process."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <Box mt={1} color="text.secondary">
                  Upload a file to generate consistent exams.
                </Box>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <FormControl>
                  <Slider
                    {...field}
                    min={1}
                    max={10}
                    step={1}
                    marks={marks}
                    valueLabelDisplay="auto"
                    defaultValue={5}
                    onChange={(e, value) => field.onChange(value)}
                    sx={{
                      '& .MuiSlider-markLabel': {
                        fontSize: '0.75rem',
                        color: 'grey',
                      },
                      mb: 3,
                    }}
                  />
                </FormControl>
                <Box mt={1} color="text.secondary">
                  Select the difficulty level for the exam. The default level is
                  5, which is medium difficulty. Move the slider to 1 for easier
                  and 10 for harder questions.
                </Box>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific instructions?"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center max-w-[200px] mx-auto w-full"
          >
            {isLoading ? <LoadingDots color="white" /> : 'Generate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComponent;
