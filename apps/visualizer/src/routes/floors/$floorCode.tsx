import { createFileRoute } from "@tanstack/react-router";

import MyToastContainer from "../../components/shared/MyToastContainer";
import FloorSwitcher from "../../components/ui-layout/FloorSwitcher";
import HelpInfo from "../../components/ui-layout/HelpInfo";
import LiveUserCount from "../../components/ui-layout/LiveUserCount";
import MainDisplay from "../../components/ui-layout/MainDisplay";
import ModeDisplay from "../../components/ui-layout/ModeDisplay";
import NavBar from "../../components/ui-layout/NavBar";

export const Route = createFileRoute("/floors/$floorCode")({
  component: Floor,
});

function Floor() {
  const { floorCode } = Route.useParams();
  return (
    <>
      <NavBar floorCode={floorCode} />
      <LiveUserCount />
      <MainDisplay floorCode={floorCode} />
      <ModeDisplay />
      <FloorSwitcher floorCode={floorCode} />
      <HelpInfo />
      <MyToastContainer />
    </>
  );
}

export default Floor;
