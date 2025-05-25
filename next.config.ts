/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/weight-tracker'
  }
};

export default nextConfig;
