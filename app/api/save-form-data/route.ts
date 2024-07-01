// app/api/save-form-data/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

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

async function formatToLaTeX(apiKey: string, model: string, content: string) {
  const openai = new OpenAI({ apiKey });

  const formatPrompt = `Without changing any of the questions itself, I want you to proofread and make sure everything is in the right order and also has the perfect formatting in a LaTeX format. Give everything in a LaTeX format generated content. Please do NOT include the answers. They will need to solve it themselves.\n\nContent: ${content}`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: formatPrompt }],
    max_tokens: 4000,
  });

  const latexContent =
    completion.choices[0]?.message?.content || 'No LaTeX content generated';
  return latexContent;
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model, prompt, difficulty, additionalInstructions, file } =
      await request.json();

    let fileContent = '';
    if (file) {
      const fileBuffer = fs.readFileSync(file);
      fileContent = fileBuffer.toString();
    }

    // Generate initial content
    const content = await generateContent(
      apiKey,
      model,
      prompt,
      fileContent,
      difficulty,
      additionalInstructions,
    );

    // Format content to LaTeX
    const latexContent = await formatToLaTeX(apiKey, model, content);

    // Create directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'generatedTests');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Save LaTeX file
    const filePath = path.join(dirPath, 'test.tex');
    fs.writeFileSync(filePath, latexContent);

    // Create PDF from LaTeX content
    const doc = new jsPDF();
    doc.text(latexContent, 10, 10);
    const pdfData = doc.output('datauristring');

    return NextResponse.json({
      content,
      pdfData,
      filePath,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Failed to generate test' },
      { status: 500 },
    );
  }
}
