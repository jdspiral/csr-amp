# AMP CSR Portal

AMP CSR Portal is a customer service representative dashboard built with Next.js 15, Supabase, and TailwindCSS. It allows CSR agents to manage users, vehicles, subscriptions, and purchase history for AMP Car Wash memberships.

---

## 🚀 Features

- View, search, and edit users
- Edit or cancel user accounts
- Manage vehicles
- Transfer and manage subscriptions
- View purchase history for users
- Real-time updates after edits
- Error handling and alerts
- Modular and reusable components
- Supabase as backend + DB

---

## 🛠️ Tech Stack

- **Frontend:** Next.js App Router, TailwindCSS
- **Backend:** Supabase (PostgreSQL)
- **API:** REST via API Routes
- **Type Safety:** TypeScript
- **State Management:** React `useState`, `useEffect`, `useCallback`, `useMemo`
- **Deployment:** Vercel

---

## 🔍 Suggested Improvements

- Add proper authentication and role-based access
- Add pagination server-side
- Add ability to add/delete new vehicles
- Add ability to add/delete users
- Migrate to TanStack Query for better state handling as project grows
- Implement confirmation modals for destructive actions
- Optimize Supabase queries with indexes
- Introduce loading and error states per component
- Add CI/CD
- Proper testing suite
- Improved modularization of larger components

---

## 📁 Project Structure

```
app/
  api/             → API route handlers
  users/           → User pages
components/        → Reusable UI components
interfaces/        → TypeScript interfaces
lib/               → API helpers & Supabase config
public/            → Static assets
styles/            → Tailwind and globals
```
---

## 📄 License

MIT — feel free to use and adapt.