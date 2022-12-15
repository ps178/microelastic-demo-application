// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const bullseyeDevice = createApi({
  reducerPath: "bullseyeDevice",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000/" }),
  endpoints: (builder) => ({
    fetchUserLogin: builder.mutation({
      query: (req) => ({
        url: "/user_login",
        method: "POST",
        body: {
          username: req.username,
          password: req.password,
        },
      }),
    }),
    fetchSyncUser: builder.mutation({
      query: (username) => ({
        url: `/sync_user/${username}`,
        method: "GET",
      }),
    }),
    fetchGetOrganization: builder.mutation({
      query: (organizationId) => ({
        url: `/get_organization/${organizationId}`,
        method: "GET",
      }),
    }),
    fetchSyncOrganization: builder.mutation({
      query: (organizationId) => ({
        url: `/sync_organization/${organizationId}`,
        method: "GET",
      }),
    }),
    fetchAddNewParticipant: builder.mutation({
      query: (req) => ({
        url: `/add_new_participant`,
        method: "POST",
        body: {
          ...req,
        },
      }),
    }),
    fetchLoadLocalVisit: builder.mutation({
      query: (req) => ({
        url: `/load_local_visit`,
        method: "POST",
        body: {
          visit_id: req.visitId,
          filename: req.filename,
        },
      }),
    }),
    fetchLoadCloudVisit: builder.mutation({
      query: (req) => ({
        url: `/load_cloud_visit`,
        method: "POST",
        body: {
          visit_id: req.visitId,
        },
      }),
    }),
    fetchGetProtocol: builder.mutation({
      query: (req) => ({
        url: "/get_protocol",
        method: "POST",
        body: {
          organization_id: req.organizationId,
          protocol_id: req.protocolId,
          participant_id: req.participantId,
          visit_id: req.visitId,
        },
      }),
    }),

    fetchGetBmodeImage: builder.mutation({
      query: (req) => ({
        url: "/get_bmode_image",
        method: "POST",
        body: {
          uuid: req.id,
          amplitudeLimits: req.amplitudeLimits,
          visitFolderpath: req.visitFolderpath,
        },
      }),
    }),

    fetchGetSwsImage: builder.mutation({
      query: (req) => ({
        url: "/get_sws_image",
        method: "POST",
        body: {
          uuid: req.id,
          swsLimits: req.swsLimits,
          bLimits: req.bLimits,
          visitFolderpath: req.visitFolderpath,
        },
      }),
    }),

    fetchGetSwsValue: builder.mutation({
      query: (req) => ({
        url: "/get_sws_value",
        method: "POST",
        body: {
          uuid: req.id,
          dz: req.dz,
          percentSliceWidth: req.percentSliceWidth,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useFetchUserLoginMutation,
  useFetchSyncUserMutation,
  useFetchGetOrganizationMutation,
  useFetchGetProtocolMutation,
  useFetchLoadLocalVisitMutation,
  useFetchAddNewParticipantMutation,
  useFetchLoadCloudVisitMutation,
  useFetchSyncOrganizationMutation,
  useFetchGetBmodeImageMutation,
  useFetchGetSwsImageMutation,
  useFetchGetSwsValueMutation,
} = bullseyeDevice;
