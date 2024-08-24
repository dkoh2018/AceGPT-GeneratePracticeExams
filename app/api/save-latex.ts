import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, fileName } = req.body;

    const filePath = path.join(
      process.cwd(),
      'public/generatedTests',
      fileName,
    );

    // Ensure the directory exists
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    } catch (err) {
      console.error('Failed to create directory:', err);
      return res.status(500).json({ error: 'Failed to create directory' });
    }

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Failed to save file:', err);
        return res.status(500).json({ error: 'Failed to save file' });
      }
      return res.status(200).json({ filePath: `/generatedTests/${fileName}` });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
