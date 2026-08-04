BLACKSTONE ACTIVE AI FIX

These are the two files the live website actually uses.

Replace in GitHub:
1. assets/site.js
2. functions/api/chat.js

Upload the folders exactly as shown so the paths remain:
- /assets/site.js
- /functions/api/chat.js

Do not upload README.txt if you do not want it in the repository.
Commit directly to main, wait for Cloudflare deployment to finish, then refresh the website with Ctrl+F5.

The chatbot will now show the real API error instead of the generic canned response. If the Gemini key and API are valid, it will display Gemini's answer.
