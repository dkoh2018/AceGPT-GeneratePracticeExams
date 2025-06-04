'use client';

import React, { useEffect } from 'react'; // Add this import
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
} from '@/app/components/ui/form';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Slider, Box, MenuItem, Select } from '@mui/material';
import { useCallback, useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/app/components/ui/alert';
import LoadingDots from '@/app/components/ui/loadingdots';
import { toast, Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas'; // No longer directly used, jsPDF.html() uses it internally
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // Or your preferred theme

const generateFormSchema = z.object({
  apiKey: z.string().min(3),
  model: z.string().min(3),
  prompt: z.string().min(3).max(4000),
  difficulty: z.number().min(1).max(10).default(5),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const models = [
  // Reasoning Models (Reordered)
  { value: 'o3', label: 'o3 (Advanced reasoning)' },
  { value: 'o3-mini', label: 'o3 Mini (Smaller, faster o3)' },
  { value: 'o4-mini-high', label: 'o4 Mini High (Higher accuracy, faster o4-mini)' },
  { value: 'o4-mini', label: 'o4 Mini (Successor to o3-mini)' },

  // GPT-4.1 Series (Reordered)
  { value: 'gpt-4-1106-preview', label: 'GPT-4.1 (128k, Text-only)' },
  
  // GPT-4o Series (Reordered)
  { value: 'gpt-4o', label: 'GPT-4o (Multimodal, 128k context)' },

  // GPT-4.1 Mini (Reordered)
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (Smaller, cost-effective)' },

  // GPT-4o Mini (Reordered)
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Smaller, cost-efficient)' },
];

const marks = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

const Body = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const examPreviewRef = useRef<HTMLDivElement>(null);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: 'onChange',
    defaultValues: {
      apiKey: '',
      model: 'gpt-4o',
      prompt: '',
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

      const response = await fetch('/api/save-form-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save form data');
      }

      const responseData = await response.json();
      const generatedContent = responseData.generatedContent;

      setResponse(generatedContent);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (response && examPreviewRef.current) {
      // Render KaTeX
      const mathElements = examPreviewRef.current.querySelectorAll('.mathjax-latex');
      mathElements.forEach((element) => {
        const el = element as HTMLElement;
        try {
          katex.render(el.innerText || '', el, {
            throwOnError: false,
            displayMode: el.tagName === 'DIV',
          });
        } catch (e) {
          console.error('KaTeX rendering error:', e, 'on element:', el.innerText);
          el.innerHTML = `<span style="color: red;">KaTeX Error: ${e instanceof Error ? e.message : String(e)}</span>`;
        }
      });

      // Apply syntax highlighting
      const codeElements = examPreviewRef.current.querySelectorAll('pre code');
      codeElements.forEach((element) => {
        hljs.highlightElement(element as HTMLElement);
      });
    }
  }, [response]);

  const handleGeneratePdf = async () => {
    if (!examPreviewRef.current) {
      toast.error('Exam content not available for PDF generation.');
      return;
    }

    toast.loading('Generating PDF...', { id: 'pdf-toast' });

    try {
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'pt', // points
        format: 'a4', // A4 format
      });

      // It's important that the element passed to pdf.html() is visible and fully rendered.
      // Ensure KaTeX (or other dynamic rendering) has completed.
      // The quality of CSS support can vary. Inline styles and simple CSS are generally better.
      await pdf.html(examPreviewRef.current, {
        callback: function (doc) {
          doc.save('practice_exam.pdf');
          toast.success('PDF downloaded!', { id: 'pdf-toast' });
        },
        x: 15, // margin
        y: 15, // margin
        width: 565, // A4 width in points (595) - 2*margin (15*2=30)
        windowWidth: examPreviewRef.current.scrollWidth, // Use the scrollWidth of the content
        html2canvas: {
          scale: 0.7, // Adjust scale to fit content; may need tweaking. Lower scale can help fit more.
          logging: true,
          useCORS: true,
          // It's often better to ensure your CSS is robust and doesn't rely on complex selectors
          // that html2canvas might struggle with.
        },
        // autoPaging: 'slice' is one option, 'text' is another. 'slice' can be more robust for layout.
        autoPaging: 'slice',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`, { id: 'pdf-toast' });
      // Ensure loading toast is dismissed on error if not handled by success
      toast.dismiss('pdf-toast');
    }
  };

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
              <div
                ref={examPreviewRef}
                className="exam-preview-area relative flex flex-col justify-start items-start gap-y-2 w-full border border-gray-300 rounded shadow group p-4 mx-auto bg-white max-w-full overflow-y-auto"
                style={{ height: 'auto', maxHeight: '600px' }} // Increased height
                dangerouslySetInnerHTML={{ __html: response }}
              />
              <div className="flex justify-center gap-5 mt-4">
                <Button
                  onClick={handleGeneratePdf}
                  disabled={isLoading || !response}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (response) {
                      navigator.clipboard.writeText(response);
                      toast.success('HTML content copied to clipboard');
                    }
                  }}
                  disabled={!response}
                >
                  ✂️ Copy HTML
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
