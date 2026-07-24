export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    active: boolean;
    categoryId: number;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    sku: string;
    price: number;
    categoryId: number;
}

export interface UpdateProductDTO {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    categoryId: number;
}

