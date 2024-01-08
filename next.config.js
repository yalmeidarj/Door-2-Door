/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverComponentsExternalPackages: ["puppeteer-core"],
  // },
  // output: {
  //   filename: "my-first-webpack.bundle.js",
  // },
  // module: {
  //   rules: [{ test: /\.txt$/, use: "raw-loader" }],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // externals: ["chrome-aws-lambda"],
};

module.exports = nextConfig
