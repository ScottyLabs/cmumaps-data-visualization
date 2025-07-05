import type { ErrorCode } from "@cmumaps/common";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import ErrorHandler from "../../components/shared/ErrorHandler";
import Loader from "../../components/shared/Loader";
import { useGetDefaultFloorQuery } from "../../store/api/buildingApiSlice";

export const Route = createFileRoute("/buildings/$buildingCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const { buildingCode } = Route.useParams();
  const { data, isLoading, error } = useGetDefaultFloorQuery(buildingCode);

  if (isLoading) {
    return <Loader loadingText="Fetching building floors" />;
  }

  if (error) {
    if ("data" in error && "code" in (error.data as object)) {
      const errorCode = (error.data as { code: ErrorCode }).code;
      return <Navigate to="/" search={{ errorCode }} />;
    }
    return <ErrorHandler error={error} />;
  }

  if (!data) {
    return <Navigate to="/" />;
  }

  return <div>Hello {data}</div>;
}
