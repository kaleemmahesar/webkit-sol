# Mock Subscription System

A complete frontend-only mock subscription system for showcasing small business software solutions. This demo includes all the functionality needed to demonstrate a subscription flow without requiring a backend or database.

## Features

- **Home Page**: Browse available software solutions
- **Pricing Page**: Compare subscription plans for each solution
- **Authentication**: Login/Signup functionality with form validation
- **Checkout**: Simulated payment process
- **Dashboard**: View active subscriptions and account information
- **Subscription Management**: Automatic status updates based on billing dates
- **Notifications**: Alerts for upcoming subscription expirations

## Technologies Used

- React with Vite
- Redux Toolkit for state management
- React Router for navigation
- Formik & Yup for form handling and validation
- Tailwind CSS for styling
- react-toastify for notifications
- Bootstrap for UI components

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components for each route
├── store/              # Redux store and slices
├── utils/              # Utility functions
├── data/               # Mock data (if needed)
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Data Structure

The system uses mock data structures that can easily be connected to a WordPress backend in the future:

### User Data
```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
}
```

### Product Data
```javascript
{
  id: 1,
  name: "Inventory Manager Pro",
  description: "Complete inventory tracking solution",
  thumbnail: "📦",
  startingPrice: 20,
  plans: [
    {
      id: "basic-monthly",
      name: "Basic",
      price: 20,
      period: "monthly",
      features: [...]
    }
  ]
}
```

### Subscription Data
```javascript
{
  id: 1,
  userId: 1,
  product: "Inventory Manager Pro",
  plan: { /* plan details */ },
  startDate: "2025-10-01",
  nextBillingDate: "2025-11-01",
  status: "Active"
}
```

## Future WordPress Integration

The data structures are designed to be compatible with WordPress REST APIs. The Redux store can be easily replaced with API calls to a WordPress backend when ready.

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode.
Open http://localhost:5173 to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run serve`
Preview the production build locally.