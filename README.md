# HKOTISK System Frontend

A management system frontend built with React, TypeScript, and shadcn/ui for Hong Kong Tea Ordering and Stock Information System (HKOTISK).

## Features

- **User Roles**:
  - Staff: Manage products, monitor inventory, and handle orders
  - Students: Browse products, manage cart, and place orders

- **Product Management**:
  - Add, edit, and delete products
  - Real-time inventory tracking
  - Stock alerts and monitoring

- **Order System**:
  - Cart management
  - Order processing
  - Order status tracking

- **Staff Dashboard**:
  - Inventory monitoring
  - Order management interface
  - Sales analytics

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm (comes with Node.js)

Additionally, you'll need:
- Access to the HKOTISK backend API

## Getting Started

Follow these steps to set up the project locally:

1. Create a `.env` file in the project root with:
```env
VITE_BASE_URL=your_backend_api_url   # Example: http://localhost:8080/api
```

```bash
# Clone the repository
git clone https://github.com/hkotisk/hkotisk-system.git

# Navigate to the project directory
cd hkotisk-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will start at `http://localhost:5173` by default.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run build:dev` - Creates a development build
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check code quality

## API Integration

The frontend communicates with the backend API using authenticated endpoints. Key features include:

- **Authentication**: Uses Bearer token authentication
- **Cart Management**: Fetches and updates user cart data
- **Product Management**: Handles product listing and updates
- **Order Management**: Manages order processing and tracking

Example API usage:
```typescript
// Fetching products with authentication handling
const fetchProducts = async (authToken) => {
  try {
    const response = await axios.get(`${baseUrl}/user/product`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response?.data?.oblist || response?.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Handle authentication errors
    if (error.response?.status === 403) {
      sessionStorage.removeItem('token');
      // Redirect to login page
    }
    throw error;
  }
};

// Fetching cart data
const fetchCart = async (authToken) => {
  try {
    const response = await axios.get(`${baseUrl}/user/cart`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data.oblist;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};
```

**Note**: All API requests require authentication. If a token expires or becomes invalid, the system will automatically redirect to the login page.

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui
- **Styling:** TailwindCSS
- **Form Handling:** React Hook Form + Zod
- **Data Fetching:** TanStack Query
- **Routing:** React Router DOM
- **Charts:** Recharts

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and shared code
├── pages/         # Page components
└── main.tsx       # Application entry point
```
