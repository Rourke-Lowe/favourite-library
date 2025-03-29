export interface Show {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  description: string;
  image: string;
  series: string; // Added series field
  lineup: string[];
  ticketLink?: string;
}

// src/data/shows.js

export const shows = [
  {
    "id": "late-fees-03",
    "title": "Late Fees 03",
    "date": "March 7, 2025",
    "time": "8:00 PM",
    "venue": "DE STIIL",
    "city": "Montreal",
    "description": "Our first Favourite Library show of 2025. LATE FEES 03 at Librarie De Stiil Bookstore features three wonderful songwriters. \n \n Based in Nashville, Savanna is currently travelling across Canada and the US on tour supporting Mackenzy Mackay. She shapes introspective indie-pop melodies exploring ideas of vulnerability and self-discovery. \n \n  Grace is a singer & songwriter who hails from Yellowknife, NWT. As a Métis artist who spent many years of her life on the edge of the Arctic circle Grace draws inspiration from all which surrounds her in the North. \n \n  Noémie Kaiser is a Francophone singer-songwriter from Tiohtià:ke/Montreal bringing together jazz and folk in a way that’s both thoughtful and warm. “L’or des fous,” her 2023 release, has been in regular rotation at our office.",
    "image": "/images/shows/Late Fees 03 Poster Main.jpg",
    "series": "Late Fees", // Added series field
    "lineup": [
      "Savanna Leigh",
      "Grace Clarke",
      "Noémie Kaiser"
    ],
    "ticketLink": "https://tickets.example.com/late-fees-03"
  },
  {
    "id": "afternoon-tea-house-03",
    "title": "Afternoon Tea House 03",
    "date": "December 13, 2024",
    "time": "8:00 PM",
    "venue": "Studio Le Crib",
    "city": "Montreal",
    "description": "Part of our Afternoon Tea House series.",
    "image": "/images/shows/Afternoon Tea House 03 Poster Main.jpg",
    "series": "Afternoon Tea House", // Added series field
    "lineup": [
      "Oliver Forest",
      "Gabriella Olivo",
      "Clay Pigeon"
    ],
    "ticketLink": "https://tickets.example.com/afternoon-tea-house-03"
  },
  {
    "id": "late-fees-02",
    "title": "Late Fees 02",
    "date": "September 27, 2024",
    "time": "8:00 PM",
    "venue": "Librarie St Henri",
    "city": "Montreal",
    "description": "Part of our Late Fees series.",
    "image": "/images/shows/Late Fees 02 Poster Main.png",
    "series": "Late Fees", // Added series field
    "lineup": [
      "Matthew Loveyou",
      "Fine Food Market",
      "Mellow Casualty"
    ],
    "ticketLink": "https://tickets.example.com/late-fees-02"
  },
  {
    "id": "and-friends-03",
    "title": "And Friends 03",
    "date": "August 9, 2024",
    "time": "8:00 PM",
    "venue": "Studio Madame Wood",
    "city": "Montreal",
    "description": "Part of our And Friends series.",
    "image": "/images/shows/And Friends 03 Poster Main.jpg",
    "series": "And Friends", // Added series field
    "lineup": [
      "Fruit Snack",
      "The Everywheres",
      "Frown Line"
    ],
    "ticketLink": "https://tickets.example.com/and-friends-03"
  },
  {
    "id": "handmade-01",
    "title": "Handmade 01",
    "date": "June 5, 2024",
    "time": "8:00 PM",
    "venue": "Art et Fleurs",
    "city": "Montreal",
    "description": "Part of our Handmade series.",
    "image": "/images/shows/Handmade 01 Poster Main.jpg",
    "series": "Handmade", // Added series field
    "lineup": [
      "BOZOBABY",
      "Edwin Raphael",
      "Microwave Tower",
      "Afternoon Bike Ride"
    ],
    "ticketLink": "https://tickets.example.com/handmade-01"
  },
  {
    "id": "afternoon-tea-house-02",
    "title": "Afternoon Tea House 02",
    "date": "April 26, 2024",
    "time": "8:00 PM",
    "venue": "AYM Ashtanga Yoga Montreal",
    "city": "Montreal",
    "description": "Part of our Afternoon Tea House series.",
    "image": "/images/shows/Afternoon Tea House 02 Poster Main.png",
    "series": "Afternoon Tea House", // Added series field
    "lineup": [
      "Drucker",
      "Milan André Boronell",
      "Dahlia Rue",
      "Luminescent"
    ],
    "ticketLink": ""
  },
  {
    "id": "late-fees-01",
    "title": "Late Fees 01",
    "date": "November 23, 2023",
    "time": "8:00 PM",
    "venue": "Venue TBA",
    "city": "Montreal",
    "description": "Part of our Late Fees series.",
    "image": "/images/shows/Late Fees 01 Poster Main.png",
    "series": "Late Fees", // Added series field
    "lineup": [
      "Hank's Dream",
      "Flara K",
      "Holly Mclachlan",
      "Alex Mick"
    ],
    "ticketLink": ""
  },
  {
    "id": "and-friends-02",
    "title": "And Friends 02",
    "date": "August 12, 2023",
    "time": "8:00 PM",
    "venue": "Cafe Camas",
    "city": "Montreal",
    "description": "Part of our And Friends series.",
    "image": "/images/shows/And Friends 02 Poster Main.png",
    "series": "And Friends", // Added series field
    "lineup": [
      "Hotel Dog",
      "girl with dream",
      "Beach Season",
      "School House"
    ],
    "ticketLink": ""
  },
  {
    "id": "afternoon-tea-house-01",
    "title": "Afternoon Tea House 01",
    "date": "March 25, 2023",
    "time": "8:00 PM",
    "venue": "Edwins",
    "city": "Montreal",
    "description": "Part of our Afternoon Tea House series.",
    "image": "/images/shows/Afternoon Tea House 01 Poster Main.png",
    "series": "Afternoon Tea House", // Added series field
    "lineup": [
      "Erin Marcellina",
      "MEGGO",
      "Chiara Savasta",
      "Anna Justen"
    ],
    "ticketLink": ""
  },
  {
    "id": "and-friends-01",
    "title": "And Friends 01",
    "date": "November 30, 2022",
    "time": "8:00 PM",
    "venue": "Edwins",
    "city": "Montreal",
    "description": "Part of our And Friends series.",
    "image": "/images/shows/And Friends 01 Poster Main.jpg",
    "series": "And Friends", // Added series field
    "lineup": [
      "Nicholas Cangiano",
      "Edwin Raphael",
      "Dameer",
      "Jayde",
      "Laraw"
    ],
    "ticketLink": ""
  }
];