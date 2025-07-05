import type { paths } from "@cmumaps/rust-server/openapi.d.ts";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import env from "../env";

const fetchClient = createFetchClient<paths>({
  baseUrl: `${env.VITE_RUST_SERVER_URL}/`,
});

const $rapi = createClient(fetchClient);

export default $rapi;
