import { ERROR_CODES } from "@cmumaps/common";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import Loader from "../../components/shared/Loader";
import { useGetDefaultFloorQuery } from "../../store/api/buildingApiSlice";

export const Route = createFileRoute("/buildings/$buildingCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingCode } = Route.useParams();

  // Skip the query if don't need to retrieve the default floor
  const { data, isLoading, isError } = useGetDefaultFloorQuery(buildingCode);

  if (isLoading) {
    return <Loader loadingText="Fetching building floors" />;
  }

  if (isError) {
    return (
      <Navigate
        to="/"
        params={{ errorCode: ERROR_CODES.INVALID_BUILDING_CODE }}
      />
    );
  }

  if (!data) {
    return <Navigate to="/" />;
  }

  return <div>Hello {data}</div>;
}
