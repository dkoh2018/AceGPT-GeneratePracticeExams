import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request: Request) {
  const data = await request.formData();
  const apiKey = process.env.OPENAI_API_KEY as string;
  const model = data.get('model') as string;
  const prompt = data.get('prompt') as string;
  const file = data.get('file') as File;
  const difficulty = parseInt(data.get('difficulty') as string);
  // const additionalInstructions = data.get('additionalInstructions') as string;

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
      // additionalInstructions,
    );

    return NextResponse.json({ generatedContent });
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
  // additionalInstructions: string,
) {
  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Here is an example of how a test should look like with the correct formats as detailed with the triple back tick but make sure to not include the backticks in the output. I want you to make sure when giving the test, you only give the test output. Note that this is just an example test. Do NOT copy and give the same questions that i wrote in the example as they are just examples. If the user inputs problems that makes no sense, I want you to try your best to get the idea of the subject and ask questions related to it. No need to say anything in the beginning and end. Only the contents of the test and end prompt. Also please fill in the correct Subject for Department of [Subject]. \`\`\`
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{array}

\\begin{document}

\\begin{center}
\\textbf{AceGPT University} \\\\
\\textbf{Department of [Subject]} \\\\
\\textbf{Practice Exam} \\\\
\\end{center}

\\vspace{0.5cm}

\\textbf{Instructions:}
\\begin{itemize}
    \\item Duration: 90 minutes
    \\item Answer all questions clearly and concisely.
    \\item Show all workings for questions involving calculations.
    \\item Write all answers in the space provided.
    \\item No electronic devices are allowed.
\\end{itemize}

\\vspace{0.5cm}

\\begin{tabbing}
\\hspace{3cm}\\=\\hspace{7cm}\\kill
\\textbf{Student Name:} \\> \\underline{\\hspace{5cm}} \\\\
\\textbf{Student ID:} \\> \\underline{\\hspace{5cm}}
\\end{tabbing}

\\vspace{0.5cm}

\\section*{Section A: Short Answer and Calculation}

\\textbf{1. (15 points)} Describe the primary differences between intrinsic and extrinsic semiconductor materials. How do these differences impact their electrical conductivity?

\\vspace{4cm}

\\textbf{2. (15 points)} A protein folds spontaneously at room temperature. Using the concept of Gibbs free energy, explain why this folding occurs, considering both enthalpy and entropy changes.

\\vspace{4cm}

\\textbf{3. (10 points)} Solve the integral: \\(\\int_{0}^{\\pi} \\sin(x) \\cos(x) \\, dx\\).

\\vspace{4cm}

\\section*{Section B: Multiple Choice}

\\textbf{4. (10 points)} Which of the following compounds has the highest boiling point? \\\\
    a) Methane \\\\
    b) Ethanol \\\\
    c) Carbon dioxide \\\\
    d) Water

\\vspace{1cm}

\\textbf{5. (10 points)} In the context of financial economics, which of the following statements is true about the efficient market hypothesis? \\\\
    a) All investors have equal access to information and act rationally. \\\\
    b) Stock prices always reflect all available information. \\\\
    c) Markets can be beaten with advanced, proprietary algorithms. \\\\
    d) Insider information can predict market movements.

\\vspace{1cm}

\\section*{Section C: Essay}

\\textbf{6. (20 points)} Discuss the role of Photosystem II in the light-dependent reactions of photosynthesis. How does the process of photolysis contribute to the production of oxygen and ATP?

\\vspace{6cm}

\\section*{Section D: Data Analysis}

\\textbf{7. (10 points)} You are given the following data points for temperature (°C) vs. solubility (g/L) of a solute: 

\\begin{center}
\\begin{tabular}{|c|c|}
\\hline
Temperature (°C) & Solubility (g/L) \\\\
\\hline
20 & 50 \\\\
\\hline
30 & 55 \\\\
\\hline
40 & 60 \\\\
\\hline
50 & 70 \\\\
\\hline
\\end{tabular}
\\end{center}

Using the data provided, plot the solubility vs. temperature on a graph. From the graph, estimate the solubility at 45°C.

\\vspace{6cm}

\\section*{Section E: Proof and Reasoning}

\\textbf{8. (10 points)} Prove that the sequence defined by \\(a_n = \\frac{1}{n}\\) converges to 0 as \\(n \\to \\infty\\).

\\vspace{4cm}

\\begin{center}
\\textbf{TOTAL: 100 points}
\\end{center}

\\begin{center}
\\textbf{End of Exam}
\\end{center}

Please check your answers before submitting. Good luck!

\\end{document}

\`\`\``;

  const personalizedPrompt = `Create a test based on the following input:\n\nPrompt: ${prompt}\n\nFile Content: ${fileContent}\n\nDifficulty: ${difficulty}\n\nAssuming the default level is 5, which is medium difficulty (or average knowledge), 1 for easiest and 10 for hardest questions. The user chose that difficulty. Make sure to include minimum 12 questions, formatted in a college-level Northwestern test style. When making the question, make sure you get the topic and subject precisely of what they are asking and then start generating questions that are related to that subject. Use online sources or previous online official tests to get better questions. The goal is to make the person the best at the subject even if it can get challenging.`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: personalizedPrompt },
    ],
    max_tokens: 4000,
  });

  const generatedContent =
    completion.choices[0]?.message?.content || 'No content generated';
  return generatedContent;
}

