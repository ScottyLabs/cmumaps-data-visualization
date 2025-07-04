import {
  ClerkLoaded,
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import "./index.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import env from "./env";
import { routeTree } from "./routeTree.gen";
import { USE_STRICT_MODE } from "./settings";
import { store } from "./store/store";

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppContent = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <ClerkLoaded>
      <Provider store={store}>
        <SignedIn>
          <RouterProvider router={router} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Provider>
    </ClerkLoaded>
  </ClerkProvider>
);

// Render the app
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    USE_STRICT_MODE ? (
      <StrictMode>
        <AppContent />
      </StrictMode>
    ) : (
      <AppContent />
    ),
  );
}
