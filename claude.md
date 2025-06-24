# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

I'm going to provide you with step by step instructions that will help us implement and fix new features. Each step will provide the scope of what we want to accomplish in that step, and i don't want you to do anything that's outside the scope of those changes. 

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Project Overview

This is a bilingual (English/French) music label website built with Next.js 14 and the App Router. The site showcases artists, releases, shows, and contact information with a sophisticated internationalization system.

## Development Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run analyze         # Build with bundle analyzer
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives + shadcn/ui patterns
- **State Management**: React Context (LanguageContext, ModalContext)

### Key Architecture Patterns

**Internationalization System**
- Custom i18n implementation using React Context
- Bilingual support (English/French) with `LanguageContext`
- Translation keys in `src/context/LanguageContext.tsx`
- Static JSON data files organized by language in `/public/data/en/` and `/public/data/fr/`
- Fallback mechanism: French → English for missing translations
- Use `useLanguage()` hook for accessing `t()` function and `locale`

**Data Architecture**
- Static JSON files in `/public/data/` directory
- Structured data: artists, releases, shows
- Type-safe loading with `useLocalizedData` hook
- TypeScript interfaces defined in `src/types/`

**Component Structure**
```
src/components/
├── layout/           # Layout components (Navbar, Footer)
├── sections/         # Page sections (Hero, About, Artists, Releases, Shows, Contact)
├── shows/           # Show-specific components
├── releases/        # Release-specific components  
└── ui/              # Reusable UI components (shadcn/ui style)
```

### Git Workflow
- **Main Branch**: `master` (not `main`)
- **Feature Branches**: Use descriptive names like `feature/mobile-navigation`
- Recent work focused on multilingual features (see commit history)

### Styling System
- **Colors**: CSS custom properties with HSL values
- **Typography**: Inter (body), Clash Display (headings), JetBrains Mono (code)
- **Animations**: Custom keyframes (shimmer, float) with Tailwind Animate
- **Responsive**: Mobile-first approach with Tailwind breakpoints

### Key Features
1. **Multilingual Support**: Complete English/French translation system
2. **Media Rich**: Audio players, image galleries, video backgrounds
3. **Performance Focused**: Lazy loading, optimized images, bundle analysis
4. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Working with Internationalization

When adding new UI text:
1. Add translation keys to both `en` and `fr` objects in `src/context/LanguageContext.tsx`
2. Use the `t()` function from `useLanguage()` hook
3. For data content, create corresponding JSON files in `/public/data/en/` and `/public/data/fr/`
4. Use `useLocalizedData` hook for loading localized data

Example:
```tsx
const { t, locale } = useLanguage();
return <button>{t('common.viewDetails')}</button>;
```

## Data Loading Patterns

Use the `useLocalizedData` hook for loading JSON data:
```tsx
const { data: artists, loading, error } = useLocalizedData<Artist[]>('artists');
```

Data files should be structured as:
- `/public/data/en/artists.json`
- `/public/data/fr/artists.json`

## Component Patterns

- Use TypeScript interfaces from `src/types/`
- Follow shadcn/ui component patterns for consistency
- Implement proper error boundaries and loading states
- Use Radix UI primitives for complex interactions (modals, dropdowns)
- Implement lazy loading for performance-critical components

## Performance Considerations

- Use `next/image` for all images with proper optimization
- Implement intersection observers for animations and lazy loading
- Use `npm run analyze` to monitor bundle size
- Lazy load components that are not immediately visible
- Optimize API calls and data fetching patterns