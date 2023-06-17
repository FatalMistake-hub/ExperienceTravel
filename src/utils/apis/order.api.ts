import { AxiosInstance } from 'axios';
import { IOrder } from 'src/types/order.type';

export const getAllGuestOrder = async (axiosAuth: AxiosInstance) => await axiosAuth.get<IOrder[]>(`/order/all/`);
export const getAllHostOrder = async (axiosAuth: AxiosInstance) => await axiosAuth.get<IOrder[]>(`/order/get_list_order/`);
export const changeStatusOrder = async (axiosAuth: AxiosInstance, orderId: string, status: string) =>
    await axiosAuth.get<any>(`/order/create-request/${orderId}/${status}`);
export const patchUpdateOrder = async (axiosAuth: AxiosInstance, orderId: string | undefined, data: Partial<IOrder>) =>
    await axiosAuth.patch<any>(`/order/order-update/${orderId}/`, data);
