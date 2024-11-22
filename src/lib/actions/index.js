"use server"

import { scrapeSubreddit } from "../scraper";

export async function scrapeAndStoreSubredditPosts(subreddit) {
    if(!subreddit) return;

    try {
        const scrapedPosts = await scrapeSubreddit(subreddit);
    } catch (error) {
        throw new Error(`Error scraping subreddit: ${error}`);
    }
}