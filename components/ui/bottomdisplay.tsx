import React from 'react';

const BottomDisplay = ({ response }: { response: string | null }) => {
  if (!response) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 p-4 shadow-lg max-h-[200px] overflow-y-auto"
      style={{ zIndex: 50 }}
    >
      <pre className="whitespace-pre-wrap">{response}</pre>
    </div>
  );
};

export default BottomDisplay;
