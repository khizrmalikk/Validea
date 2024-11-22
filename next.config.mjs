/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
        "mongoose",
        "puppeteer-extra",
        "puppeteer-extra-plugin-stealth",
        "puppeteer-extra-plugin-recaptcha",
        ],
        },
    images: {
        domains: ['localhost'],
    }
};

export default nextConfig;
