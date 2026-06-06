# HOW TO EDIT YOUR GLOUCESTER GALLERY WEBSITE
## The only file you need to touch is `content.js`

---

## THE GOLDEN RULE
**Only edit `content.js`. Never touch `index.html` unless instructed.**
Everything — text, artists, works, prices, opening hours — lives in `content.js`.

---

## UPDATING OPENING HOURS
Find the `openingHours` section. Change the times, or type "Closed".

---

## SWITCHING ON THE PROMO BANNER
Find the `promo` section. Change `show: false` to `show: true`, and update the text.

---

## ADDING A NEW ARTIST
Copy this block and paste it at the TOP of the `artists: [ ]` array.
Change the previous "current" artist's status to "past".

```javascript
{
  id: "firstname-lastname",         // lowercase, hyphens only, no spaces
  status: "current",                // "current", "upcoming", or "past"
  name: "First Last",
  month: "August 2026",
  discipline: "Oil painting",
  portrait: "images/artist-firstname.jpg",
  tagline: "A short memorable line about their work",
  bio: "A paragraph about the artist. Two or three sentences is ideal.",
  launchDate: "Friday 7 August, 6:30 – 9:00pm",  // leave "" if no launch event
  launchNote: "Free entry. All welcome.",           // leave "" if no launch event
  works: [
    { title: "Painting Title", medium: "Oil on canvas", size: "50 × 60 cm", price: 450, available: true, src: "images/firstname-1.jpg" },
    { title: "Another Piece",  medium: "Oil on canvas", size: "30 × 40 cm", price: 280, available: true, src: "images/firstname-2.jpg" },
  ]
},
```

---

## ADDING WORKS TO AN ARTIST
Inside an artist's `works: [ ]` array, add a line like:
```javascript
{ title: "Title", medium: "Medium", size: "40 × 50 cm", price: 350, available: true, src: "images/filename.jpg" },
```
- `available: false` shows a SOLD badge and removes the buy button.
- `price` is a number only — no £ sign.

---

## MARKING A WORK AS SOLD
Find the work and change `available: true` to `available: false`.

---

## LAUNCH EVENTS
Launch events are optional and entirely up to each artist.
- If an artist is having one, fill in `launchDate` and `launchNote`.
- If not, leave both as `""` and nothing will appear on the site.

---

## ADDING PHOTOS
1. Put your image file (e.g. `portrait.jpg`) in the `images/` folder.
2. Reference it as `"images/portrait.jpg"` in the artist's `portrait` or `src` fields.
3. Works display best at roughly 4:3 ratio. Portraits display best square.

---

## THE ARTIST ENQUIRY SECTION
The "Take over our walls" section is controlled by `rentTheGallery` in `content.js`.
- Update `body` to change the introductory paragraph.
- Update `points` to change the bullet list.
- Update `successMessage` to change what appears after someone submits the form.

---

## ARTIST STATUS VALUES

| Status     | What it does                                         |
|------------|------------------------------------------------------|
| `current`  | Shows in the hero, the "On Now" section, gold badge  |
| `upcoming` | Shows in the sidebar of the exhibitions section      |
| `past`     | Shows in the artists archive with a grey badge       |

Only ONE artist should have `status: "current"` at any time.

---

## SETTING UP STRIPE (REAL PAYMENTS)
1. Go to https://dashboard.stripe.com and get your publishable key (`pk_live_...`).
2. In `content.js`, find `stripe` and replace `publishableKey` with your real key.
3. Change `testMode: true` to `testMode: false`.
4. Real payment processing also requires a small backend to create Payment Intents
   securely — speak to your web developer, or use Stripe Payment Links as a
   simpler no-code alternative.

---

## CONNECTING SOCIAL MEDIA
In `business`, paste the full URL:
```
facebook:  "https://www.facebook.com/YourPage",
instagram: "https://www.instagram.com/YourHandle",
```
Leave as `""` to keep it hidden.

---

## IF SOMETHING BREAKS
- You probably deleted a quote `"`, comma `,`, or bracket `{` / `}`
- Undo your last change and try again
- Every line inside an object should end with a comma
- The very last entry before a closing `}` or `]` does NOT need a comma
