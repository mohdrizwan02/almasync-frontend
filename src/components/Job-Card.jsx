import React from "react";

const JobCard = () => {
  return (
    <>
      <div className="group relative overflow-hidden w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-md">
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center  text-white text-xl font-semibold shrink-0">
              K
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Kokonut Labs
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin w-3.5 h-3.5 text-zinc-400"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Senior Frontend Developer
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-briefcase w-4 h-4 text-zinc-400"
                >
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                </svg>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Full-time
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-dollar-sign w-4 h-4 text-zinc-400"
                >
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  $120k - $160k
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  5+ years React experience
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  TypeScript expertise
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  UI/UX knowledge
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800  flex items-center justify-between mt-2">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 flex flex-col gap-1">
            <div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                78
              </span>
              <span className="font-medium text-zinc-500 dark:text-zinc-400">
                {" "}
                applicants
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">
                Posted 2 days ago
              </span>
            </div>
          </div>
          <button
            type="button"
            className="group/btn relative flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-9 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            <span className="flex items-center gap-2">
              Apply Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right h-4 w-4 transition-transform  group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              >
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default JobCard;
