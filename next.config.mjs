/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      /* Pinterest */
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" },

      /* Google avatars */
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },

      /* Amazon CDN */
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },

      /* Unsplash */
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },

      /* Cloudinary */
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },

      /* Miray WordPress */
      { protocol: "https", hostname: "mirayfashions.com", pathname: "/**" },
      { protocol: "https", hostname: "mirayfashions.in", pathname: "/**" },

      /* Gravatar */
      { protocol: "https", hostname: "secure.gravatar.com", pathname: "/**" },

      /* WordPress CDN */
      { protocol: "https", hostname: "i0.wp.com", pathname: "/**" },
      { protocol: "https", hostname: "i1.wp.com", pathname: "/**" },
      { protocol: "https", hostname: "i2.wp.com", pathname: "/**" },

      /* KW CDN */
      { protocol: "https", hostname: "img.kwcdn.com", pathname: "/**" },

      /* LT Webstatic */
      { protocol: "https", hostname: "img.ltwebstatic.com", pathname: "/**" },

      /* Shop Cider */
      { protocol: "https", hostname: "img1.shopcider.com", pathname: "/**" },

      /* Princess Polly */
      { protocol: "https", hostname: "us.princesspolly.com", pathname: "/**" },

      /* Cloudfront */
      { protocol: "https", hostname: "d1flfk77wl2xk4.cloudfront.net", pathname: "/**" },

      /* StreetStyleStore */
      { protocol: "https", hostname: "cdn.streetstylestore.com", pathname: "/**" },
      { protocol: "https", hostname: "images.streetstylestore.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;