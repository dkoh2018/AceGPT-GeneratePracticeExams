'use client';

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
import { Button } from '@/components/ui/button';
import { Slider, Box, MenuItem, Select } from '@mui/material';
import { useCallback, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingDots from '@/components/ui/loadingdots';
import { toast, Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const generateFormSchema = z.object({
  apiKey: z.string().min(3),
  model: z.string().min(3),
  prompt: z.string().min(3).max(4000),
  file: z.any().optional(),
  difficulty: z.number().min(1).max(10).default(5),
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

const Body = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<string | null>(null);

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

  const handleSubmit = useCallback(async (values: GenerateFormValues) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append('apiKey', values.apiKey);
      formData.append('model', values.model);
      formData.append('prompt', values.prompt);
      formData.append('difficulty', values.difficulty.toString());
      if (values.file) {
        formData.append('file', values.file);
      }

      const response = await fetch('/api/save-form-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save form data');
      }

      const responseData = await response.json();
      const generatedContent = responseData.generatedContent;

      // Generate PDF
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(generatedContent, 180);
      doc.text(lines, 10, 10);
      const pdfData = doc.output('datauristring');

      setResponse(pdfData);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Generate a Practice Test</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                      <FormControl
                        style={{ marginLeft: '10px', height: '40px' }}
                      >
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
                          style={{ height: '200px' }}
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
                        Select the difficulty level for the exam. The default
                        level is 5, which is medium difficulty. Move the slider
                        to 1 for easier and 10 for harder questions.
                      </Box>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center max-w-[200px] mx-auto w-full"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : response ? (
                    '✨ Regenerate'
                  ) : (
                    'Generate'
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {response && (
            <>
              <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
                Your Practice Exam
              </h1>
              <div className="flex flex-col justify-center relative h-auto items-center">
                <div className="relative flex flex-col justify-center items-center gap-y-2 w-[510px] border border-gray-300 rounded shadow group p-2 mx-auto bg-gray-400 aspect-square max-w-full">
                  <p>TEST GENERATED</p>
                </div>
              </div>
              <div className="flex justify-center gap-5 mt-4">
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = response;
                    link.download = 'practice_exam.pdf';
                    link.click();
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  ✂️ Share
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Body;
