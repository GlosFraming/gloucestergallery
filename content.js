/* ============================================================
   GLOUCESTER GALLERY — EDITABLE CONTENT
   ------------------------------------------------------------
   This is the ONLY file you need to edit to update the website.
   Change the text between the "quotation marks", save the file,
   and upload it alongside index.html.

   TIPS
   • Only change what's INSIDE the "quote marks".
   • Keep the commas at the end of each line.
   • To add an artist, copy an existing artist block and paste it.
   • If something breaks, undo your change and try again.
   ============================================================ */

window.GALLERY = {

  /* ---------- BUSINESS DETAILS ---------- */
  business: {
    name: "Gloucester Gallery",
    tagline: "A rotating showcase of local talent — in the heart of Gloucester",
    address1: "7 Commercial Road",
    address2: "Gloucester · GL1 2DY",
    phone: "01452 524 272",
    phoneLink: "01452524272",
    email: "gallery@gloucesterframing.com",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=7+Commercial+Road+Gloucester+GL1+2DY",
    framingShopUrl: "index.html",
    facebook: "",
    instagram: "",
  },

  /* ---------- OPENING HOURS ---------- */
  openingHours: [
    { day: "Monday",    hours: "9:30am – 5:30pm" },
    { day: "Tuesday",   hours: "9:30am – 5:30pm" },
    { day: "Wednesday", hours: "9:30am – 5:30pm" },
    { day: "Thursday",  hours: "9:30am – 5:30pm" },
    { day: "Friday",    hours: "9:30am – 5:30pm" },
    { day: "Saturday",  hours: "10:00am – 4:00pm" },
    { day: "Sunday",    hours: "Closed" }
  ],

  /* ---------- PROMO BANNER ----------
     Set show: true to display a banner at the top of the page. */
  promo: {
    show: true,
    text: "Now showing: Sarah Meredith — 'Along the Severn' · Original watercolours · Until 30 June"
  },

  /* ---------- HERO ---------- */
  hero: {
    eyebrow: "Gloucester · A new artist every month",
    headingLine1: "Where local art",
    headingEm: "comes alive.",
    lead: "Our intimate gallery on Commercial Road hands over its walls to a different local artist every month — giving Gloucester a constantly fresh window onto the talent on its doorstep.",
    ctaText: "See current exhibition",
    ctaLink: "#current",
  },

  /* ---------- SCROLLING STRIP ---------- */
  strip: [
    "Oils", "Watercolour", "Photography", "Printmaking",
    "Sculpture", "Mixed Media", "Illustration", "Ceramics"
  ],

  /* ---------- ABOUT THE GALLERY ---------- */
  about: {
    kicker: "About the gallery",
    heading: "A new view, every month",
    body1: "Gloucester Gallery sits next door to Gloucester Framing on Commercial Road — sharing a wall, a passion for art, and nothing else. We are a deliberately small, intimate space: one artist, one month, all the walls.",
    body2: "Each exhibition is a genuine takeover. The featured artist curates the hang, sets prices, and sells their work directly through the gallery. Works are available to buy online and collect in-gallery.",
    body3: "We are proudly independent, proudly local, and free to visit.",
    stats: [
      { number: "12",   label: "Exhibitions per year" },
      { number: "100%", label: "Local artists" },
      { number: "Free",  label: "Entry, always" }
    ],
    // This text appears in the highlighted card on the about section
    launchNote: "Artists can choose to mark the start of their exhibition with a launch event — a great way to generate buzz and get first sales. We help arrange and facilitate these when artists want them.",
  },

  /* ---------- HOW IT WORKS ---------- */
  howItWorks: {
    kicker: "How it works",
    heading: "One artist. One month. All the walls.",
    steps: [
      { title: "A new artist monthly",   text: "Each calendar month a selected local artist takes over the gallery entirely — their work, their curation, their vision." },
      { title: "Optional launch event",  text: "Artists can choose to open with a launch event. We help facilitate these — a great way to build an audience and make first sales." },
      { title: "Buy online or in-store", text: "Every piece on display has a price. Buy securely online and collect from the gallery at your convenience." },
      { title: "Framing next door",      text: "Need it framed? Our sister workshop next door offers framing for purchased works at a special gallery rate." }
    ]
  },

  /* ============================================================
     ARTISTS
     ------------------------------------------------------------
     STATUS OPTIONS:
       "current"   — showing right now
       "upcoming"  — next in the schedule
       "past"      — archive entry

     WORKS: each work needs:
       title, medium, size, price (number, £), src (image path)
       available: true or false

     LAUNCH EVENTS:
       launchDate and launchNote are optional.
       Leave launchDate as "" if there is no launch event.
     ============================================================ */
  artists: [

    {
      id: "sarah-meredith",
      status: "current",
      name: "Sarah Meredith",
      month: "June 2026",
      discipline: "Watercolour",
      portrait: "Images/artist-sarah.jpg",
      tagline: "Quiet light on familiar water",
      bio: "Sarah Meredith has painted the rivers and flood plains of the Severn Vale for fifteen years. Her watercolours are quiet, luminous things — full of the particular grey-gold light of the West Country. She lives and works in Minsterworth.",
      launchDate: "Friday 6 June, 6:30 – 9:00pm",
      launchNote: "Free entry. Wine provided. All welcome.",
      works: [
        { title: "Morning Mist, Westgate Bridge", medium: "Watercolour on paper", size: "42 × 59 cm", price: 380, available: true,  src: "Images/sarah-1.jpg" },
        { title: "Flood Plain, January",          medium: "Watercolour on paper", size: "30 × 40 cm", price: 260, available: false, src: "Images/sarah-2.jpg" },
        { title: "The Severn at Minsterworth",    medium: "Watercolour on paper", size: "50 × 70 cm", price: 520, available: true,  src: "Images/sarah-3.jpg" },
        { title: "Low Tide",                      medium: "Watercolour on paper", size: "21 × 29 cm", price: 145, available: true,  src: "Images/sarah-4.webp" },
        { title: "Ley Lines",                     medium: "Watercolour on paper", size: "42 × 59 cm", price: 395, available: true,  src: "Images/sarah-5.jpg" },
        { title: "Autumn Estuary",                medium: "Watercolour on paper", size: "30 × 40 cm", price: 280, available: true,  src: "Images/sarah-6.webp" },
      ]
    },

    {
      id: "james-okafor",
      status: "upcoming",
      name: "James Okafor",
      month: "July 2026",
      discipline: "Oil on Canvas",
      portrait: "Images/artist-james.jpg",
      tagline: "Gloucester in bold colour",
      bio: "James Okafor paints Gloucester's streets, markets and faces with an expressionist boldness that stops people in their tracks. His oils are built up in thick impasto — colour and texture as much as image. James is based in the Barton Street area of the city.",
      launchDate: "",
      launchNote: "",
      works: [
        { title: "Eastgate Market, Saturday",  medium: "Oil on canvas", size: "60 × 80 cm", price: 750, available: true, src: "Images/james-1.jpg" },
        { title: "Barton Street Portrait I",   medium: "Oil on canvas", size: "50 × 60 cm", price: 620, available: true, src: "Images/james-2.jpg" },
        { title: "Cathedral, Late Afternoon",  medium: "Oil on canvas", size: "70 × 90 cm", price: 980, available: true, src: "Images/james-3.jpg" },
      ]
    },

    {
      id: "nina-fletcher",
      status: "past",
      name: "Nina Fletcher",
      month: "May 2026",
      discipline: "Photography",
      portrait: "Images/artist-nina.jpg",
      tagline: "Gloucester through a different lens",
      bio: "Nina Fletcher's documentary photography finds the poetic in the everyday. Her May exhibition, 'Ordinary Days', focused entirely on the city's lesser-known corners.",
      launchDate: "Friday 2 May, 6:30 – 9:00pm",
      launchNote: "Free entry. All welcome.",
      works: [
        { title: "Commercial Road, 6am",     medium: "Archival pigment print", size: "40 × 60 cm", price: 195, available: false, src: "Images/nina-1.jpg" },
        { title: "The Docks in Fog",         medium: "Archival pigment print", size: "60 × 90 cm", price: 320, available: false, src: "Images/nina-2.jpg" },
        { title: "Westgate Street, Sunday",  medium: "Archival pigment print", size: "40 × 60 cm", price: 195, available: true,  src: "Images/nina-3.jpg" },
      ]
    }

  ],

  /* ---------- ARTIST ENQUIRY SECTION ----------
     This is the "Show your work" section.
     The points list summarises what artists get — keep it honest and factual. */
  rentTheGallery: {
    kicker: "Are you an artist?",
    heading: "Take over our walls.",
    body: "We select artists on a rolling basis throughout the year. If you work in any medium and are based in or around Gloucestershire, we'd love to hear from you. Get in touch and we'll send you our full information pack — including our current fees, commission structure, and available dates.",
    points: [
      "A full calendar month — all walls, yours to curate",
      "Your work listed and sold through this website",
      "Optional launch event — we'll help you arrange and facilitate it",
      "Framing support from our workshop next door",
      "Straightforward space rental fee and sales commission — details in our info pack"
    ],
    formHeading: "Request an information pack",
    // Text shown on the button
    buttonText: "Send request",
    // Message shown after the form is submitted
    successMessage: "Thank you — we'll send our information pack to your email shortly.",
  },

  /* ---------- STRIPE PAYMENT ----------
     Replace with your real Stripe publishable key when ready.
     Set testMode: true to simulate payments without charging anyone. */
  stripe: {
    publishableKey: "pk_test_REPLACE_WITH_YOUR_KEY",
    testMode: true,
    currency: "gbp",
    collectNote: "Works are collected from Gloucester Gallery, 7 Commercial Road, GL1 2DY. You will receive a confirmation email with collection details after purchase."
  }

};
