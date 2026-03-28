import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlaceOrderRequest {
    customerName: string;
    deliveryAddress: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    deliveryAddress: string;
    createdAt: bigint;
    totalAmount: bigint;
    phone: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productData: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<Order>;
    getProduct(productId: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(request: PlaceOrderRequest): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
