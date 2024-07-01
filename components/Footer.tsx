import Image from 'next/image';

const Footer = () => (
  <footer>
    <div className="custom-screen pt-16">
      <div className="mt-10 py-10 border-t items-center justify-between flex">
        <p className="text-gray-600">
          Created by{' '}
          <a
            href="https://github.com/dkoh2018"
            className="hover:underline transition"
          >
            David Oh
          </a>
          .
        </p>
        <div className="flex items-center gap-x-6 text-gray-400">
          <a
            className="border border-slate-200 rounded-md px-5 py-1 tracking-tight flex gap-1 hover:scale-105 transition"
            href="https://nextjs.org/"
            target="_blank"
          >
            <span className="text-gray-500">Built with</span>
            <Image src="/next.svg" alt="Next.js Logo" width={50} height={25} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
