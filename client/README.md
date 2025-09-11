# React Frontend Client 2025

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-teal?logo=tailwindcss" alt="Tailwind CSS" />
</p>

A cutting-edge React frontend application showcasing modern development practices with TypeScript, advanced state management, and real-time capabilities. Built for 2025 with the latest React 19 features and best-in-class developer experience.

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with automatic token refresh
- Secure login, registration, and logout flows
- Protected routes with authentication guards
- Profile management with avatar uploads
- Persistent authentication state

### 📝 **Todo Management**
- Full CRUD operations with optimistic updates
- Advanced filtering (all, initial, in-progress, completed, cancelled)
- Real-time synchronization across browser tabs
- Drag-and-drop reordering (coming soon)
- Bulk operations and batch updates

### 💬 **Real-time Chat**
- WebSocket-based instant messaging
- Multiple chat rooms support
- Emoji picker integration
- File sharing capabilities
- Message history and notifications

### 🎨 **Modern UI/UX**
- Responsive design with mobile-first approach
- Dark/light theme support with system preference detection
- Accessible components following WCAG guidelines
- Smooth animations and micro-interactions
- Loading states and error boundaries

### 🚀 **Performance & Developer Experience**
- Automatic code splitting and lazy loading
- Optimistic UI updates for instant feedback
- Background data synchronization
- Comprehensive error handling
- Hot module replacement for fast development

## 🛠️ Technology Stack

### **Core Framework**
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Advanced type safety and IntelliSense
- **Vite 6.0** - Lightning-fast build tool and dev server

### **Routing & State Management**
- **TanStack Router** - Type-safe routing with search params
- **TanStack Query** - Powerful server state management
- **Zustand** - Lightweight client state management
- **React Hook Form** - Performant form handling

### **Styling & UI**
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons
- **next-themes** - Theme switching with system preference

### **Development & Testing**
- **Vitest** - Fast unit testing framework
- **Testing Library** - Simple and complete testing utilities
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript strict mode** - Maximum type safety

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Package Manager**: Bun (recommended), npm, or yarn
- **Backend Server**: Running on `http://localhost:3000`

### Quick Setup

1. **Install dependencies**:
```bash
# Using Bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install
```

2. **Environment configuration**:
```bash
# Copy environment template
cp .env.example .env
```

3. **Configure environment variables**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000

# Application Settings
VITE_APP_NAME=React Todo & Chat App
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern React application with real-time features

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

