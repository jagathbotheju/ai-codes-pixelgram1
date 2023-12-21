/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "utfs.io",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
