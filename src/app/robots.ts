import type { MetadataRoute } from "next";

const SITE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin",
          "/actions",
          "/cart",
          "/checkout",
          "/wishlist",
          "/profile",
          "/login",
          "/register",
        ],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
