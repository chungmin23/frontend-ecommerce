# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce frontend application built with React 19, TypeScript, Vite, and Tailwind CSS. Connects to a Spring Boot backend API running at `http://localhost:8080/api`.

Backend repository: https://github.com/chungmin23/ecommerce

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Router Structure

The application uses **modular router pattern** with lazy loading:

- `src/router/root.tsx` - Main router with BasicLayout wrapper
- `src/router/todoRouter.tsx` - Todo module routes (nested under `/todo`)
- `src/router/productRouter.tsx` - Product module routes (nested under `/product`)

All routers use lazy loading with Suspense for code splitting. New feature modules should follow this pattern.

### API Layer Architecture

**Critical**: All API modules follow a strict naming convention aligned with backend endpoints:

1. **Centralized Axios Instance**: `src/api/axios.ts`
   - Base URL: `http://localhost:8080/api`
   - JWT token auto-injection from localStorage
   - 401 response interceptor for auth redirection

2. **API Module Pattern** (see `src/api/productApi.ts`, `cartApi.ts`, etc.):
   ```typescript
   import axiosInstance from './axios'

   const prefix = '/products' // Backend endpoint prefix

   export const getProductList = (params?: PageParam): Promise<{ data: PageResponseDTO<Product> }> => {
     return axiosInstance.get(`${prefix}/list`, { params })
   }
   ```

3. **Naming Conventions**:
   - `get{Entity}List` - List endpoints (paginated)
   - `get{Entity}` - Single entity retrieval
   - `create{Entity}` - POST operations
   - `update{Entity}` - PUT operations
   - `delete{Entity}` - DELETE operations

### Type System

**Global Types**: `src/types/global.d.ts` defines shared interfaces:
- `PageParam` - Pagination parameters (page, size)
- `PageResponseDTO<T>` - Standard paginated response structure from backend
- `PageRequestDTO` - Request pagination structure

**Domain Types**: Each domain has a dedicated `.d.ts` file:
- `product.d.ts` - Product entities (uses `pno`, `pname`, `pdesc`, `uploadFileNames`)
- `cart.d.ts` - Cart entities (uses `cino`, `pno`, `pname`, `qty`)
- `order.d.ts` - Order entities
- `coupon.d.ts` - Coupon entities
- `payment.d.ts` - Payment entities
- `todo.d.ts` - Todo entities (uses `tno`)

**Important**: Backend field naming uses abbreviated Korean conventions:
- `pno` = product number
- `pname` = product name
- `pdesc` = product description
- `cino` = cart item number
- `tno` = todo number
- `ono` = order number

### State Management

Two-tier state approach:

1. **Zustand with Persistence** (`src/lib/`):
   - `cart-store.ts` - Client-side cart state (localStorage)
   - `auth-store.ts` - Authentication state (currently mock implementation)

2. **Server State**: Component-level using async/await with API calls
   - No React Query or SWR currently implemented
   - Direct API calls in useEffect hooks

**Note**: There's duplication between Zustand cart store and backend cart API. The localStorage cart is used for cart count updates via `window.dispatchEvent(new Event('cartUpdated'))`.

### Path Aliases

Vite configured with `@` alias pointing to `src/`:
```typescript
import { getProductList } from '@/api/productApi'
```

## Backend Integration

### Authentication
- JWT tokens stored in `localStorage.getItem('token')`
- User email stored in `localStorage.getItem('userEmail')`
- Used for cart and order operations

### API Response Structure

Standard paginated response:
```typescript
{
  dtoList: T[],
  pageNumList: number[],
  pageRequestDTO: { page: number, size: number },
  prev: boolean,
  next: boolean,
  totalCount: number,
  prevPage: number,
  nextPage: number,
  totalPage: number,
  current: number
}
```

### Image Handling
Product images retrieved via `getProductImage(fileName)` which constructs URLs like:
`http://localhost:8080/api/products/view/${fileName}`

## Key Features

### Products
- List with pagination
- Detail view with image gallery
- AI-powered recommendations (`/product/recommend`) using Spring AI with RAG

### Shopping Cart
- Backend cart API (`cartApi.ts`) synchronized with localStorage
- `changeCartItem()` for add/update operations
- Custom event `cartUpdated` for UI synchronization

### Orders
- Multi-step flow: Cart → Order → Payment
- Coupon application during checkout
- Order status tracking

### Coupons
- Active coupon listing
- Coupon issuance
- Application at checkout

## Adding New Features

### New API Module
1. Create `src/api/{domain}Api.ts`
2. Import `axiosInstance` from `./axios`
3. Define `prefix` matching backend endpoint
4. Follow naming convention: `get{Entity}List`, `get{Entity}`, `create{Entity}`, etc.
5. Add return type annotations using domain types

### New Router Module
1. Create `src/router/{module}Router.tsx`
2. Use lazy loading with Suspense
3. Return RouteObject or router config
4. Import and integrate in `src/router/root.tsx`

### New Type Definition
1. For domain-specific types: `src/types/{domain}.d.ts`
2. Use interface (not type) for global declarations
3. Match backend field names exactly (including Korean abbreviations)

## Common Pitfalls

1. **Type Mismatches**: Backend uses `pno`/`pname`/etc., not `id`/`name`/`description`
2. **Cart Synchronization**: Remember to dispatch `cartUpdated` event after cart modifications
3. **Auth Mock**: `auth-store.ts` contains mock implementation - needs real API integration
4. **Lazy Loading**: All page components must be wrapped in Suspense with fallback
