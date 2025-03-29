export interface show {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    country?: string;
    description?: string;
    image: string;
    lineup?: string[];
    ticketLink?: string;
    series?: string;
    price?: string;
    soldOut?: boolean;
  }