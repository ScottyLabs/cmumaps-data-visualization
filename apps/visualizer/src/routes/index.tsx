import { SignedIn, UserButton } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { NavLink } from "react-router";
import ErrorDisplay from "../components/shared/ErrorDisplay";
import Loader from "../components/shared/Loader";
import MyToastContainer from "../components/shared/MyToastContainer";
import useWebSocket from "../hooks/useWebSocket";
import { useGetBuildingCodesAndNamesQuery } from "../store/api/buildingApiSlice";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useWebSocket();

  const {
    data: buildingCodesAndNames,
    isLoading,
    isError,
  } = useGetBuildingCodesAndNamesQuery();

  if (isLoading) {
    return <Loader loadingText="Fetching building codes" />;
  }

  if (isError || !buildingCodesAndNames) {
    return <ErrorDisplay errorText="Failed to fetch building codes" />;
  }

  const renderTopBar = () => (
    <header className="m-2 flex flex-row-reverse">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );

  const renderBuildingLinks = () => (
    <div className="m-5 flex flex-wrap gap-8">
      {buildingCodesAndNames.map(({ buildingCode, name }) => (
        <NavLink
          to={`/${buildingCode}`}
          key={buildingCode}
          className="cursor-pointer rounded-lg border border-gray-300 p-4 shadow-md transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          {name}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div>
      {renderTopBar()}
      {renderBuildingLinks()}
      <MyToastContainer />
    </div>
  );
}

export default Index;
