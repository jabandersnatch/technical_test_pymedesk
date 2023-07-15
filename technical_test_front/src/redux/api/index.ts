/* eslint-disable */
import { Summary } from '@/types';
import { ROOT_URL } from '@/utils/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: ROOT_URL }),
  endpoints: (builder) => ({
    fetchCustomers: builder.query<any, void>({
      query: () => '/usuario/',
    }),
    fetchCustomer: builder.query({
      query: (id) => `/usuario/${id}/`,
    }),
    createCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: '/usuario/',
        method: 'POST',
        body,
      }),
    }),
    updateCustomer: builder.mutation({
      query: ({ id, body }) => ({
        url: `/usuario/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/usuario/${id}/`,
        method: 'DELETE',
      }),
    }),
    fetchProducts: builder.query<any, void>({
      query: () => '/producto/',
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/producto/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/producto/${id}/`,
        method: 'DELETE',
      }),
    }),
    fetchProduct: builder.query({
      query: (id) => `/producto/${id}/`,
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: '/producto',
        method: 'POST',
        body,
      }),
    }),
    fetchOrders: builder.query<any, void>({
      query: () => '/pedido/',
    }),
    fetchOrder: builder.query({
      query: (id) => `/pedido/${id}/`,
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/pedido/',
        method: 'POST',
        body,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/pedido/${id}/`,
        method: 'PUT',
        body,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/pedido/${id}/`,
        method: 'DELETE',
      }),
    }),
    fetchOrderItems: builder.query<any, void>({
      query: () => '/pedido_productos/',
    }),
    fetchOrderItem: builder.query({
      query: (id) => `/pedido_productos/${id}`,
    }),
    createOrderItem: builder.mutation({
      query: (body) => ({
        url: '/pedido_productos',
        method: 'POST',
        body,
      }),
    }),
    updateOrderItem: builder.mutation({
      query: ({ id, body }) => ({
        url: `/pedido_productos/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteOrderItem: builder.mutation({
      query: (id) => ({
        url: `/pedido_productos/${id}`,
        method: 'DELETE',
      }),
    }),
    fetchSummary: builder.query<Summary, void>({
      query: () => '/resumen',
    }),
  }),
});

export const {
  useFetchCustomersQuery,
  useFetchCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useFetchProductsQuery,
  useFetchProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
  useFetchOrdersQuery,
  useFetchOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useFetchOrderItemsQuery,
  useFetchOrderItemQuery,
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useDeleteOrderItemMutation,
  useFetchSummaryQuery,
} = apiSlice;

export default apiSlice;
