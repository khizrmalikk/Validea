"use client";
import { scrapeAndStoreSubredditPosts } from "@/lib/actions";
import { scrapeSubreddit } from "@/lib/scraper";
import { Search } from "lucide-react";
import React, { FormEvent, useState } from "react";

const isValidURL = (url: string) => {
  try {
    // const parsedURL = new URL(url);
    // const hostname = parsedURL.hostname;
    // if (url.includes("r/")) {
    //   return true;
    // }
    return true;
  } catch (e) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidURL(searchPrompt);
    if (!isValidLink) return alert("Invalid URL");

    try {
      setIsLoading(true);

      //Scrape the product page
      const response = await scrapeAndStoreSubredditPosts(searchPrompt);

    } catch (error) {
        console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex space-x-2" onSubmit={handleSubmit}>
      <input
        className="flex-1 input input-bordered w-full max-w-xs"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="r/validea.."
        type="text"
      />
      <button type="submit" className="btn" disabled={searchPrompt === ""}>
        <Search className="h-4 w-4 mr-2" />
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
