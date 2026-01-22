import client from '../api/client';
import type { Customer, CustomerRequest, Address, AddressRequest } from '../types/customer.types';

export const CustomerService = {
    // --- CLIENTES ---
    getCustomers: async (businessId: number) => {
        const response = await client.get<Customer[]>('/customers', {
            params: { businessId }
        });
        return response.data;
    },

    getCustomerById: async (businessId: number, customerId: number) => {
        const response = await client.get<Customer>(`/customers/${customerId}`, {
            params: { businessId }
        });
        return response.data;
    },

    createCustomer: async (businessId: number, data: CustomerRequest) => {
        const response = await client.post<Customer>('/customers', data, {
            params: { businessId }
        });
        return response.data;
    },

    updateCustomer: async (businessId: number, customerId: number, data: CustomerRequest) => {
        const response = await client.put<Customer>(`/customers/${customerId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    deleteCustomer: async (businessId: number, customerId: number) => {
        await client.delete(`/customers/${customerId}`, {
            params: { businessId }
        });
    },

    // --- DIRECCIONES ---
    getAddresses: async (businessId: number, customerId: number) => {
        const response = await client.get<Address[]>(`/customers/${customerId}/addresses`, {
            params: { businessId }
        });
        return response.data;
    },

    createAddress: async (businessId: number, customerId: number, data: AddressRequest) => {
        const response = await client.post<Address>(`/customers/${customerId}/addresses`, data, {
            params: { businessId }
        });
        return response.data;
    },

    updateAddress: async (businessId: number, customerId: number, addressId: number, data: AddressRequest) => {
        const response = await client.put<Address>(`/customers/${customerId}/addresses/${addressId}`, data, {
            params: { businessId }
        });
        return response.data;
    },

    deleteAddress: async (businessId: number, customerId: number, addressId: number) => {
        await client.delete(`/customers/${customerId}/addresses/${addressId}`, {
            params: { businessId }
        });
    }
};
