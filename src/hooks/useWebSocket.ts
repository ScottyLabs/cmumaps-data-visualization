import { useSession, useUser } from "@clerk/nextjs";

import { useEffect } from "react";

import { useAppDispatch } from "../lib/hooks";
import { WEBSOCKET_JOIN } from "../lib/webSocketMiddleware";
import { WEBSOCKET_ENABLED } from "../settings";

const useWebSocket = (floorCode: string | null) => {
  const { user } = useUser();
  const { session, isLoaded } = useSession();
  const dispatch = useAppDispatch();

  // join WebSocket
  useEffect(() => {
    if (!WEBSOCKET_ENABLED || !isLoaded || !user?.firstName) {
      return;
    }

    (async () => {
      const token = await session?.getToken();
      const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?userName=${user?.firstName || ""}&floorCode=${floorCode}&token=${token}`;
      dispatch({
        type: WEBSOCKET_JOIN,
        payload: { url, floorCode },
      });
    })();
    // No need to refresh the token when session changes since
    // only used to establish connection with the WebSocket
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoaded, user?.firstName]);
};

export default useWebSocket;