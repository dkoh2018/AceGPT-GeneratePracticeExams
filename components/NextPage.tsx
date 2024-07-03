import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loadingdots';
import { useState } from 'react';

const NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleGenerate = () => {
    // Your logic to handle the generation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResponse('Generated Content');
    }, 2000); // Simulate a network request
  };

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Next Page</h1>
          <Button
            type="button"
            disabled={isLoading}
            className="inline-flex justify-center max-w-[200px] mx-auto w-full"
            onClick={handleGenerate}
          >
            {isLoading ? (
              <LoadingDots color="white" />
            ) : response ? (
              '✨ Regenerate'
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