4. **Start development server**:
```bash
# Using Bun
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

5. **Access the application**:
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api-docs

## 📁 Project Architecture

```
src/
├── 🧩 components/              # Reusable UI Components
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx         # Button variants
│   │   ├── input.tsx          # Form inputs
│   │   ├── dialog.tsx         # Modal dialogs
│   │   ├── toast.tsx          # Notification toasts
│   │   └── ...                # Other UI primitives
│   ├── layout/                # Layout components
│   │   ├── Navigation.tsx     # Main navigation bar
│   │   ├── Sidebar.tsx        # Collapsible sidebar
│   │   ├── Header.tsx         # Page headers
│   │   └── Footer.tsx         # Site footer
│   ├── auth/                  # Authentication components
│   │   ├── AuthRequired.tsx   # Route protection
│   │   ├── LoginForm.tsx      # Login form
│   │   ├── RegisterForm.tsx   # Registration form
│   │   └── ProfileForm.tsx    # Profile editing
│   ├── todo/                  # Todo-specific components
│   │   ├── TodoList.tsx       # Todo list display
│   │   ├── TodoItem.tsx       # Individual todo item
│   │   ├── TodoForm.tsx       # Todo creation/editing
│   │   ├── TodoFilters.tsx    # Filtering controls
│   │   └── TodoStats.tsx      # Statistics display
│   └── chat/                  # Chat components
│       ├── ChatRoom.tsx       # Chat room interface
│       ├── MessageList.tsx    # Message display
│       ├── MessageInput.tsx   # Message composition
│       └── EmojiPicker.tsx    # Emoji selection
├── 🪝 hooks/                  # Custom React Hooks
│   ├── useAuth.ts             # Authentication state & actions
│   ├── useTodos.ts            # Todo CRUD operations
│   ├── useChat.ts             # Real-time chat functionality
│   ├── useLocalStorage.ts     # Local storage persistence
│   ├── useDebounce.ts         # Input debouncing
│   └── useWebSocket.ts        # WebSocket connection
├── 📚 lib/                    # Utility Libraries
│   ├── config.ts              # Application configuration
│   ├── http-client.ts         # Axios HTTP client setup
│   ├── query-client.ts        # TanStack Query configuration
│   ├── router.ts              # TanStack Router setup
│   ├── auth.ts                # Authentication utilities
│   ├── validation.ts          # Zod schemas
│   ├── utils.ts               # General utilities
│   └── constants.ts           # Application constants
├── 🛣️ routes/                 # Page Components & Routing
│   ├── __root.tsx             # Root layout component
│   ├── index.tsx              # Home/dashboard page
│   ├── auth/                  # Authentication pages
│   │   ├── login.tsx          # Login page
│   │   ├── register.tsx       # Registration page
│   │   └── profile.tsx        # User profile page
│   ├── todos/                 # Todo management pages
│   │   ├── index.tsx          # Todo list page
│   │   └── $todoId.tsx        # Todo detail page
│   └── chat/                  # Chat pages
│       ├── index.tsx          # Chat rooms list
│       └── $roomId.tsx        # Individual chat room
├── 🔧 services/               # API Service Layer
│   ├── api.ts                 # Base API configuration
│   ├── auth.service.ts        # Authentication endpoints
│   ├── todo.service.ts        # Todo CRUD endpoints
│   ├── chat.service.ts        # Chat API endpoints
│   ├── upload.service.ts      # File upload handling
│   └── websocket.service.ts   # WebSocket management
├── 🗄️ stores/                 # State Management
│   ├── authStore.ts           # Authentication state
│   ├── todoStore.ts           # Todo client state
│   ├── chatStore.ts           # Chat state management
│   ├── themeStore.ts          # Theme preferences
│   └── notificationStore.ts   # Notification state
├── 📝 types/                  # TypeScript Definitions
│   ├── api.ts                 # API response types
│   ├── auth.ts                # Authentication types
│   ├── todo.ts                # Todo entity types
│   ├── chat.ts                # Chat message types
│   └── common.ts              # Shared type definitions
├── 🎨 styles/                 # Styling
│   ├── globals.css            # Global styles & Tailwind
│   ├── components.css         # Component-specific styles
│   └── themes.css             # Theme variables
├── 🧪 __tests__/              # Test Files
│   ├── components/            # Component tests
│   ├── hooks/                 # Hook tests
│   ├── services/              # Service tests
│   ├── utils/                 # Utility tests
│   └── setup.ts               # Test configuration
├── 📄 main.tsx                # Application entry point
└── 🌍 vite-env.d.ts           # Vite environment types
```

## 🔗 API Integration

### Backend Communication
The client seamlessly integrates with the TypeScript backend using modern patterns:

- **🔄 Automatic Token Refresh**: JWT tokens refresh transparently
- **🛡️ Request Interceptors**: Automatic authentication headers
- **⚡ Optimistic Updates**: Instant UI feedback with rollback on errors
- **📦 Smart Caching**: Intelligent data caching with TanStack Query
- **🔒 Type Safety**: End-to-end type safety with shared DTOs
- **🚨 Error Handling**: Centralized error handling with user-friendly messages
- **🔄 Retry Logic**: Automatic retry for failed requests
- **📊 Loading States**: Comprehensive loading and error states

### Real-time Features
- **WebSocket Connection**: Persistent connection for real-time updates
- **Auto-reconnection**: Handles connection drops gracefully
- **Message Queuing**: Queues messages during disconnection
- **Presence Indicators**: Shows online/offline status

## 📜 Available Scripts

### Development
```bash
npm run dev              # Start development server with HMR
npm run dev:host         # Start dev server accessible on network
npm run type-check       # Run TypeScript type checking
```

### Building & Preview
```bash
npm run build            # Build optimized production bundle
npm run preview          # Preview production build locally
npm run build:analyze    # Analyze bundle size and dependencies
```

### Testing
```bash
npm run test             # Run tests in watch mode
npm run test:ci          # Run tests once (CI mode)
npm run test:coverage    # Generate coverage report
npm run test:ui          # Run tests with UI interface
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run validate         # Run type-check, lint, and tests
```

### Maintenance
```bash
npm run clean            # Clean build artifacts
npm run reinstall        # Clean reinstall dependencies
```

## ⚙️ Environment Configuration

### Required Variables
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` | `https://api.example.com/api` |
| `VITE_WS_URL` | WebSocket server URL | `http://localhost:3000` | `wss://api.example.com` |

