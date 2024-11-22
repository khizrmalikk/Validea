import { Search } from "lucide-react";
import React from "react";
import Searchbar from "./components/Searchbar";

type Props = {};

const RedditBot = (props: Props) => {
  return (
    <div className="relative flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 sm:text-4xl md:text-5xl lg:text-6xl/none font-bold backdrop-blur-lg tracking-tighter">
        Reddit Scraper
        {/* <BotButton/> */}
      </h1>
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Search a specific subreddit and instantly receive a list of
                  pain points, proposals, common topics and track specific
                  conversations
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Searchbar />
              </div>
            </div>
          </div>
      </div>
  );
};

export default RedditBot;
