/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.afm$/i,
      type: 'asset/source',
    });

    config.externals = config.externals || [];
    config.externals.push({ pdfkit: 'commonjs pdfkit' });
    config.externals.push({ fontkit: 'commonjs fontkit' });
    config.externals.push({ restructure: 'commonjs restructure' });

    return config;
  },
};

module.exports = nextConfig;
