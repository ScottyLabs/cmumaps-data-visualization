// import {
//   ClerkLoaded,
//   ClerkProvider,
//   RedirectToSignIn,
//   useUser,
// } from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";
import { StrictMode } from "react";

// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { BrowserRouter, Outlet, Route, Routes } from "react-router";

// import "./index.css";
// import env from "./env";
// import FloorPage from "./pages/FloorPage";
// import Home from "./pages/Home";
// import { USE_STRICT_MODE } from "./settings";
// import { store } from "./store/store";

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

// const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!PUBLISHABLE_KEY) {
//   throw new Error("Add your Clerk Publishable Key to the .env file");
// }

// const ProtectedRoute = () => {
//   const { isSignedIn } = useUser();

//   if (!isSignedIn) {
//     return <RedirectToSignIn />;
//   }

//   return <Outlet />;
// };

// const AppContent = () => (
//   <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
//     <ClerkLoaded>
//       <BrowserRouter>
//         <Provider store={store}>
//           <Routes>
//             <Route element={<ProtectedRoute />}>
//               <Route index element={<Home />} />
//               <Route path=":floorCode" element={<FloorPage />} />
//             </Route>
//           </Routes>
//         </Provider>
//       </BrowserRouter>
//     </ClerkLoaded>
//   </ClerkProvider>
// );

// createRoot(document.getElementById("root") as HTMLElement).render(
//   USE_STRICT_MODE ? (
//     <StrictMode>
//       <AppContent />
//     </StrictMode>
//   ) : (
//     <AppContent />
//   ),
// );

import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
