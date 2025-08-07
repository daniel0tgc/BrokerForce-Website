# BrokerForce Website

A modern real estate website built with React, TypeScript, and Tailwind CSS. The application integrates with SimplyRETS API to provide real property data and offers both list and swipe viewing modes.

## Features

- **Real Property Data**: Integration with SimplyRETS API for actual MLS data
- **Dual Viewing Modes**: List view for desktop and swipe view for mobile
- **Advanced Search**: Search by location, price, bedrooms, bathrooms, and property type
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Data Caching**: Efficient data fetching with React Query
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **API Integration**: SimplyRETS API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BrokerForce-Website-4
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your SimplyRETS API credentials:
```env
VITE_SIMPLYRETS_API_KEY=your_api_key_here
VITE_SIMPLYRETS_SECRET=your_secret_here
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## API Integration

### SimplyRETS Setup

1. Sign up for a SimplyRETS account at [simplyrets.com](https://simplyrets.com)
2. Get your API credentials from the dashboard
3. Add the credentials to your `.env.local` file

### Current Implementation

The application currently uses dummy data that matches the SimplyRETS API structure. To switch to real API data:

1. Uncomment the API calls in `src/services/propertyService.ts`
2. Comment out the dummy data methods
3. Ensure your API credentials are properly configured

### API Structure

The application is designed to work with SimplyRETS API and can easily be adapted for MLS data that uses the same structure. The data transformation layer handles:

- Property information mapping
- Image handling with fallbacks
- Property type categorization
- Search and filtering

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── PropertyCard.tsx
│   ├── SearchBar.tsx
│   └── SwipeCard.tsx
├── data/               # Static data and types
│   └── properties.ts   # Property interface
├── hooks/              # Custom React hooks
│   └── useProperties.ts # Property data fetching hooks
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── SearchResults.tsx
│   └── NotFound.tsx
├── services/           # API services
│   └── propertyService.ts # SimplyRETS integration
├── types/              # TypeScript type definitions
│   └── simplyrets.ts   # API types
└── lib/                # Utility functions
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Deployment

The application can be deployed to any static hosting service:

1. Build the application:
```bash
pnpm build
```

2. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
