/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MY_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        DATABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
};

module.exports = nextConfig;
