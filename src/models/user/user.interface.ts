import Service from "../service/service.interface";

interface User {
    _id: String,
    uuid: string;
    name: string;
    email: string;
    password: string;
    rg: string;
    CPF: number;
    historic: Service[] | string[];
}
  
export default User;