// import { NextResponse } from 'next/server';
// import { OpenAI } from 'openai';

// export async function POST(request: Request) {
//   const data = await request.formData();
//   const apiKey = process.env.OPENAI_API_KEY as string;
//   const model = data.get('model') as string;
//   const prompt = data.get('prompt') as string;
//   const file = data.get('file') as File;
//   const difficulty = parseInt(data.get('difficulty') as string);
//   const additionalInstructions = data.get('additionalInstructions') as string;

//   let fileContent = '';
//   if (file) {
//     fileContent = await file.text();
//   }

//   try {
//     const generatedContent = await generateContent(
//       apiKey,
//       model,
//       prompt,
//       fileContent,
//       difficulty,
//       additionalInstructions,
//     );
//     const latexContent = await formatToLaTeX(generatedContent);

//     // Save the LaTeX content somewhere (e.g., database, file system)
//     // For demonstration, we'll just return it in the response
//     return NextResponse.json({ latexContent });
//   } catch (error) {
//     console.error('Error generating content:', error);
//     return NextResponse.json(
//       {
//         error:
//           'Failed to generate content. Please check the API key and try again.',
//       },
//       { status: 500 },
//     );
//   }
// }

// async function generateContent(
//   apiKey: string,
//   model: string,
//   prompt: string,
//   fileContent: string,
//   difficulty: number,
//   additionalInstructions: string,
// ) {
//   const openai = new OpenAI({ apiKey });

//   const personalizedPrompt = `Create a test based on the following input:\n\nPrompt: ${prompt}\n\nFile Content: ${fileContent}\n\nDifficulty: ${difficulty}\n\nAssuming the default level is 5, which is medium difficulty, 1 for easier and 10 for harder questions. The user chose that difficulty. Make sure to include at least 8 questions, formatted in a college-level Northwestern test style. When making the question, make sure you get the topic and subject precisely of what they are asking and then start generating questions that are majorly related to that and minorly related to that subject. The goal is to make the person the best at the subject even if it can get challenging.\n\nAdditional Instructions: ${additionalInstructions}`;

//   const completion = await openai.chat.completions.create({
//     model,
//     messages: [{ role: 'user', content: personalizedPrompt }],
//     max_tokens: 4000,
//   });

//   const generatedContent =
//     completion.choices[0]?.message?.content || 'No content generated';
//   return generatedContent;
// }

// async function formatToLaTeX(content: string) {
//   const latexPrompt = `Without changing any of the questions itself, I want you to proofread and make sure everything is in the right order and also has the perfect formatting in a LaTeX format. Give everything in a LaTeX format generated content. Please do NOT include the answers. They will need to solve it themselves.\n\nContent: ${content}`;

//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   const completion = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: latexPrompt }],
//     max_tokens: 4000,
//   });

//   const latexContent =
//     completion.choices[0]?.message?.content || 'No LaTeX content generated';
//   return latexContent;
// }
