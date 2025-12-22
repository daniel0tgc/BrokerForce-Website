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
- **Google OAuth**: Secure user authentication with Google
- **Database Persistence**: PostgreSQL database for users, favorites, purchases, and offers

### ✅ Implemented Features

#### 1. Main Landing Page

- ✅ Large hero banner with search functionality
- ✅ Advanced search bar with type-ahead (address, city, ZIP code, county)
- ✅ Featured homes carousel (curated, promoted, random sorting)

#### 2. Search & Browse Experience

- ✅ **Dual View Modes**: Toggle between list view and Tinder-like swipe view
- ✅ **Filtering System**: Filter by price range, bedrooms, bathrooms, home type
- ✅ Search results page with responsive design (mobile-first approach)
- ✅ Swipe interface optimized for mobile devices

#### 3. Property Management

- ✅ **Liked Homes (Favorites)**: Save properties by swiping right or clicking like
- ✅ Favorites page with unlike functionality
- ✅ Property detail view with comprehensive information
- ✅ Image gallery with navigation
- ✅ Property information from MLS data structure

#### 4. User Authentication

- ✅ **Google OAuth Login**: Secure authentication via Google
- ✅ Session management with persistent login
- ✅ User profile display with avatar
- ✅ Logout functionality

#### 5. Buy Now Workflow

- ✅ **Representation Form**: Buyer representation agreement form
- ✅ **Payment Page**: Fixed fee ($299) + à la carte service options:
  - Property Walkthrough ($199)
  - Agent Video Walkthrough ($149)
  - Seller Concessions 90/10 Split ($99)
  - Additional Custom Features
- ✅ Payment confirmation page
- ✅ Workflow integration (representation → payment → confirmation)

#### 6. Standard Pages

- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Contact page
- ✅ About Us
- ✅ Help/FAQ/How it works

#### 7. Backend Infrastructure

- ✅ Authentication server (Express.js) with Google OAuth
- ✅ Session management
- ✅ CORS configuration for frontend-backend communication
- ✅ SimplyRETS API integration structure

### 🚧 Partial Implementation / Planned Features

#### Property Detail Enhancements

- ⚠️ **Google Maps Integration**: Map and street view (not yet implemented)
- ⚠️ **Video Support**: Video gallery (structure ready, needs integration)
- ⚠️ **Additional Action Buttons**: SELL NOW and SWAP NOW buttons (not yet implemented)

#### User Cabinet/Dashboard

- ⚠️ User dashboard with:
  - Saved Homes (favorites currently in separate page)
  - Completed Offers (not yet implemented)
  - Signed Documents (not yet implemented)
  - Payment History (not yet implemented)

#### Enhanced Buy Now Workflow

- ⚠️ **eSignature Integration**: DocuSign/HelloSign integration (placeholder ready)
- ⚠️ **Identity Verification**: Identity check integration (not yet implemented)
- ⚠️ **Property Financing Options**:
  - Cash payment flow (not yet implemented)
  - Loan application flow (not yet implemented)
  - Apply for loan option (not yet implemented)
- ⚠️ **Offer Agreement Form**: With eSignature integration (not yet implemented)
- ⚠️ **Offer Tracking**: Status updates (submitted → agent response) (not yet implemented)
- ⚠️ **Email Notifications**: After key steps (not yet implemented)

#### Authentication

- ⚠️ Facebook login (Google only currently implemented)

#### Backend Data Management

- ⚠️ **Scheduled MLS Data Sync**: Automated property data updates (not yet implemented)
- ⚠️ **Data Sanity Checks**: Error handling and logging (partially implemented)
- ⚠️ **Service Health Monitoring**: Backend monitoring (basic health check exists)

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend

- **Server**: Express.js (Node.js)
- **Authentication**: Passport.js with Google OAuth 2.0
- **Session Management**: Express-session with secure cookies
- **API Integration**: SimplyRETS API structure

### Data & Services

- **Property Data**: SimplyRETS API (structure ready, using demo/dummy data for development)
- **Payment Processing**: Structure ready (Stripe integration planned)
- **eSignature**: Structure ready (DocuSign/HelloSign integration planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (optional - will be installed automatically if Homebrew is available)
- Google OAuth credentials (for authentication)

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd BrokerForce-Website-1
   ```

2. **Run the complete setup script:**

   ```bash
   ./setup.sh
   ```

   This single script will:

   - ✅ Install all dependencies (pnpm, npm packages)
   - ✅ Set up environment files
   - ✅ Install and configure PostgreSQL (if Homebrew available)
   - ✅ Create database and initialize schema
   - ✅ Configure all necessary settings

3. **Configure Google OAuth** (required for login):

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID credentials
   - Add redirect URI: `http://localhost:3001/auth/google/callback`
   - Update `google-login-demo/.env`:
     ```env
     GOOGLE_CLIENT_ID=your_client_id_here
     GOOGLE_CLIENT_SECRET=your_client_secret_here
     JWT_SECRET=your_jwt_secret_here
     ```

4. **Start development servers:**

   ```bash
   ./start-servers.sh
   ```

   This will start:

   - 📱 **Frontend**: `http://localhost:5173` (React/Vite)
   - 🔐 **Backend**: `http://localhost:3001` (Auth server)

For detailed setup instructions, see [SETUP.md](./SETUP.md).
For production deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## MVP Specification Alignment

This section outlines the current implementation status against the provided MVP specifications.

### ✅ Implemented Features

#### 1. Main Page (`/`)

- Large banner
- Home search with type-ahead functionality
- Featured homes carousel (currently random, can be curated/promoted)

#### 2. Search Results Page (`/search`) & Tinder-like Swipe

- Users can toggle between list view and swipe view (responsive: swipe on mobile, list on desktop by default)
- Displays properties fitting search criteria
- Filtering by price, bedrooms, bathrooms, home type

#### 3. Liked Homes (`/favorites`)

- Available from the main page (via CartButton)
- Management of liked homes (view, unlike, clear all)
- **Database Integration**: Favorites are stored in PostgreSQL database

#### 4. Detailed View - Home Card (`/property/:id`)

- Information from MLS (via SimplyRETS API or dummy data)
- Image gallery
- **UI Placeholder**: Video section (ready for integration)
- **UI Placeholder**: Google Map and Street View (ready for integration)
- **UI Placeholder**: BUY NOW, SELL NOW, SWAP NOW buttons are present

#### 5. Standard Pages

- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)
- Contacts (`/contact`)
- About Us (`/about`)
- Help/FAQ/How it works (`/help`)

