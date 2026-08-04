BLACKSTONE AI 405 + RATE TICKER FIX

Replace exactly these three existing GitHub files:

ROOT:
- worker.js

ASSETS:
- assets/site.js
- assets/site.css

This patch:
- Removes the 405 response from /api/chat.
- Accepts the message through POST and a query-string backup.
- Makes opening /api/chat show a health response.
- Restores the moving mortgage-rate ticker across the top of every page.
- Keeps the weekly Freddie Mac rates and calculator integration.

Upload locations:
1. Upload worker.js on the main/root GitHub page.
2. Open assets in GitHub and upload site.js and site.css there.
3. Commit the changes and wait for Cloudflare to deploy.
4. Open /api/chat directly. It should show JSON with "ok": true, not 405.
5. Refresh the website and test the AI widget.

Keep the Cloudflare secret named GEMINI_API_KEY.
