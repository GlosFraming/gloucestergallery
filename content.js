/* ============================================================
   GLOUCESTER FRAMING — EDITABLE CONTENT
   ------------------------------------------------------------
   This is the ONLY file you need to edit to update the website.
   Change the text between the "quotation marks", save the file,
   and upload it. The website updates itself.

   TIPS
   • Only change what's INSIDE the "quote marks".
   • Keep the commas at the end of each line.
   • For images, see the GALLERY section at the bottom.
   • If something breaks, you probably deleted a quote, comma
     or bracket — undo your change and try again.
   ============================================================ */

window.CONTENT = {

  /* ---------- BUSINESS DETAILS (top bar + footer) ---------- */
  business: {
    address1: "9 Commercial Road",
    address2: "Gloucester · GL1 2DY",
    phone: "01452 524 272",
    phoneLink: "01452524272",          // digits only, no spaces
    email: "info@gloucesterframing.com",
    // Get-directions button. Paste a Google Maps link here if you
    // want a precise pin; otherwise leave as is.
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Gloucester+Framing+9+Commercial+Road+Gloucester+GL1+2DY",
    // ---- SOCIAL MEDIA ----
    // You currently have no social presence, so these are switched
    // OFF. When you set up an account, just paste the full link
    // (e.g. "https://www.facebook.com/YourPage") between the quotes
    // and that icon will automatically appear on the site.
    // Leave a link as "" (empty) to keep that icon hidden.
    facebook: "",
    twitter: "",
    linkedin: "",
  },

  /* ---------- OPENING HOURS ----------
     Edit the times, or write "Closed". Add/remove days if needed. */
  openingHours: [
    { day: "Monday",    hours: "9:30am – 6:00pm" },
    { day: "Tuesday",   hours: "9:30am – 6:00pm" },
    { day: "Wednesday", hours: "9:30am – 6:00pm" },
    { day: "Thursday",  hours: "9:30am – 6:00pm" },
    { day: "Friday",    hours: "9:30am – 6:00pm" },
    { day: "Saturday",  hours: "10.00am – 4:00pm" },
    { day: "Sunday",    hours: "Closed" }
  ],

  /* ---------- PROMOTION BANNER ----------
     Set show to true to display a banner across the top of the page.
     Set to false to hide it completely. */
  promo: {
    show: false,
    text: "Spring offer — 15% off all medal & memorabilia framing throughout June."
  },

  /* ---------- HERO (top of page) ---------- */
  hero: {
    eyebrow: "Bespoke framing · Est. in the heart of Gloucester",
    headingLine1: "Framing is part of the",
    headingEm: "art.",                 // shown in red italic
    lead: "Hand-made, conservation-standard frames for fine art, photographs, medals, sports shirts and almost anything you can imagine — crafted in our Gloucester workshop.",
    buttonText: "View our work",       // links to the gallery
    frameCaption: "Your work, beautifully presented.",
    frameImage:   "images/cert.jpg",   // ← change this to any image in your images/ folder
    tag: "Hand-made"
  },

  /* ---------- SPECIALITIES STRIP (scrolling words) ---------- */
  strip: [
    "Fine Art", "Sports Shirts", "Medals & Military", "Certificates",
    "Box Frames", "Canvas Stretching", "Needlework", "Commercial"
  ],

  /* ---------- ABOUT ---------- */
  about: {
    kicker: "About us",
    leadLine: "With over thirty years' framing experience —  we treat every piece that comes through our doors as a work of art in its own right.",
    paragraph1: "At Gloucester Framing we offer a fully bespoke fine art and commercial framing service for the home, office, shops and galleries. Everything is produced by hand in our workshop, in line with the Fine Art Trade Guild's conservation framing standards.",
    paragraph2: "With over 500 moulding samples to view in-store and helpful, honest advice on every project, we'll find the frame that enhances your work and displays it in the best possible light.",
    stats: [
      { number: "30+",  label: "Years experience" },
      { number: "500+", label: "Moulding samples" },
      { number: "10+",  label: "Years on Commercial Road" }
    ],
    visualLabel: "Conservation-standard craft, made by hand in Gloucester."
  },

  /* ---------- SERVICES (the six cards) ---------- */
  services: {
    kicker: "What we frame",
    heading: "You name it, we frame it",
    cards: [
      { title: "Original Artwork",            text: "Oils stretched and tray-framed, watercolours, prints and originals — treated with the care they deserve." },
      { title: "Sports Shirts & Memorabilia", text: "Display and protect treasured shirts, signed prints and memorabilia in a custom-fitted frame." },
      { title: "Prints & Photos",             text: "Bespoke frames and a wide range of mounts — including multi-aperture mounts — to make your photos come to life." },
      { title: "Medal Framing",               text: "Vast experience with military and sporting medals, combined with memorabilia to create a fitting tribute." },
      { title: "Certificate Framing",         text: "Make hard-earned certificates stand out with the right mount and frame — your achievements, shown off in style." },
      { title: "Box & 3D Frames",             text: "Wedding flowers, jackets, models, baby casts — even a Mitsubishi Evo camshaft. Challenge us; we'll find a solution." }
    ]
  },

  /* ---------- PROCESS (the four steps) ---------- */
  process: {
    kicker: "How it works",
    heading: "From your hands to the wall",
    steps: [
      { title: "Bring it in",       text: "Pop into the workshop on Commercial Road with your piece — no appointment needed." },
      { title: "Choose together",   text: "Browse 500+ samples and we'll advise on mouldings, mounts and glass to suit your work." },
      { title: "Hand-crafted",      text: "Our skilled team build your frame by hand to conservation standards in our workshop." },
      { title: "Ready to display",  text: "Collect your finished frame — fitted, protected and ready to hang." }
    ]
  },

  /* ============================================================
     GALLERY — YOUR WORK PHOTOS
     ------------------------------------------------------------
     HOW TO ADD A PHOTO:
     1. Put your image file (e.g. medals.jpg) in the SAME folder
        as the website, ideally in an "images" folder.
     2. Add a line below in this format:
            { src: "images/medals.jpg", caption: "Framed war medals" },
     3. Keep the comma at the end. Save and upload.

     • "src" is the path to the image file.
     • "caption" shows when someone hovers over it (optional —
        you can leave it as "").
     • The first item can be "wide: true" to make it span two
        columns. Order them however you like.
     • If the list is EMPTY, coloured placeholders are shown
        instead, so the site never looks broken.
     ============================================================ */
  gallery: {
    kicker: "Our work",
    heading: "A few pieces we're proud of",
    items: [
      // ---- THESE ARE EXAMPLES so you can see how it works. ----
      // Replace the src/caption with your own photos, or delete
      // these lines once you've added your real ones.
      { src: "images/memorabilia_police.jpg", caption: "Medals, certs, warrants etc" },
      { src: "images/jacket dinner.jpg",  caption: "all types of shirt framed" },
      { src: "images/fan.jpg",    caption: "object framing, we frame everything" },

      { src: "images/shirt_moto.jpg",     caption: "Framed GBR cycling shirts" },
      { src: "images/football_2.jpg",     caption: "Framed signed shirt" },
      { src: "images/football_3.jpg",     caption: "Framed signed shirt" },
      { src: "images/football_4.jpg",     caption: "Framed signed shirt" },
      { src: "images/football_5.jpg",     caption: "Framed signed shirt" },
      { src: "images/object_snooker.jpg", caption: "Signed snooker memorabilia" },
      { src: "images/flag_2.jpg",         caption: "Military flag framing" },
      { src: "images/jacket_dinner.jpg",  caption: "Military dress jacket" },
      { src: "images/jacket_black.jpg",   caption: "Framed jacket" },
      { src: "images/Rugby_1.jpg",        caption: "Framed rugby shirt" },
      // YOUR REAL PHOTOS go here:
      { src: "images/flag.jpg", caption: "Flag framing" },
      { src: "images/football.jpg", caption: "Framed signed shirt" },
{ src: "images/jacket_red.jpg", caption: "Military jacket" },
{ src: "images/object_trowel.jpg", caption: "Object framing" },
{ src: "images/cert.jpg", caption: "Certificates & warrants" },
    ]
  },

  /* ---------- CONTACT / CALL-TO-ACTION ---------- */
  contact: {
    heading: "Let's frame something beautiful.",
    text: "Everything we do is bespoke and face-to-face. Bring your piece in, or get in touch for friendly, honest advice — we're confident we can come up with a solution for whatever you'd like framed.",
    // Shown as small, low-key text under the contact buttons.
    // Leave as "" to hide it entirely.
    smallNote: "Collection and delivery can be arranged for larger pieces or where access is difficult — please ask for details.",
    footerBlurb: "Quality, affordable, hand-made framing from the heart of Gloucester, between Gloucester Quays and the city centre — come and visit."
  }

};
