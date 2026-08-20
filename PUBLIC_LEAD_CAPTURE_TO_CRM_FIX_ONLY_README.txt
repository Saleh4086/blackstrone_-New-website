BLACKSTONE WEBSITE — PUBLIC LEAD CAPTURE TO CRM FIX ONLY

BASE:
BLACKSTONE_WEBSITE_ADMIN_HUB_LINK_REFRESH_ONLY.zip

RUNTIME CHANGE:
Only public HTML pages that already contain a .lead-form now load:
assets/site.js?v=crm20260819-2

This forces the CURRENT CRM lead-capture JavaScript to load instead of an older cached copy.

UNCHANGED:
- assets/site.js logic
- worker.js / Supabase backend
- admin-hub.html
- Admin Hub protection
- CRM / Transaction links
- Twilio voice workers
- SMS / repair texting
- CRM outbound dialer
- drip campaigns
- CSS/images
- Digital Business Card project

EXPECTED WEBSITE FLOW:
Public website/landing-page form -> /api/leads -> Supabase CRM -> existing FormSubmit email notification.

REQUIRED WEBSITE WORKER VARIABLES:
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

DIGITAL BUSINESS CARD:
This ZIP does not modify the separate Digital Card project. Its own Cloudflare Worker must have
the same Supabase variables for its existing CRM-save path.
