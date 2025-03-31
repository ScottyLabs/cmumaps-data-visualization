import { apiSlice } from "@/store/features/api/apiSlice";

interface EventResponse {
  events: number[];
  prevTimestamp: number;
  nextTimestamp: number;
}

interface GetEventsQuery {
  filter: string[];
}

export const eventApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEvents: builder.infiniteQuery<EventResponse, GetEventsQuery, number>({
      query: ({ queryArg, pageParam }) => ({
        url: `/events`,
        params: {
          filter: queryArg.filter,
          timestamp: pageParam,
        },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
          return lastPage.nextTimestamp;
        },
        getPreviousPageParam: (firstPage) => {
          return firstPage.prevTimestamp;
        },
      },
    }),
  }),
});

export const { useGetEventsInfiniteQuery } = eventApiSlice;
