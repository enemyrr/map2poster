# Map2Poster

A web application for creating stylized map posters of any city. Search for a location, choose from 17 unique themes, customize the radius and aspect ratio, then export your poster as an image.

## Features

- **City Search**: Find any city worldwide with autocomplete
- **17 Themes**: Noir, Midnight Blue, Blueprint, Neon Cyberpunk, Japanese Ink, Sunset, Forest, Ocean, Vintage, Arctic, Copper, Lavender, Emerald, Rose Gold, Monochrome, Coral, and Mint
- **Customizable Radius**: Adjust how much of the map to display
- **Multiple Aspect Ratios**: Choose the perfect dimensions for your poster
- **Labels Toggle**: Show or hide map labels
- **Export**: Download your poster as a high-quality image
- **Shareable URLs**: Share your poster configuration via URL

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [MapLibre GL](https://maplibre.org/) for map rendering
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [html-to-image](https://github.com/bubkoo/html-to-image) for export
- [nuqs](https://nuqs.47ng.com/) for URL state management

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/map2poster.git
cd map2poster

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