### Optional Variables
| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `VITE_APP_NAME` | Application display name | `React Todo & Chat App` | Any string |
| `VITE_APP_VERSION` | Application version | `1.0.0` | Semantic version |
| `VITE_APP_DESCRIPTION` | App description | `Modern React application...` | Any string |
| `VITE_ENABLE_CHAT` | Enable chat features | `true` | `true` \| `false` |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notifications | `true` | `true` \| `false` |
| `VITE_ENABLE_DARK_MODE` | Enable dark mode | `true` | `true` \| `false` |

### Environment Files
```bash
# Development
.env.development

# Production
.env.production

# Local overrides (gitignored)
.env.local
```

## 🔐 Authentication Flow

### Secure Authentication Process
1. **Login**: User submits email/password credentials
2. **Token Generation**: Backend validates and returns JWT access + refresh tokens
3. **Secure Storage**: Tokens stored in localStorage with Zustand persistence
4. **Automatic Headers**: HTTP client adds Authorization header to all requests
5. **Token Refresh**: On 401 errors, client automatically attempts token refresh
6. **Graceful Logout**: On refresh failure, user is redirected to login with clear state

### Security Features
- **Token Expiration**: Short-lived access tokens (1 hour)
- **Refresh Rotation**: Refresh tokens rotate on each use
- **Automatic Cleanup**: Tokens cleared on logout or expiration
- **CSRF Protection**: SameSite cookie attributes
- **XSS Prevention**: Secure token storage practices

## ✨ Feature Highlights

### 📝 Todo Management
- ✅ **CRUD Operations**: Create, read, update, delete todos
- ✅ **Status Management**: Initial → In Progress → Completed/Cancelled
- ✅ **Advanced Filtering**: Filter by status, date, priority
- ✅ **Smart Sorting**: Sort by date, title, status, or priority
- ✅ **Bulk Operations**: Select and modify multiple todos
- ✅ **Real-time Sync**: Changes sync across browser tabs
- ✅ **Optimistic Updates**: Instant UI feedback with error rollback
- ✅ **Form Validation**: Client-side validation with Zod schemas
- ✅ **Character Limits**: Title (100 chars), description (500 chars)
- ✅ **Loading States**: Skeleton loaders and progress indicators

### 💬 Chat Features
- ✅ **Real-time Messaging**: Instant message delivery via WebSocket
- ✅ **Multiple Rooms**: Create and join different chat rooms
- ✅ **Emoji Support**: Rich emoji picker with categories
- ✅ **File Sharing**: Upload and share images/documents
- ✅ **Message History**: Persistent message storage
- ✅ **Typing Indicators**: See when others are typing
- ✅ **Online Presence**: User online/offline status
- ✅ **Message Reactions**: React to messages with emojis

### 🎨 UI/UX Features
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Dark/Light Theme**: System preference detection + manual toggle
- ✅ **Accessibility**: WCAG 2.1 AA compliant components
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **Loading States**: Skeleton loaders and progress indicators
- ✅ **Error Boundaries**: Graceful error handling and recovery
- ✅ **Toast Notifications**: Success, error, and info messages
- ✅ **Smooth Animations**: Micro-interactions and transitions

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing
- **Visual Tests**: Component visual regression testing

### Testing Tools
- **Vitest**: Fast unit test runner
- **Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: E2E testing framework

## 🤝 Contributing

### Development Setup
1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Start** development: `npm run dev`
5. **Create** feature branch: `git checkout -b feature/new-feature`

### Code Standards
- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write tests for new features
- Follow conventional commit messages
- Maintain accessibility standards

### Pull Request Process
1. **Test** your changes thoroughly
2. **Update** documentation if needed
3. **Run** `npm run validate` to ensure quality
4. **Submit** PR with clear description
5. **Respond** to review feedback

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

<p align="center">
  <strong>Built with modern React practices for 2025 🚀</strong>
</p>
