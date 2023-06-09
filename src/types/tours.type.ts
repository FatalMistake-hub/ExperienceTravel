import { IOrder } from './order.type';
import { ICategory } from './category.type';
import { IInfoAccount } from './account.type';

export interface ITours {
    tourId: number;
    title: string;
    rating: number;
    city: string;
    priceOnePerson: number;
    imageMain: string;
    working: string;
    latitude: string;
    longitude: string;
    destination: string;
    categoryName: string;
    categoryId: number;
    destinationDescription: string;
    timeSlotLength: number;
    avgRating: number;
    imageDtoList: IImageTour[];
    images: IImageTour[];
    isDeleted: boolean;
    userId: string;
    timeBookStart: Time;
    timeBookEnd: Time;
    orderDtoList?: IOrder[];
    user: IInfoAccount;
}
export interface IAllTours {
    content: ITours[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}
export interface IImageTour {
    imageId: string;
    link: string;
}
export interface ImagePatch extends IImageTour {
    tourId?: number;
}
export interface TourPost {
    categories: ICategory[];
    title: string;
    rating: number;
    city: string;
    priceOnePerson: number | null;
    imageMain: string;
    working: string;
    latitude: number;
    longitude: number;
    destination: string;
    timeSlotLength: number;
    destinationDescription: string;
    imageDtoList: { link: string }[];
    timeBookStart: Time;
    timeBookEnd: Time;
    // checkIn: string;
    // checkOut: string;
    startDay: string;
    endDay: string;
}
interface Time {
    hour: number | undefined;
    minutes: number | undefined;
}
export interface IViewPort {
    northEastLat: number;
    northEastLng: number;
    southWestLat: number;
    southWestLng: number;
}
