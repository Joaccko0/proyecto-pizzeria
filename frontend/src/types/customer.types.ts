export interface Address {
    id: number;
    street: string;
    number: string;
    description?: string;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    addresses: Address[];
}

export interface CustomerRequest {
    name: string;
    phone: string;
}

export interface AddressRequest {
    street: string;
    number: string;
    description?: string;
}
