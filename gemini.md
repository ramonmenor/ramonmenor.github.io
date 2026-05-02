# Gemini/AI Agent Guidelines

## Tech Stack
- Framework: Astro (v4+)
- Styling: Tailwind CSS
- Content: Markdown, MDX, Astro standard components

## General Instructions
- Always prioritize semantic HTML.
- Component-driven architecture using Astro components (`.astro`).
- Use Tailwind CSS directly in classes. 
- Avoid writing raw CSS/`<style>` blocks unless absolutely necessary (e.g. for dynamic or very complex keyframe animations that Tailwind can't easily express, or complex pseudo elements).
- Use vibrant, modern, and dark-mode compatible designs. Prioritize visual excellence.
- Images from `public/` can directly be referenced at the root path, e.g. `/image.png`.

## Project Structure
- `src/layouts/`: Global page layouts (BaseLayout, etc.).
- `src/pages/`: File-based routing corresponding to the live site.
- `src/components/`: Reusable UI elements (Header, Footer, ToolCard, etc.).
- `src/content/`: Type-checked content collections for markdown posts.
- `src/styles/`: Global styles (e.g., `global.css` importing Tailwind).

## AI Workflow
- Read `README.md` and this `gemini.md` when starting any new task to gain project context.
- Before creating components, check if similar ones already exist in `src/components/`.
- Propose refactoring if you find code duplication.
