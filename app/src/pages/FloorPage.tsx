import { useParams, Navigate } from "react-router";

import { ErrorCode } from "../../../shared/errorCode";
import FloorSwitcher from "../components/layouts/FloorSwitcher";
import HelpInfo from "../components/layouts/HelpInfo";
import MainDisplay from "../components/layouts/MainDisplay";
import ModeDisplay from "../components/layouts/ModeDisplay";
import NavBar from "../components/layouts/NavBar";
import Loader from "../components/shared/Loader";
import MyToastContainer from "../components/shared/MyToastContainer";
import { useGetDefaultFloorQuery } from "../store/api/buildingApiSlice";

const FloorPage = () => {
  const { floorCode } = useParams();

  // Skip the query if don't need to retrieve the default floor
  const { data: defaultFloor, error } = useGetDefaultFloorQuery(
    floorCode || "",
    { skip: !floorCode || floorCode.split("-").length === 2 },
  );

  if (!floorCode) {
    return <Navigate to="/" />;
  }

  if (floorCode.split("-").length !== 2) {
    if (error && "data" in error && "code" in (error.data as object)) {
      const errorData = error.data as { code: ErrorCode };
      return <Navigate to={`/?errorCode=${errorData.code}`} />;
    }

    if (defaultFloor) {
      return <Navigate to={`/${floorCode}-${defaultFloor}`} replace />;
    } else {
      return <Loader loadingText="Fetching default floor" />;
    }
  }

  return (
    <>
      <NavBar />
      <MainDisplay floorCode={floorCode} />
      <ModeDisplay />
      <FloorSwitcher floorCode={floorCode} />
      <HelpInfo />
      <MyToastContainer />
    </>
  );
};

export default FloorPage;
