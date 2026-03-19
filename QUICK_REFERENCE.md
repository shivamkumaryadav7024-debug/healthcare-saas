# HealthHub - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
# 4. Login with: demo@healthhub.com / demo123456
```

Done! 🎉

---

## 📋 File Structure Quick Reference

### Components (`src/components/`)
| File | Purpose |
|------|---------|
| `Navbar.tsx` | Top navigation bar |
| `ProtectedRoute.tsx` | Route protection wrapper |
| `Button.tsx` | Reusable button |
| `Card.tsx` | Card layout |
| `Loading.tsx` | Loading spinner |
| `ErrorAlert.tsx` | Error messages |
| `PatientGrid.tsx` | Grid view for patients |
| `PatientList.tsx` | Table view for patients |
| `NotificationCenter.tsx` | Toast notifications |

### Pages (`src/pages/`)
| File | Route | Purpose |
|------|-------|---------|
| `LoginPage.tsx` | `/login` | Authentication |
| `DashboardPage.tsx` | `/dashboard` | Overview |
| `PatientsPage.tsx` | `/patients` | Patient list |
| `PatientDetailsPage.tsx` | `/patients/:id` | Patient details |
| `AnalyticsPage.tsx` | `/analytics` | Analytics |

### Store (`src/store/`)
| File | Purpose |
|------|---------|
| `index.ts` | Store configuration |
| `authSlice.ts` | Auth state |
| `patientSlice.ts` | Patient state |
| `notificationSlice.ts` | Notification state |

### Services (`src/services/`)
| File | Purpose |
|------|---------|
| `firebase.ts` | Firebase setup |

---

## 🔑 Key Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm audit fix        # Fix vulnerabilities
```

---

## 🎯 Authentication Flow

```
User visits /login
         ↓
Enters email/password
         ↓
Firebase validates
         ↓
Sets user in Redux
         ↓
Redirects to /dashboard
         ↓
ProtectedRoute checks for user
         ↓
Allows access to protected routes
```

---

## 🧩 Component Usage Examples

### Button
```tsx
<Button variant="primary" size="lg" onClick={() => {}}>
  Click me
</Button>
```

### Card
```tsx
<Card title="Total Patients" value={25} icon="👥" />
```

### Loading
```tsx
<Loading message="Loading patients..." />
```

### ErrorAlert
```tsx
<ErrorAlert 
  message="Something went wrong" 
  onDismiss={() => setError(null)}
/>
```

---

## 🔄 Redux Usage Examples

### Dispatch Action
```tsx
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addNotification } from '@/store/notificationSlice';

const dispatch = useAppDispatch();
dispatch(addNotification({
  title: 'Success',
  message: 'Action completed',
  type: 'success',
  read: false
}));
```

### Access State
```tsx
import { useAppSelector } from '@/hooks/useAppSelector';

const { user } = useAppSelector(state => state.auth);
const { patients } = useAppSelector(state => state.patient);
```

---

## 🎨 Styling Guide

### Tailwind Classes Used
- **Spacing**: `px-4`, `py-2`, `mb-4`, etc.
- **Colors**: `bg-indigo-600`, `text-gray-900`, etc.
- **Layouts**: `flex`, `grid`, `grid-cols-2`, etc.
- **Responsive**: `md:grid-cols-2`, `lg:grid-cols-3`, etc.

### Custom Classes (in index.css)
```css
.btn-primary     /* Primary button */
.btn-secondary   /* Secondary button */
.card            /* Card styling */
.input-field     /* Input styling */
.badge           /* Badge styling */
.badge-success   /* Success badge */
```

---

## 🔐 Environment Variables

Essential for production:
```env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_AUTH_DOMAIN
```

Create `.env.local` from `.env.example`

---

## 📊 State Shape

```typescript
{
  auth: {
    user: { uid, email, displayName },
    loading: boolean,
    error: string | null
  },
  patient: {
    patients: Patient[],
    selectedPatient: Patient | null,
    loading: boolean,
    error: string | null
  },
  notification: {
    notifications: Notification[],
    loading: boolean,
    error: string | null
  }
}
```

---

## 🧪 Common Tasks

### Add New Patient
```tsx
dispatch(addPatient({
  id: '6',
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
}));
```

### Show Notification
```tsx
dispatch(addNotification({
  title: 'Success',
  message: 'Patient added',
  type: 'success',
  read: false
}));
```

### Navigate to Patient
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(`/patients/${patientId}`);
```

---

## 🐛 Debugging Tips

### Redux DevTools
1. Install Redux DevTools browser extension
2. Open DevTools → Redux
3. Inspect state and actions

### React DevTools
1. Install React DevTools extension
2. Inspect components
3. Check props and state

### Network Tab
1. Open DevTools → Network
2. Monitor API calls
3. Check response status

### Console Errors
1. Open DevTools → Console
2. Check for errors
3. Fix issues accordingly

---

## 📱 Responsive Breakpoints

```javascript
sm: 640px   // Small devices
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Large screens
```

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## 🚀 Deployment Checklist

- [ ] All dependencies installed
- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint warnings: `npm run lint`
- [ ] Firebase credentials configured
- [ ] .env.local created with variables
- [ ] Dev server runs successfully
- [ ] Test all pages work
- [ ] Test authentication flow
- [ ] Push to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Test live deployment

---

## 📚 File Sizes

| File | Size |
|------|------|
| JavaScript Bundle | 396 KB |
| CSS Bundle | 17 KB |
| Total (gzipped) | 105 KB |

---

## 🎯 Feature Status

| Feature | Status | File |
|---------|--------|------|
| Login | ✅ | LoginPage.tsx |
| Dashboard | ✅ | DashboardPage.tsx |
| Patients | ✅ | PatientsPage.tsx |
| Patient Details | ✅ | PatientDetailsPage.tsx |
| Analytics | ✅ | AnalyticsPage.tsx |
| Grid/List Toggle | ✅ | PatientGrid/List.tsx |
| Notifications | ✅ | NotificationCenter.tsx |
| Service Worker | ✅ | sw.js |
| Auth Protection | ✅ | ProtectedRoute.tsx |
| State Management | ✅ | store/ |

---

## 🔗 Important Links

- **Dev Server**: http://localhost:5173
- **Firebase Console**: https://console.firebase.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com

---

## 💡 Tips & Tricks

1. **Clear Cache**: `Ctrl+Shift+Delete` (DevTools)
2. **Force Reload**: `Ctrl+Shift+R`
3. **Search Files**: `Ctrl+P` (VS Code)
4. **Quick Format**: `Shift+Alt+F` (VS Code)
5. **Component Extraction**: Select code → Extract to new file

---

## ⚡ Performance Tips

1. Use lazy loading for components
2. Memoize expensive calculations
3. Optimize images
4. Split code into chunks
5. Monitor bundle size

---

## 🔒 Security Reminders

1. Never commit `.env.local`
2. Use HTTPS in production
3. Validate user input
4. Protect sensitive routes
5. Keep dependencies updated

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## Completed Features Checklist

- [x] Project structure setup
- [x] Firebase authentication
- [x] Redux state management
- [x] Login page
- [x] Dashboard page
- [x] Patients page with Grid/List toggle
- [x] Patient details page
- [x] Analytics page
- [x] Service Worker & notifications
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Mock data
- [x] Type safety
- [x] Component reusability

---

**Ready to build? Start with `npm run dev` 🚀**
