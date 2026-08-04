BLACKSTONE AI FINAL FIX

Upload these two files to the same locations in GitHub and replace the existing files:

1. blackstone-ai-widget.js  -> repository root
2. functions/api/chat.js   -> functions/api/chat.js

Then commit the changes. Cloudflare should redeploy automatically.
Keep the Cloudflare production secret named exactly GEMINI_API_KEY.
After the deployment turns green, refresh the website with Ctrl+F5 and ask: What is 2+2?
