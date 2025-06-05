# AceGPT: Custom Practice Test Generator

Welcome to AceGPT, a powerful and intuitive tool designed to help you create personalized practice tests quickly and efficiently. Empower your exam preparation by generating tailored assessments from your study materials.

## About AceGPT

AceGPT was developed to streamline the exam preparation process. As a foundational project, it also served as an exploration into software architecture and the intricacies of application data flow, from user interface to backend processing. It allows users to leverage their own study guides, upload relevant files, or manually input questions to generate comprehensive practice exams. With features to control difficulty levels and access detailed solutions, AceGPT aims to be an indispensable companion for academic success.

## Key Features

*   **Flexible Input Methods:**
    *   Paste text directly from your study guides.
    *   Upload documents (e.g., PDFs, DOCX - specify supported formats if known).
    *   Manually create and input your own questions.
*   **Customizable Difficulty:** Tailor the difficulty of generated questions to match your learning curve.
*   **Detailed Solutions:** Receive comprehensive solutions and explanations for each question to deepen your understanding.
*   **Instant Test Generation:** Quickly produce practice tests with a few simple clicks.

## Getting Started

1.  **API Key Configuration:** Enter your OpenAI API key.
2.  **Model Selection:** Choose your preferred OpenAI model for test generation.
3.  **Content Input:** Provide your questions or study material through one of the supported input methods.
4.  **Generate:** Click the "Generate" button.

Your custom practice test will be ready, helping you to effectively prepare and ace your exams!

## Technology Stack

AceGPT is built using a modern technology stack to ensure a robust and user-friendly experience:

### Frontend

*   React
*   Next.js (also used for backend capabilities)
*   Radix UI
*   Zod (for schema validation)
*   React Hook Form
*   Material-UI
*   Lucide Icons
*   React Hot Toast (for notifications)
*   jsPDF (for PDF generation/export, if applicable)

### Backend & Core Logic

*   Next.js API Routes
*   OpenAI API Integration
*   Node.js (for server-side operations)
    *   `fs` (File System module)
    *   `path` (Path module)

## Contact

Created by David O. For inquiries, suggestions, or support, please feel free to reach out via email: `davidoh [at] gmail [dot] com`.
