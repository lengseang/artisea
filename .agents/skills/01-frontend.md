# Frontend & UI Guidelines

## 1. Core Frameworks
- **Next.js:** Prefer App Router. Ensure server components are used where appropriate for SEO and initial load speed.
- **Tailwind CSS:** Use Tailwind for styling. Keep utility classes organized. Use Vanilla CSS only for complex custom animations/controls.
- **TypeScript:** Strict typing is required. Define shared interfaces in the `types/` folder.

## 2. UI/UX Aesthetics
- **Premium Design:** Create an immersive, distraction-free environment.
- **Interactivity:** Use micro-animations, hover states, and smooth transitions to make the site feel alive.
- **Responsive:** Ensure mobile-first development but maintain a high-quality desktop writing experience.

## 3. Editor Implementation
- The writing interface should feel "native".
- Use solid frameworks like Tiptap or Lexical for the rich-text editor to ensure cross-browser stability.
- Ensure proper sanitization to prevent XSS.