#### 6. User Cabinet Workflows (`/dashboard`)

- **User Login**: Google OAuth implemented (Facebook login pending)
- **User Dashboard**: Dashboard page showing:
  - Saved Homes count
  - Purchases count
  - Offers count
  - Documents count
  - Payments count
  - Recent Purchases list

#### 7. Buy Now Workflow (`/property/:id/representation`, `/property/:id/payment`, `/property/:id/confirmation`)

- User clicks "Buy Now" on Property Detail
- Checks if user is logged in, offers login/registration
- Representation form signing (placeholder for eSignature integration)
- Payment page: fixed fee + a la carte options
- Payment completion and confirmation page
- **Database Integration**: Purchase requests, representation data, and payment details are stored in PostgreSQL

#### 8. Backend Infrastructure

- Authentication server (Express.js) with Google OAuth
- Passport.js integration with PostgreSQL for user storage
- Session management with `sameSite` cookie configuration for cross-origin requests
- CORS configuration for frontend-backend communication
- SimplyRETS API integration structure
- **Database**: PostgreSQL database for users, favorites, purchases, offers, documents, payments
- **API Endpoints**: Dedicated API routes for favorites, purchases, offers, and dashboard data
- **JWT**: JWT authentication middleware implemented alongside sessions

### 🚧 Gaps Identified (Future Implementations)

#### Property Detail Enhancements

- **Google Maps Integration**: Full interactive map and street view
- **Video Support**: Integration with actual video content
- **Additional Action Buttons**: Implement the full workflows for SELL NOW and SWAP NOW

#### User Cabinet/Dashboard

- Detailed views for:
  - Completed Offers
  - Signed Documents
  - Payment History

#### Enhanced Buy Now Workflow

- **eSignature Integration**: Full integration with DocuSign/HelloSign
- **Identity Verification**: Integration with an identity check service
- **Property Financing Options**: Implement cash payment flow, loan application flow, and "apply for a loan" option
- **Offer Agreement Form**: Dynamic form population and eSignature integration
- **Offer Tracking**: Real-time status updates (submitted → agent response)
- **Email Notifications**: Automated emails after key steps (payment confirmation, offer submission)

#### Authentication

- Facebook login option

#### Backend Data Management

- **Scheduled MLS Data Sync**: Automated property data updates
- **Data Sanity Checks**: More robust error handling and logging
- **Service Health Monitoring**: Advanced backend monitoring

## 🗺️ Roadmap

The development will proceed in phases, prioritizing core MVP features and essential integrations.

### Phase 1: Core MVP Completion

- Implement Google Maps and video gallery on Property Detail page
- Complete the User Dashboard with detailed views for offers, documents, and payments
- Integrate a placeholder eSignature solution for the Representation Form and Offer Agreement

### Phase 2: Enhanced Workflows

- Implement property financing options (cash, loan application)
- Develop the Offer Tracking system
- Set up email notifications for key user actions

### Phase 3: Backend & Data Management

- Implement scheduled MLS data synchronization
- Enhance data sanity checks and logging
- Integrate advanced service health monitoring

### Phase 4: Production Readiness

- Implement robust security measures (e.g., PCI DSS compliance for payments if applicable)
- Optimize performance and scalability
- Ensure full compliance with legal and data privacy regulations

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **API Integration**: SimplyRETS API, Custom Backend API
- **Icons**: Lucide React

### Backend (Auth Server & API)

- **Framework**: Express.js with Node.js
- **Authentication**: Passport.js (Google OAuth 2.0), JWT
- **Session Management**: Express-session
- **Database**: PostgreSQL
- **ORM/Query Builder**: `pg` (Node.js PostgreSQL client)
- **Environment Variables**: `dotenv`
- **Development**: Nodemon

## 🚀 Deployment

The frontend is designed for static hosting (e.g., Netlify). The backend (auth server & API) requires a Node.js hosting environment (e.g., Railway, Heroku, Render).

For production deployment instructions, see [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md).

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide for development
- **[PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)** - Production deployment checklist
- **[POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)** - Detailed PostgreSQL setup (manual)
- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment variables reference
- **[GOOGLE_LOGIN_SETUP.md](./GOOGLE_LOGIN_SETUP.md)** - Google OAuth setup guide
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
