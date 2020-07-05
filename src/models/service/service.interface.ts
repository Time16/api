import User from "../user/user.interface";
import Adress from "../adress/adress.interface";

interface Service {
    _id: String;
    uuid: string;
    name: string;
    latitudeO: number;
    longitudeO:number;
    latitudeD: number;
    longitudeD:number;
    status: string;
    price:number;

    estimated_time: number;
    spent_time:number;

    initial_time: number;
    final_time: number;

    date: Date;
    
    adress: Adress | string;
    user: User | string;
}
  
export default Service;
