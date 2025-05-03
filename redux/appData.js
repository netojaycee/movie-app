import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { clearUserInfo, setUserInfo } from "./slices/userSlice";
import { getToken, removeToken, setToken } from "@/lib/SecureStorage";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api`,

  prepareHeaders: async (headers) => {
    const token = await getToken();

    if (token && token !== "undefined") {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },

  // async responseHandler(args, api, extraOptions) {
  //   const result = await baseQuery(args, api, extraOptions);

  //   if (result?.error?.status === 401) {
  //     const refresh_token = getCookie("refresh_token");

  //     if (refresh_token) {
  //       const refreshResult = await api.dispatch(
  //         api.endpoints.tokenRefresh.initiate({ refresh_token: refresh_token })
  //       );

  //       if (refreshResult?.data) {
  //         setCookie("access_token", refreshResult?.data?.access, 15);

  //         return await baseQuery(args, api, extraOptions);
  //       }
  //     }
  //   }

  //   return result;
  // },
});

export const api = createApi({
  reducerPath: "api",

  baseQuery,

  tagTypes: ["Books"],

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",

        method: "POST",

        body: credentials,

        headers: { "Content-Type": "application/json" },
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          // console.error("Register failed:", err);
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",

        method: "POST",

        body: credentials,

        headers: { "Content-Type": "application/json" },
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          // console.log(result, "FF");
          const { data } = result;

          if (data?.token) {
            await setToken(data.token); // Save token in SecureStore

            dispatch(
              setUserInfo({
                id: data.user._id,
                username: data.user.username,
                email: data.user.email,
                profileImage: data.user.profileImage,
              })
            );
          }
        } catch (err) {
          // console.error("Login failed:", err);
        }
      },
    }),

    logout: builder.mutation({
      queryFn: async (_, { dispatch }) => {
        try {
          await removeToken(); // Clear token from storage
          dispatch(clearUserInfo()); // Clear user state
          console.log("User logged out successfully.");
          return { data: { message: "Logged out successfully" } };
        } catch (error) {
          console.error("Logout failed:", error);
          return { error: { status: 500, message: "Logout failed" } };
        }
      },
    }),

    getUser: builder.query({
      query: () => "/user/me/",
      providesTags: ["User"],
      headers: { "Content-Type": "application/json" },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // console.log("getUser response:", result);
          dispatch(setUserInfo(result?.data?.data));
          document.cookie = `user=${JSON.stringify(
            result?.data?.data
          )}; path=/; max-age=604800`;
        } catch (err) {
          console.error("getUser query failed:", err);
        }
      },
    }),

    updateCard: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `/billing/cards/${id}/`,

        method: "PATCH",

        body: credentials,

        headers: { "Content-Type": "application/json" },
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // console.log("kyc", r);
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Cards"],
    }),
    deleteCard: builder.mutation({
      query: (id) => ({
        url: `/billing/cards/${id}/`,

        method: "DELETE",

        // body: credentials,

        headers: { "Content-Type": "application/json" },
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // console.log("kyc", r);
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Cards"],
    }),

    addBook: builder.mutation({
      query: (credentials) => ({
        url: "/books",

        method: "POST",

        body: credentials,

        headers: { "Content-Type": "application/json" },
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          // console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Books"],
    }),
    getAllBooks: builder.query({
      query: () => "/books",
      providesTags: ["Books"],
      headers: { "Content-Type": "application/json" },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserQuery,
  useLogoutMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useAddBookMutation,
  useGetAllBooksQuery,
} = api;
