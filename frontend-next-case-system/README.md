# Case Management System - Frontend

## Architecture Decisions

### Why Next.js App Router?

I chose the App Router (instead of Pages Router) because:

- It's the modern way to build Next.js apps
- File-based routing makes the structure easy to understand
- Better performance with built-in optimizations
- Recommended by Next.js for new projects

### Why Client-Side Rendering?

All pages use `'use client'` because:

- We need authentication state managed in the browser
- Forms and buttons need to be interactive
- The app fetches data based on user actions
- Simpler for an app like this where everything requires login

### How Authentication Works

**HTTP-only cookies** store the session token because:

- JavaScript can't access it, so it's protected from XSS attacks
- The browser automatically includes it with every request
- More secure than storing tokens in localStorage
- Industry standard for web applications

**Role-based UI:**

- The backend enforces all security (who can do what)
- The frontend just hides/shows buttons based on your role
- Makes the UI cleaner and easier to use
- Not a security feature, just user experience

### What I Would Improve

**With more time I would add:**

- Loading skeletons instead of spinners
- Toast notifications for success/error messages
- Confirmation dialogs before important actions
- Better mobile responsive design
- Real-time updates when cases change
- Ability to filter and sort the cases table
- Keyboard shortcuts for common actions
- Dark mode support

### Time Taken

Approximately **1 hour** to build the frontend, including:

- Setting up Next.js and Tailwind
- Building all the pages and components
- Connecting to the backend API
- Testing the user flows
- Polishing the UI and fixing bugs
