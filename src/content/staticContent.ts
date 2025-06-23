// src/content/staticContent.ts
export const staticContent = {
  en: {
    sections: {
      shows: {
        description: "We run shows every couple of months in beautiful unique locations around Montreal.",
        ctaText: "Want to play a show?",
        ctaLink: "Click here!"
      },
      artists: {
        description: "We work with amazing artists building beautiful words."
      },
      releases: {
        description: "Artifacts of creation. Some of the gorgeous work that we've helped release."
      },
      about: {
        title: "About Favourite Library",
        content: `Favourite Library is an independent music label based in Montreal, Quebec. 
                  We believe in the power of music to connect people and create meaningful experiences.
                  
                  Founded in 2019, we work closely with our artists to help them realize their creative vision 
                  while building sustainable careers in music.`,
        values: {
          title: "Our Values",
          items: [
            {
              title: "Artist-First",
              description: "We put our artists' creative vision and wellbeing at the center of everything we do."
            },
            {
              title: "Community",
              description: "Music brings people together. We foster connections between artists and audiences."
            },
            {
              title: "Sustainability",
              description: "We believe in building long-term, sustainable careers for our artists."
            }
          ]
        }
      }
    },
    footer: {
      copyright: "© 2024 Favourite Library. All rights reserved.",
      newsletter: {
        title: "Stay Updated",
        description: "Get the latest news about shows, releases, and our artists.",
        placeholder: "Enter your email",
        button: "Subscribe"
      }
    }
  },
  fr: {
    sections: {
      shows: {
        description: "Nous organisons des spectacles tous les deux mois dans de magnifiques lieux uniques autour de Montréal.",
        ctaText: "Vous voulez jouer un spectacle?",
        ctaLink: "Cliquez ici!"
      },
      artists: {
        description: "Nous travaillons avec des artistes incroyables qui créent de beaux univers."
      },
      releases: {
        description: "Artéfacts de création. Quelques-unes des magnifiques œuvres que nous avons aidé à sortir."
      },
      about: {
        title: "À propos de Favourite Library",
        content: `Favourite Library est un label de musique indépendant basé à Montréal, Québec.
                  Nous croyons au pouvoir de la musique pour connecter les gens et créer des expériences significatives.
                  
                  Fondé en 2019, nous travaillons étroitement avec nos artistes pour les aider à réaliser leur vision créative
                  tout en construisant des carrières durables dans la musique.`,
        values: {
          title: "Nos valeurs",
          items: [
            {
              title: "L'artiste d'abord",
              description: "Nous plaçons la vision créative et le bien-être de nos artistes au centre de tout ce que nous faisons."
            },
            {
              title: "Communauté",
              description: "La musique rassemble les gens. Nous favorisons les connexions entre les artistes et le public."
            },
            {
              title: "Durabilité",
              description: "Nous croyons en la construction de carrières durables à long terme pour nos artistes."
            }
          ]
        }
      }
    },
    footer: {
      copyright: "© 2024 Favourite Library. Tous droits réservés.",
      newsletter: {
        title: "Restez informé",
        description: "Recevez les dernières nouvelles sur les spectacles, les sorties et nos artistes.",
        placeholder: "Entrez votre courriel",
        button: "S'abonner"
      }
    }
  }
};

// Hook to access static content
import { useLanguage } from '@/context/LanguageContext';

export function useStaticContent() {
  const { locale } = useLanguage();
  return staticContent[locale];
}

// Type-safe content getter
export function getStaticContent<T extends keyof typeof staticContent.en>(
  section: T,
  locale: 'en' | 'fr' = 'en'
): typeof staticContent.en[T] {
  return staticContent[locale][section];
}