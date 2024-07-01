'use client';

import NavLink from './NavLink';

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-gray-600">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
            Create Your Custom Practice Tests Instantly
          </h1>
          <p className="max-w-xl mx-auto">
            AceGPT allows you to input study guides, upload files, or create
            questions yourself. Manage difficulty levels and get detailed
            solutions to ace your exams.
          </p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
            >
              Create Your Test
            </NavLink>
            <NavLink
              target="_blank"
              href="https://github.com/dkoh2018/testmakergpt1.0"
              className="text-gray-700 border hover:bg-gray-50"
              scroll={false}
            >
              Learn more
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
