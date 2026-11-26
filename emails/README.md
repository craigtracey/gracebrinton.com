# ActiveCampaign email templates

Hand-written HTML for Grace's ActiveCampaign emails. These are source files, not
part of the site build: paste one into **Campaigns → Manage Templates → Create a
template → Custom HTML** whenever it changes.

| File | Sent by |
| --- | --- |
| `gut-meal-plan.html` | Form #9 automation (Gut Health Meal Plan delivery) |
| `hormone-guide.html` | Form #1 automation (Hormone Guide delivery) |
| `newsletter.html` | Regular newsletter campaigns |

The newsletter is a template: everything in `[BRACKETS]` and each block marked
`EDIT EACH ISSUE` changes per send. The article and recipe it ships with are
real examples (`sample-article.jpg`, `sample-recipe.jpg`); swap in each issue's
images at 1040×520 and 440×440, uploaded to ActiveCampaign or added here.

## Conventions

- **Images** load from `https://gracebrinton.com/images/email/`, so they live in
  `public/images/email/` and must be deployed before an email can show them. Use
  PNG/JPG (email clients don't render WebP) with transparent backgrounds where the
  image sits on the card.
- **Dark mode**: `@media (prefers-color-scheme: dark)` covers Apple Mail and
  Outlook for Mac; the `[data-ogsc]` / `[data-ogsb]` rules cover Outlook.com.
  Gmail ignores both and recolors on its own. Images that need a dark variant
  pair a `.light-img` with a `.dark-img` wrapper (see the logo).
- **ActiveCampaign tags**: `%FIRSTNAME%`, `%SENDER-INFO-SINGLELINE%` (the
  account's mailing address, required in every marketing email),
  `%UNSUBSCRIBELINK%`, `%UPDATELINK%`. In a browser preview they show as raw text.
