BLACKSTONE WEBSITE — ADMIN HUB + PHONE FIX ONLY

BASELINE:
blackstrone_-New-website-main (3).zip

CHANGES:
- Public website phone updated to (925) 722-5144 / +19257225144.
- Added admin-hub.html.
- Replaced footer "Back At You CRM Login" with "Admin Tools Login".
- Admin Hub launches CRM, Property OS / Flip Analyzer, Transaction Portal,
  Website Listing Manager, Digital Business Card, and Website AI Tools.
- Worker protects /admin-hub.html, /admin-hub, and /listing-manager.html.

ONE-TIME CLOUDFLARE SETUP ON THE MAIN WEBSITE WORKER:
- Add Secret: ADMIN_HUB_PASSWORD = your private password
- Optional: ADMIN_HUB_USERNAME = your preferred username
  If omitted, username is: blackstone

The password is never stored in the website files.

PRESERVED:
- Existing website design and pages
- Existing lead forms and Supabase CRM lead capture
- Existing AI/rate worker routes
- IDX/search pages
- Property-management and repair pages
- All existing integrations not explicitly changed
