import { useUser } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import FloorSwitcher from "@/components/floor-switcher/FloorSwitcher";
import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import MyToastContainer from "@/components/ui-layout/MyToastContainer";
import IconsDisplay from "@/components/ui-layout/icons-display/IconsDisplay";

const queryClient = new QueryClient();

const App = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  // Identify PostHog user with Clerk ID
  const { user } = useUser();
  const posthog = usePostHog();
  useEffect(() => {
    if (user) {
      posthog?.identify(user.id);
    } else {
      posthog?.reset();
    }
  }, [posthog, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative h-dvh">
        <MapDisplay mapRef={mapRef} />
        <LoginModal />
        <IconsDisplay />
        <Toolbar mapRef={mapRef} />
        <FloorSwitcher />
        <MyToastContainer />
      </main>
    </QueryClientProvider>
  );
};

export default App;
