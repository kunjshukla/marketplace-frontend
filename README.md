# NFT Marketplace Frontend

A Next.js-based frontend for a single-sale NFT marketplace with Google OAuth authentication, multi-currency payments, and modern UI.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🔐 Google OAuth 2.0 authentication
- 💳 Multi-currency support (INR/USD)
- 📱 Mobile-first responsive design
- 🌍 Internationalization support
- 📊 Analytics integration with Mixpanel
- ⚡ Real-time notifications via WebSocket
- 🎯 FOMO-driven UX with "Sold" and "Reserved" badges

## Tech Stack

- **Framework**: Next.js 14.2.9
- **Styling**: Tailwind CSS 3.4.13
- **HTTP Client**: Axios 1.7.7
- **State Management**: React Query
- **Internationalization**: i18next
- **Analytics**: Mixpanel
- **Testing**: Jest + Playwright
- **Node Version**: 22.x

## Quick Start

### Prerequisites

- Node.js 22.x (use NVM for version management)
- npm or pnpm

### Installation

1. **Install Node.js 22**:
   ```bash
   # Using NVM
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
   nvm install 22
   nvm use 22
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   ```

4. **Run development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**: http://localhost:3000

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/notifications
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
```

## Project Structure

```
src/
├── app/                 # Next.js 13+ app router
│   ├── page.tsx        # Home page (NFT listing)
│   ├── layout.tsx      # Root layout
│   ├── auth/           # Authentication pages
│   ├── profile/        # User profile pages
│   └── admin/          # Admin dashboard
├── components/         # Reusable components
│   ├── Navbar.tsx      # Navigation bar
│   ├── NFTCard.tsx     # NFT display card
│   ├── FilterBar.tsx   # Filter controls
│   └── modals/         # Modal components
├── lib/                # Utility libraries
│   ├── axios.js        # HTTP client setup
│   ├── analytics.js    # Mixpanel integration
│   └── i18n.js         # Internationalization
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── AnalyticsContext.tsx # Analytics tracking
└── public/             # Static assets
    ├── images/         # Images and icons
    └── locales/        # Translation files
```

## Key Components

### NFTCard
Displays individual NFT with:
- Image with lazy loading
- Price in INR/USD
- Status badges (Available/Reserved/Sold)
- Purchase button

### FilterBar
Advanced filtering options:
- Price range sliders
- Category selection
- Sort options
- Search functionality

### Authentication
- Google OAuth integration
- JWT token management
- User role handling (user/admin)

## API Integration

The frontend communicates with the FastAPI backend at `/api/*` endpoints:

- `GET /nfts` - List NFTs with pagination/filtering
- `POST /purchase/inr/{nft_id}` - Initiate INR purchase
- `POST /purchase/usd/{nft_id}` - Initiate USD purchase
- `GET /auth/user` - Get current user profile

## Testing

Run the test suite:

```bash
# Unit tests with Jest
npm run test

# Watch mode
npm run test:watch

# E2E tests with Playwright
npm run e2e

# E2E with UI
npm run e2e:ui
```

## Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Features in Detail

### Payment Flow

**INR Payments**:
1. User selects NFT and clicks "Purchase"
2. Form modal opens for user details
3. Backend generates UPI QR code
4. QR code emailed to user
5. Admin manually verifies payment
6. NFT marked as sold + PDF certificate sent

**USD Payments**:
1. User clicks "Purchase with PayPal"
2. Redirected to PayPal
3. Payment processed automatically
4. Webhook confirms payment
5. NFT marked as sold + PDF certificate sent

### Real-time Updates

- WebSocket connection for live NFT status updates
- Instant notification when NFTs are sold/reserved
- Admin notifications for new transactions

### Mobile Experience

- Responsive design works on all devices
- Touch-friendly interface
- Optimized images with lazy loading
- Progressive Web App (PWA) ready

## Troubleshooting

### Common Issues

1. **Build fails on Vercel**:
   - Ensure Node.js version is set to 22.x in `package.json`
   - Check all environment variables are set
   - Verify API URL is accessible

2. **Images not loading**:
   - Update `next.config.js` image domains
   - Check image URLs are accessible
   - Verify CORS settings on image hosts

3. **Authentication not working**:
   - Verify Google OAuth credentials
   - Check redirect URI matches exactly
   - Ensure API backend is running

### Performance Optimization

- Images are optimized with Next.js Image component
- API responses are cached with React Query
- Bundle size optimized with tree shaking
- CSS is minified and purged

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.
