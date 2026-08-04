BLACKSTONE AI CONCIERGE WIDGET

This package is designed to be added to your existing Blackstone website.

INSTALLATION
1. Upload these files into your existing website's assets folder:
   - assets/blackstone-ai-widget.css
   - assets/blackstone-ai-widget.js
   - assets/blackstone-logo.jpg

2. Add this line inside your website's <head>:
   <link rel="stylesheet" href="assets/blackstone-ai-widget.css">

3. Add this line immediately before </body>:
   <script src="assets/blackstone-ai-widget.js"></script>

4. Upload/redeploy your website.

CURRENT STATUS
- The widget design and guided demo responses work immediately.
- The page buttons link to your existing website pages.
- Live AI is not activated until you add an API endpoint in blackstone-ai-widget.js.

LIVE AI CONNECTION
In blackstone-ai-widget.js, find:
apiEndpoint: ""

Replace it with your secure backend endpoint. Never place a private Gemini or OpenAI API key directly in the browser JavaScript.

EDIT YOUR INFORMATION
At the top of blackstone-ai-widget.js, update:
- phone
- email
- bookingUrl
- page URLs

MOBILE
The widget automatically resizes for iPhone and Android screens.
