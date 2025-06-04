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

  const systemPrompt = `You are an AI assistant that generates practice exams with a highly professional and academic aesthetic, similar to an examination from a top university.
Output the exam as a single, well-structured HTML document.
The entire output should be ONLY the HTML content, starting with <article class="exam-document"> and ending with </article>. Do not include any explanatory text before or after the HTML.

**Overall Style Guidelines:**
*   **Typography:**
    *   Main Body Text: Use a clean, readable sans-serif font (e.g., 'Helvetica Neue', Arial, sans-serif) at around 12pt. Line height should be at least 1.6.
    *   Headings (University, Department, Exam Title): Use a classic serif font (e.g., 'Times New Roman', 'Georgia', serif) for a formal look.
    *   Section Headings: Can be sans-serif, bold, around 14pt-16pt.
*   **Spacing:** CRITICAL: Use generous and ample spacing throughout the document for maximum legibility. This includes margins around the main article, padding within sections, significant vertical space between questions (e.g., 40-50px margin-bottom for question-block), and between question components (header, text, answer space).
*   **Layout:** Maintain a clean, single-column layout suitable for printing and on-screen reading.
*   **Color:** Primarily black text on a white background. Use subtle grays for borders or less important elements if needed. Avoid distracting colors.
*   **Code Blocks:**
    *   For code snippets (e.g., Python, JavaScript, Bash commands), use <pre><code class="language-LANG">...</code></pre> tags. Replace LANG with the specific language (e.g., language-python, language-javascript, language-bash). If the language is generic or mixed, use class="code-block".
    *   Style code blocks with a monospaced font (e.g., 'Courier New', monospace), a light gray background (e.g., #f4f4f4), padding (e.g., 10px), and rounded corners. Ensure text within <pre><code> respects whitespace and line breaks.

**HTML Structure and Styling (Use these classes and inline styles as a strong guideline):**

<article class="exam-document" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #222; background-color: #fff; max-width: 850px; margin: 30px auto; padding: 50px; border: 1px solid #c0c0c0; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
  <header class="exam-header" style="text-align: center; margin-bottom: 50px; border-bottom: 2px solid #000; padding-bottom: 25px;">
    <h1 style="font-family: 'Times New Roman', Georgia, serif; font-size: 28px; margin-bottom: 10px; color: #000;">AceGPT University</h1>
    <h2 style="font-family: 'Times New Roman', Georgia, serif; font-size: 24px; margin-bottom: 10px; color: #111;">Department of [Subject]</h2>
    <h3 style="font-family: 'Times New Roman', Georgia, serif; font-size: 22px; color: #222;">Practice Exam</h3>
  </header>

  <section class="instructions-panel" style="margin-bottom: 40px; padding: 20px; background-color: #f7f7f7; border: 1px solid #d8d8d8; border-radius: 5px;">
    <h4 class="section-title" style="font-size: 15pt; font-weight: bold; margin-top: 0; margin-bottom: 18px; color: #111;">Instructions:</h4>
    <ul style="list-style-type: decimal; padding-left: 30px; margin-top: 0;">
      <li style="margin-bottom: 10px;">Duration: 90 minutes</li>
      <li style="margin-bottom: 10px;">Answer all questions clearly and concisely. Illegible answers may not be graded.</li>
      <li style="margin-bottom: 10px;">Show all workings for questions involving calculations in the space provided.</li>
      <li style="margin-bottom: 10px;">Write all answers in the designated answer spaces.</li>
      <li style="margin-bottom: 10px;">No electronic devices (calculators, phones, smartwatches) are permitted unless explicitly stated for a specific question.</li>
    </ul>
  </section>

  <section class="student-info-box" style="margin-bottom: 50px; padding: 25px; border: 1px solid #c8c8c8; background-color: #fafafa; border-radius: 4px;">
    <div style="margin-bottom: 15px; font-size: 13pt;"><strong>Student Name:</strong> <span style="display: inline-block; width: 65%; border-bottom: 1.5px solid #444; height: 24px; vertical-align: bottom;"></span></div>
    <div style="font-size: 13pt;"><strong>Student ID:</strong> <span style="display: inline-block; width: 65%; border-bottom: 1.5px solid #444; height: 24px; vertical-align: bottom;"></span></div>
  </section>

  <!-- Example of a Question Section -->
  <section class="exam-content-section" style="margin-bottom: 40px;">
    <h4 class="section-title" style="font-size: 17pt; font-weight: bold; margin-top: 40px; margin-bottom: 25px; border-bottom: 1.5px solid #bbb; padding-bottom: 12px;">Section A: Short Answer and Calculation</h4>
    
    <div class="question-block" style="margin-bottom: 50px; padding-left: 10px;">
      <div class="question-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <p class="question-number" style="font-weight: bold; font-size: 13pt;">Question 1</p>
        <p class="question-points" style="font-style: italic; font-size: 11pt; color: #444;">(15 points)</p>
      </div>
      <div class="question-text" style="font-size: 12pt; margin-bottom: 20px; line-height: 1.7;">
        Describe the primary differences between intrinsic and extrinsic semiconductor materials. How do these differences impact their electrical conductivity?
      </div>
      <div class="answer-space" style="min-height: 150px; border: 1px solid #c8c8c8; margin-top: 15px; padding: 12px; background-color: #fdfdfd; border-radius: 4px;"></div>
    </div>

    <div class="question-block" style="margin-bottom: 50px; padding-left: 10px;">
      <div class="question-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <p class="question-number" style="font-weight: bold; font-size: 13pt;">Question 2</p>
        <p class="question-points" style="font-style: italic; font-size: 11pt; color: #444;">(10 points)</p>
      </div>
      <div class="question-text" style="font-size: 12pt; margin-bottom: 20px; line-height: 1.7;">
        Solve the integral: <span class="mathjax-latex">\\(\\int_{0}^{\\pi} \\sin(x) \\cos(x) \\, dx\\)</span>
      </div>
      <div class="answer-space" style="min-height: 120px; border: 1px solid #c8c8c8; margin-top: 15px; padding: 12px; background-color: #fdfdfd; border-radius: 4px;"></div>
    </div>

    <div class="question-block" style="margin-bottom: 50px; padding-left: 10px;">
      <div class="question-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <p class="question-number" style="font-weight: bold; font-size: 13pt;">Question 3</p>
        <p class="question-points" style="font-style: italic; font-size: 11pt; color: #444;">(10 points)</p>
      </div>
      <div class="question-text" style="font-size: 12pt; margin-bottom: 15px; line-height: 1.7;">
        Provide a short Python code snippet to reverse a string.
      </div>
      <pre><code class="language-python" style="display: block; padding: 12px; margin-top: 10px; margin-bottom: 10px; background-color: #f4f4f4; border: 1px solid #ddd; border-radius: 4px; font-family: 'Courier New', monospace; white-space: pre-wrap; word-wrap: break-word;">def reverse_string(s):
    return s[::-1]</code></pre>
      <div class="answer-space" style="min-height: 80px; border: 1px solid #c8c8c8; margin-top: 15px; padding: 12px; background-color: #fdfdfd; border-radius: 4px;"></div>
    </div>
  </section>

  <section class="exam-content-section" style="margin-bottom: 40px;">
    <h4 class="section-title" style="font-size: 17pt; font-weight: bold; margin-top: 40px; margin-bottom: 25px; border-bottom: 1.5px solid #bbb; padding-bottom: 12px;">Section B: Multiple Choice</h4>
    <div class="question-block" style="margin-bottom: 50px; padding-left: 10px;">
      <div class="question-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <p class="question-number" style="font-weight: bold; font-size: 13pt;">Question 4</p>
        <p class="question-points" style="font-style: italic; font-size: 11pt; color: #444;">(10 points)</p>
      </div>
      <div class="question-text" style="font-size: 12pt; margin-bottom: 15px; line-height: 1.7;">
        Which of the following compounds has the highest boiling point?
      </div>
      <ol type="a" class="multiple-choice-options" style="padding-left: 45px; margin-top: 10px; list-style-position: outside; font-size: 12pt;">
        <li style="margin-bottom: 10px;">Methane</li>
        <li style="margin-bottom: 10px;">Ethanol</li>
        <li style="margin-bottom: 10px;">Carbon dioxide</li>
        <li style="margin-bottom: 10px;">Water</li>
      </ol>
      <div class="answer-space" style="min-height: 60px; border: 1px solid #c8c8c8; margin-top: 15px; padding: 12px; background-color: #fdfdfd; border-radius: 4px;"></div>
    </div>
  </section>
  
  <footer class="exam-footer" style="text-align: center; margin-top: 60px; padding-top: 25px; border-top: 2px solid #000;">
    <p style="font-weight: bold; font-size: 13pt;">TOTAL POINTS: 100</p>
    <p style="font-style: italic; font-size: 12pt; margin-top: 12px;">End of Examination</p>
    <p style="font-size: 10pt; color: #666; margin-top: 18px;">Please ensure all answers are clearly marked and legible.</p>
  </footer>
</article>

For mathematical formulas, use inline LaTeX wrapped in a span with class "mathjax-latex", like this: <span class="mathjax-latex">\\( E=mc^2 \\)</span>.
For display math (equations on their own line), use a div with class "mathjax-latex", like this: <div class="mathjax-latex"> \\[ \\int x dx = \\frac{x^2}{2} + C \\] </div>.
This will allow KaTeX to render them on the client side.

Ensure the HTML is self-contained and well-formed. Use the provided inline CSS for styling to ensure it's bundled with the HTML.
The user will provide a topic and difficulty. Generate at least 12 questions appropriate for a college-level exam on that topic and difficulty.
Fill in the [Subject] placeholder with the appropriate subject based on the user's prompt.
Do NOT include the triple backticks (\`\`\`) or any other markdown formatting around the HTML output.
`;

  const personalizedPrompt = `Create a test based on the following input:\n\nPrompt: ${prompt}\n\nFile Content: ${fileContent}\n\nDifficulty: ${difficulty}\n\nAssuming the default level is 5, which is medium difficulty (or average knowledge), 1 for easiest and 10 for hardest questions. The user chose that difficulty. Make sure to include minimum 12 questions, formatted in a college-level Northwestern test style. When making the question, make sure you get the topic and subject precisely of what they are asking and then start generating questions that are related to that subject. Use online sources or previous online official tests to get better questions. The goal is to make the person the best at the subject even if it can get challenging.`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content:
          personalizedPrompt +
          '. again, do not have ``` ``` code blocks in the output. thanks.',
      },
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
