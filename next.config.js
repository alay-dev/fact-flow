/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "" },
      {
        protocol: "https",
        hostname: "scontent.fccu5-1.fna.fbcdn.net",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
