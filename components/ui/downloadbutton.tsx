import React from 'react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  response: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ response }) => {
  const handleDownload = async () => {
    const fileName = 'practice_exam.tex';
    const result = await fetch('/api/save-latex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: response,
        fileName: fileName,
      }),
    });

    if (result.ok) {
      const data = await result.json();
      const link = document.createElement('a');
      link.href = data.filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Failed to save file');
    }
  };

  return <Button onClick={handleDownload}>Download LaTeX</Button>;
};

export default DownloadButton;
