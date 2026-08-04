BLACKSTONE PAGES FINAL FIX

This patch is specifically for the Cloudflare PAGES project that serves your custom domain.

UPLOAD:
1. In the GitHub ROOT, upload the entire "functions" folder.
   It must become:
   functions/api/chat.js
   functions/api/rates.js

2. In GitHub's existing assets folder, replace:
   assets/site.js
   assets/site.css

3. Commit to main and wait for the Cloudflare Pages deployment.

IMPORTANT:
The Gemini secret must exist in the PAGES project settings, not only in the separate
workers.dev project. Use the name GEMINI_API_KEY.

This version restores the older bold yellow-and-black moving mortgage runner.
