import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["assets.co.dev", "images.unsplash.com"],
  },
  webpack: (config, context) => {
    config.optimization.minimize = process.env.NEXT_PUBLIC_CO_DEV_ENV !== "preview";
    
    // Ensure single React instance to prevent hooks errors
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    };
    
    // Fix HMR WebSocket connection in webcontainer environment
    if (context.dev && !context.isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add webSocketURL parameter to HMR client entries
        Object.keys(entries).forEach(key => {
          if (Array.isArray(entries[key])) {
            entries[key] = entries[key].map(entry => {
              if (typeof entry === 'string' && entry.includes('webpack-hot-middleware/client')) {
                return `${entry}&webSocketURL=auto://0.0.0.0:0/ws`;
              }
              return entry;
            });
          }
        });
        
        return entries;
      };
    }

    return config;
  },

  // ✅ Add this for polling in dev
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,           // Check for file changes every second
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
