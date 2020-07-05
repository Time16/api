import {Request, Response, NextFunction} from 'express';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import validationMiddleware from '../middlewares/vallidation';
import { AuthMiddleware } from '../middlewares/auth';
import logger from '../utils/logger';
import HttpException from '../utils/httpException';
import CreateAdressDto from '../models/adress/create.adress.dto';
import Adress from '../models/adress/adress.interface';
import adressModel from '../models/adress/adress.schema';

export  default class AddressController {

    public path = '/address';
    public router = express.Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/create`, validationMiddleware(CreateAdressDto), this.create);

        
    }
    
    create = async (req: Request, res: Response, next: NextFunction) => {
        
        const addressData: Adress = req.body;

        addressData.uuid = uuidv4();
        const createdAddress = new adressModel(addressData);
        createdAddress.save().then(savedAddress => {
            if(savedAddress){
                logger.info(`Address ${savedAddress} successfully registered`)
                return res.status(200).send(savedAddress);
            }else{

                return res.status(400).send({error: "Error when try to create Address"})
            }
        });
    }


}