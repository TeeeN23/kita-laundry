# Laundry Management System - Frontend

A modern, responsive Next.js frontend for the comprehensive laundry management system with role-based dashboards and real-time features.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom components with Tailwind
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── customer/          # Customer dashboard & features
│   │   ├── admin/             # Admin dashboard & features
│   │   ├── branch/            # Branch manager dashboard
│   │   ├── support/           # Support agent dashboard
│   │   ├── center-admin/      # Center admin dashboard
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── providers.tsx      # App providers
│   ├── lib/
│   │   ├── api.ts             # API configuration & endpoints
│   │   └── utils.ts           # Utility functions
│   ├── store/
│   │   ├── authStore.ts       # Authentication state
│   │   └── appStore.ts        # Global app state
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # App constants
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 Features by Role

### Customer Portal
- ✅ Order placement with item selection
- ✅ Real-time order tracking
- ✅ Address management
- ✅ Order history and reordering
- ✅ Rating and reviews
- ✅ Notifications
- ✅ Profile management

### Admin Dashboard
- ✅ Order management and assignment
- ✅ Customer management
- ✅ Branch and logistics assignment
- ✅ Refund processing
- ✅ Analytics and reports
- ✅ Support ticket overview

### Branch Manager Interface
- ✅ Branch-specific order processing
- ✅ Staff management and assignment
- ✅ Inventory tracking
- ✅ Performance analytics
- ✅ Local operations management

### Support Agent Panel
- ✅ Ticket management system
- ✅ Customer communication
- ✅ Issue resolution tracking
- ✅ Escalation management
- ✅ Knowledge base access

### Center Admin Console
- ✅ System-wide control
- ✅ Branch management
- ✅ User role management
- ✅ Pricing configuration
- ✅ Advanced analytics
- ✅ System settings

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts

### Accessibility
- WCAG 2.1 compliant
- Keyboard navigation
- Screen reader support
- High contrast support

### Performance
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Bundle optimization

## 🔐 Authentication & Security

### Authentication Flow
- JWT-based authentication
- Role-based access control
- Automatic token refresh
- Secure route protection

### Security Features
- XSS protection
- CSRF protection
- Input validation
- Secure API communication

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }

/* Large Desktop */
@media (min-width: 1440px) { ... }
```

## 🔄 State Management

### Zustand Stores
- **authStore**: User authentication and profile
- **orderStore**: Order management state
- **notificationStore**: Real-time notifications
- **uiStore**: UI state and preferences

### React Query
- Server state management
- Automatic caching and synchronization
- Background updates
- Optimistic updates

## 🎯 Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint and Prettier configuration
- Consistent naming conventions
- Component composition patterns

### Component Structure
```tsx
// Component template
interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
}
```

### API Integration
```tsx
// Custom hook example
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => customerAPI.getOrders(),
  })
}
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Optional
NEXT_PUBLIC_APP_NAME=Laundry Management System
NEXT_PUBLIC_SUPPORT_EMAIL=support@laundry.com
```

## 🧪 Testing (Future Implementation)

```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📊 Performance Monitoring

- Core Web Vitals tracking
- Bundle size monitoring
- API response time tracking
- User interaction analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards
4. Write tests for new features
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

---

**Note**: This frontend is designed to work seamlessly with the backend API. Ensure the backend server is running before starting the frontend development server. 
