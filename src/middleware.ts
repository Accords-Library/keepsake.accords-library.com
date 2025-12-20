import { defineMiddleware } from "astro:middleware";

/**
 * Read the search params for the referrer param
 * Then store it in a cookie with a 7 days expiration
 * Then redirect the user to the home page without the referrer param
 */
export const onRequest = defineMiddleware((context, next) => {
  const referrer = context.url.searchParams.get("referrer");
  if (referrer) {
    context.cookies.set("referrer", referrer, {
      maxAge: 60 * 60 * 24 * 365,
    });
    return context.redirect(context.url.pathname);
  }
  return next();
});
