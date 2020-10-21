import {standardOptions} from './standardOptions.model';
import {extraOptions} from "./extraOptions.model";
import {price} from "./price.model";
export class Plat {
    key:string;
    thumb: string;
    category: string;
    title: string;
    body: string;
    isFeatured: string;
    tags: string;
    standardOptions: standardOptions[];
    extraOptions: extraOptions[];
    price: price[];
    pictures: string;
    etat:boolean;
}
