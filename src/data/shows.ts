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
  lineup: string[];
  ticketLink?: string;
}

export const shows = [
  {
    id: "spring-showcase",
    title: "Spring Showcase 2025",
    date: "March 25, 2025",
    time: "8:00 PM",
    venue: "The Echo Chamber",
    address: "123 Main Street",
    city: "Los Angeles",
    country: "USA",
    description: "A night of ambient electronic music featuring our roster of talented artists.",
    image: "/images/shows/show-1.jpg",
    lineup: ["Elliot Dawn", "Aurora Waves", "Lunar Drift"],
    ticketLink: "https://tickets.example.com/spring-showcase"
  },
  {
    id: "summer-session",
    title: "Summer Session",
    date: "July 15, 2025",
    time: "9:00 PM",
    venue: "Beachside Pavilion",
    address: "456 Ocean Drive",
    city: "Miami",
    country: "USA",
    description: "Join us for a night of tropical beats and summer vibes under the stars.",
    image: "/images/shows/summer-session.jpg",
    lineup: ["Aurora Waves", "Beach Collective", "Summer Nights"],
    ticketLink: "https://tickets.example.com/summer-session"
  }
];