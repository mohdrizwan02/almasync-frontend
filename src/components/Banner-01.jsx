import React from "react";

const Banner1 = () => {
  return (
    <>
      <div className="max-w-xl bg-white/90 dark:bg-black/90 ring-1 ring-gray-200/50 dark:ring-white/5 backdrop-blur-sm z-50 rounded-xl p-1 opacity-100 transform:none">
        <div className="mx-auto max-w-7xl">
          <div className="p-6">
            <div className="relative flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  We use cookies to enhance your browsing experience and analyze
                  site traffic. By accepting, you agree to our use of cookies.
                  See our{" "}
                  <a
                    href="/privacy-policy"
                    className="font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-2 py-1.5  border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md text-sm font-semibold transition-all duration-200 text-gray-700 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  aria-label="Reject all cookies"
                >
                  Reject All
                </button>
                <button
                  className="px-2 py-1.5  bg-gray-900 hover:bg-gray-800  dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900  rounded-md text-sm font-semibold transition-all duration-200 shadow-sm  hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  aria-label="Accept all cookies"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner1;
