import {Request, Response, NextFunction} from 'express';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import validationMiddleware from '../middlewares/vallidation';
import { DataStoredInToken, TokenData } from '../models/authentication/auth';
import { AuthMiddleware } from '../middlewares/auth';
import logger from '../utils/logger';
import HttpException from '../utils/httpException';
import CreateServiceDto from '../models/service/create.service.dto';
import Service from '../models/service/service.interface';
import serviceModel from '../models/service/service.schema';
import AssignServiceDto from '../models/service/assign.service.dto';
import userModel from '../models/user/user.schema';
import adressModel from '../models/adress/adress.schema';


export  default class ServiceController {

    public path = '/services';
    public router = express.Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){

        this.router.post(`${this.path}/create`, validationMiddleware(CreateServiceDto), this.create);
        this.router.delete(`${this.path}/delete/:id`, this.delete);
        this.router.get(`${this.path}/findOne/:id`, this.findOne);
        this.router.get(`${this.path}/findAll`, this.findAll);
        this.router.post(`${this.path}/assignService`, validationMiddleware(AssignServiceDto), this.assign);
    }
    

    create = async (req: Request, res: Response, next: NextFunction) => {

        
        const serviceData: Service = req.body;
        serviceData.uuid = uuidv4();

        const address = await adressModel.findOne({uuid: String(serviceData.adress)});
        if(!address)
            return next(new HttpException(401, 'Address not found'));
        
        console.log(address);
        serviceData.adress = address._id;

        const createdService = new serviceModel(serviceData);
        createdService.save().then(savedService => {
            if(savedService){
                logger.info(`Service ${savedService} successfully created`)
                return res.status(200).send(savedService);
            }else{
                return next(new HttpException(400, "Erro when try to create service"));
            }
        });
    }


    delete = async (req: Request, res: Response, next: NextFunction ) =>{
        
        const id = req.params.id;

        if(id){
        
            const service = await serviceModel.findOne({uuid: id});
            
            if(!service)
                return next(new HttpException(401, 'service not found'));

            await serviceModel.findOneAndDelete({uuid: id});
            logger.info("service removed");
            res.status(200).send({message: 'Sucefuly removed'});
                
        }else{
            return next(new HttpException(401, 'id is necessary to delete the service'));
        }
        
    }

    assign = async (req: Request, res: Response, next: NextFunction ) =>{
        
        const {uuidUser, uuidService} = req.body;
        console.log(uuidService);
        
        const user = await userModel.findOne({uuid: uuidUser});        
        if(!user)
            return next(new HttpException(401, 'user not found'));
        
        const service = await serviceModel.findOne({uuid: uuidService});
        if(!service)
            return next(new HttpException(401, 'service not found'));



        const idsServices = user.historic;
        idsServices.push(service._id);


        const serviceAltered = await serviceModel.findByIdAndUpdate(service._id, {user: user._id}, {new: true});
        const userAltered = await userModel.findByIdAndUpdate(user._id, {historic: user.historic}, {new: true});

        
        
        // await serviceModel.findOneAndUpdate({uuid: uuidService}, {...service, user: user._id});
        logger.info("service altered");
        res.status(200).send({message: 'Sucefuly altered'});
                
        
    }

    findOne = async (req: Request, res: Response, next: NextFunction) => {
        
        const id = req.params.id;
        console.log(id);
        
        

        if(id){
        
            const service = await serviceModel.findOne({uuid: id}).populate('user');
            
            if(!service)
                return next(new HttpException(401, 'service not found'));


            logger.info(`service ${service} found`);
            res.status(200).send(service);
                
        }else{
            return next(new HttpException(401, 'id is necessary to delete the service'));
        }
        
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        
            const services = await serviceModel.find().populate(['user', 'adress']);
            
            logger.info(`Returning all services`);
            res.status(200).send(services);
        
    }




}