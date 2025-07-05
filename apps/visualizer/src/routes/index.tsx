import { UserButton } from "@clerk/clerk-react";
import { ERROR_CODES } from "@cmumaps/common";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import ErrorDisplay from "../components/shared/ErrorDisplay";
import Loader from "../components/shared/Loader";
import MyToastContainer from "../components/shared/MyToastContainer";
import useWebSocket from "../hooks/useWebSocket";

import { useGetBuildingCodesAndNamesQuery } from "../store/api/buildingApiSlice";

const indexSearchSchema = z.object({
  errorCode: z.nativeEnum(ERROR_CODES).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(indexSearchSchema),
  component: Index,
});

function Index() {
  useWebSocket();

  const {
    data: buildingCodesAndNames,
    isLoading,
    isError,
  } = useGetBuildingCodesAndNamesQuery();
  const errorCode = Route.useSearch().errorCode;

  if (isLoading) {
    return <Loader loadingText="Fetching building codes" />;
  }

  if (isError || !buildingCodesAndNames) {
    return <ErrorDisplay errorText="Failed to fetch building codes" />;
  }

  return (
    <div>
      <header className="m-2 flex flex-row-reverse">
        <UserButton />
      </header>
      <div className="m-5 flex flex-wrap gap-8">
        {buildingCodesAndNames.map(({ buildingCode, name }) => (
          <Link
            to={"/buildings/$buildingCode"}
            params={{ buildingCode }}
            key={buildingCode}
            className="cursor-pointer rounded-lg border border-gray-300 p-4 shadow-md transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            {name}
          </Link>
        ))}
      </div>
      <MyToastContainer errorCode={errorCode} />
    </div>
  );
}

export default Index;
