BLACKSTONE WEBSITE — CRM LEAD ROUTE FIX ONLY

BASE: blackstrone_-New-website-main (5).zip

ONLY CHANGES:
1. assets/site.js now posts website lead forms to the canonical Blackstone Worker endpoint:
   https://blackstonesignatureproperty.com/api/leads
   instead of the relative /api/leads path.
2. HTML pages load assets/site.js?v=crm20260819-3 to prevent an older cached lead-capture script from being reused.

UNCHANGED:
- Website design/content/layout
- Supabase CRM schema/data
- Twilio voice/SMS workers
- Admin Hub
- Gemini/AI
- FormSubmit email notification
- All other website behavior
