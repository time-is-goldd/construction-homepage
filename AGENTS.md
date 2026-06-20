<!-- BEGIN:nextjs-agent-rules -->
# Next.js version note

This project was downgraded from an experimental/pre-release Next.js build (16.2.9, which used non-standard conventions like `proxy.ts` instead of `middleware.ts`) to the stable release `next@15.5.19`, because Vercel's production deployment infrastructure could not correctly serve routes built with the experimental version (build succeeded, but every route 404'd at request time — 0 function invocations despite incoming edge requests). Standard Next.js conventions apply now (`middleware.ts`, no `--webpack` CLI flag needed since webpack is the 15.x default). If upgrading Next.js again in the future, redeploy to a Vercel preview first and confirm routes actually serve (not just that the build succeeds) before promoting to production.
<!-- END:nextjs-agent-rules -->
