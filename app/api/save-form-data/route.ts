import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { jsPDF } from 'jspdf';

export async function POST(request: Request) {
  const data = await request.formData();
  const apiKey = process.env.OPENAI_API_KEY as string;
  const model = data.get('model') as string;
  const prompt = data.get('prompt') as string;
  const file = data.get('file') as File;
  const difficulty = parseInt(data.get('difficulty') as string);
  const additionalInstructions = data.get('additionalInstructions') as string;

  let fileContent = '';
  if (file) {
    fileContent = await file.text();
  }

  try {
    const generatedContent = await generateContent(
      apiKey,
      model,
      prompt,
      fileContent,
      difficulty,
      additionalInstructions,
    );
    const latexContent = await formatToLaTeX(generatedContent);

    // Save the LaTeX content somewhere (e.g., database, file system)
    // For demonstration, we'll just return it in the response
    return NextResponse.json({ latexContent });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      {
        error:
          'Failed to generate content. Please check the API key and try again.',
      },
      { status: 500 },
    );
  }
}

async function generateContent(
  apiKey: string,
  model: string,
  prompt: string,
  fileContent: string,
  difficulty: number,
  additionalInstructions: string,
) {
  const openai = new OpenAI({ apiKey });

  const personalizedPrompt = `Create a test based on the following input:\n\nPrompt: ${prompt}\n\nFile Content: ${fileContent}\n\nDifficulty: ${difficulty}\n\nAssuming the default level is 5, which is medium difficulty, 1 for easier and 10 for harder questions. The user chose that difficulty. Make sure to include at least 8 questions, formatted in a college-level Northwestern test style. When making the question, make sure you get the topic and subject precisely of what they are asking and then start generating questions that are majorly related to that and minorly related to that subject. The goal is to make the person the best at the subject even if it can get challenging.\n\nAdditional Instructions: ${additionalInstructions}`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: personalizedPrompt }],
    max_tokens: 4000,
  });

  const generatedContent =
    completion.choices[0]?.message?.content || 'No content generated';
  return generatedContent;
}

async function formatToLaTeX(content: string) {
  const latexPrompt = `Without changing any of the questions itself, I want you to proofread and make sure everything is in the right order and also has the perfect formatting in a LaTeX format. Give everything in a LaTeX format generated content. Please do NOT include the answers. They will need to solve it themselves.\n\nContent: ${content}`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: latexPrompt }],
    max_tokens: 4000,
  });

  const latexContent =
    completion.choices[0]?.message?.content || 'No LaTeX content generated';
  return latexContent;
}
