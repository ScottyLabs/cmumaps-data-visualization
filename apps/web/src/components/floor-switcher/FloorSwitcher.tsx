import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getBuildingsQueryOptions } from "@/api/apiClient";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import FloorSwitcherDisplay from "./FloorSwitcherDisplay";
import FloorSwitcherDisplayMobile from "./FloorSwitcherDisplayMobile";

/**
 * This component determines if the floor switcher should be shown.
 */
const FloorSwitcher = () => {
  // Library hooks
  const { isSignedIn } = useUser();
  const isMobile = useIsMobile();

  // Global states
  const floor = useBoundStore((state) => state.focusedFloor);
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);

  // Query data
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  // Custom hooks
  const { isCardOpen } = useLocationParams();

  // Don't show the floor switcher in mobile
  // if either the card is open or the search is open
  if (isMobile && (isCardOpen || isSearchOpen)) {
    return <></>;
  }

  // Don't show the floor switcher if the user is not signed in
  if (!isSignedIn) {
    return <></>;
  }

  // Don't show the floor switcher if there is no focused floor
  if (!floor) {
    return <></>;
  }

  // Don't show the floor switcher if building data is not loaded
  if (!buildings) {
    return <></>;
  }

  // Don't show the floor switcher if invalid building code
  const building = buildings[floor.buildingCode];
  if (!building) {
    return <></>;
  }

  if (isMobile) {
    return (
      <FloorSwitcherDisplayMobile
        building={building}
        initialFloorLevel={floor.level}
      />
    );
  }

  return (
    <div className="-translate-x-1/2 fixed bottom-2 left-1/2 w-fit px-2">
      <FloorSwitcherDisplay building={building} floor={floor} />
    </div>
  );
};

export default FloorSwitcher;
