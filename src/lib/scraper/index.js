const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
import logger from './logger'; // Assuming logger is used in your project
puppeteer.use(StealthPlugin());

export async function scrapeSubreddit(subreddit) {
  const url = `https://old.reddit.com/r/microsaas/new/`;

  const BROWSER_WS = process.env.CONNECTION_URL;

  const posts = [];

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  const addPageInterceptors = async (page) => {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (
        resourceType === 'image' ||
        resourceType === 'font' ||
        resourceType === 'stylesheet' ||
        resourceType === 'script' ||
        resourceType === 'media'
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
  };

  const getAttributes = async (element) => {
    return element.evaluate((el) => {
      const attributeMap = {};
      for (const attr of Array.from(el.attributes)) {
        attributeMap[attr.name] = attr.value;
      }
      return attributeMap;
    });
  };

  const newBrowser = async () => {
    if (BROWSER_WS) {
      return puppeteer.connect({ browserWSEndpoint: BROWSER_WS, headless: false });
    }
    return puppeteer.launch();
  };

  const getPostsOnPage = async (page) => {
    logger.info('Getting posts for page');
    // await page.waitForSelector('.thing', { timeout: 10000 });

    const elementname = ".thing";
    await page.waitForSelector(elementname, { timeout: 10000 });
    const elements = await page.$$(elementname);
    logger.info(`Found ${elements.length} posts`);

    const pagePosts = [];

    for (const element of elements) {
      const attributes = await getAttributes(element);
      const id = attributes['data-fullname'];
      const subreddit = attributes['data-subreddit-prefixed'];
      const time = attributes['data-timestamp'];
      const timestamp = parseInt(time);
      const dt = new Date(timestamp);
      const author = attributes['data-author'];
      const url = `https://old.reddit.com${attributes['data-permalink']}`;

      const post = { id, subreddit, dt, timestamp, author, url };
      pagePosts.push(post);
    }

    return pagePosts;
  };

  try {
    // Launch Puppeteer browser
    logger.info('Launching browser...');
    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSER_WS,
      headless: false,
    });

    // Create browser page
    logger.info('Connecting...');
    const page = await browser.newPage();
    await page.setViewport({ width: Math.floor(1024 + Math.random() * 100), height: Math.floor(768 + Math.random() * 100) });
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';//'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
    await page.setUserAgent(userAgent);
    await addPageInterceptors(page);
    

    // Navigate to subreddit
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 1200000 });
    await page.mouse.move(100, 100);
    await delay(Math.floor(Math.random() * 4000) + 2000); // Random delay between 2-6 seconds
    await page.keyboard.press('ArrowDown'); 
    logger.info('Connected!');

    // Get the HTML content before waiting for '.thing'
    const pageContent = await page.content();
    console.log('Page content loaded:', pageContent);

    await delay(Math.floor(Math.random() * 4000) + 2000); // Random delay between 2-6 seconds

    logger.info('Waiting for posts to load...');
    // await page.waitForFunction('document.querySelector(".thing") !== null', { timeout: 60000 });
    await page.waitForSelector('.thing', { timeout: 30000 });

    const elements = await page.$$('.thing');
    logger.info(`Found ${elements.length} posts`);

    for (const element of elements) {
      const id = await element.evaluate((el) => el.getAttribute('data-fullname'));
      const subreddit = await element.evaluate((el) => el.getAttribute('data-subreddit-prefixed'));
      const timestamp = await element.evaluate((el) => el.getAttribute('data-timestamp'));
      const dt = new Date(parseInt(timestamp || '0'));
      const author = await element.evaluate((el) => el.getAttribute('data-author'));
      const postUrl = await element.evaluate((el) => `https://old.reddit.com${el.getAttribute('data-permalink')}`);

      const post = {
        id: id || '',
        subreddit: subreddit || '',
        dt,
        timestamp: parseInt(timestamp || '0'),
        author: author || '',
        url: postUrl || ''
      };
      posts.push(post);
    }

    // const hour = 1000 * 60 * 60;
    // const cutoff = Date.now() - 24 * hour; // 24-hour cutoff
    // let earliest = new Date();

    // Loop to collect posts from multiple pages
    // while (posts.length < 50 ) {
    //   let pagePosts = await getPostsOnPage(page);
    //   if (pagePosts.length === 0) break;

    //   posts.push(...pagePosts);
    //   // earliest = new Date(posts[posts.length - 1].timestamp);

    //   if (posts.length >= 50) {
    //     logger.info('Reached 50 posts, stopping');
    //     break;
    //   }

    //   // Navigate to the next page
    //   const nextPageURL = await page.$eval('.next-button a', (el) => el.href);
    //   if (nextPageURL) {
    //     await page.goto(nextPageURL, { waitUntil: 'networkidle0' });
    //   } else {
    //     logger.info('No more pages to navigate.');
    //     break;
    //   }
    // }

    logger.info(`Collected ${posts.length} posts: ${posts}`);
    await browser.close();

    return posts;
  } catch (error) {
    logger.error(`Error scraping subreddit: ${error}`);
    return [];
  }
}
