import {Request, Response, NextFunction} from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/utils';
import User from '../models/user/user.interface';
import * as express from 'express';
import userModel from '../models/user/user.schema';
import { v4 as uuidv4 } from 'uuid';
import validationMiddleware from '../middlewares/vallidation';
import CreateUserDto from '../models/user/create.user.dto';
import LoginUserDto from '../models/user/loggin.user.dto';
import { DataStoredInToken, TokenData } from '../models/authentication/auth';
import { AuthMiddleware } from '../middlewares/auth';
import logger from '../utils/logger';
import HttpException from '../utils/httpException';

export  default class UserController {

    public path = '/users';
    public router = express.Router();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register);
        // this.router.put(`${this.path}/update/:id`, validationMiddleware(CreateUserDto), this.update);
        this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto), this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.get(`${this.path}/historic/:id`, this.historic);

        
    }
    
    register = async (req: Request, res: Response, next: NextFunction) => {
        logger.info(JWT_SECRET);
        logger.info(req.body);
        
        const userData: User = req.body;
        
        //if i want to recorver the password, just repeate the action below and compare hash with hash
        userData.uuid = uuidv4();
        userData.password = crypto.createHash("md5").update(userData.password).digest("hex");

        console.log(userData);

        const user = await userModel.findOne({ email: userData.email});
        
        if(user)
            return res.status(400).send({error: "the email informed already exist"}) 

        const createdUser = new userModel(userData);
        createdUser.save().then(savedUser => {
            if(savedUser){
                logger.info(`User ${savedUser} successfully registered`)
                return res.status(200).send(savedUser);
            }else{

                return res.status(400).send({error: "Error when try to register"})
            }
        });
    }


    login = async (req: Request, res: Response, next: NextFunction ) =>{
        
        const {email, password} = req.body;

        if(email && password){
        
            const encrypted_password = crypto.createHash("md5").update(password).digest("hex");
            
            const user = await userModel.findOne({ email: email});
            logger.info(user);
            
            if(!user)
                return next(new HttpException(400, 'User not found'));

            if(encrypted_password !== user.password)
                return next(new HttpException(400, 'invalid password'));
            
            user.password = '';

            logger.info(`Usuario ${user} successfully logged in`);
            const tokenData = this.generateToken(user);
            res.setHeader('Set-Cookie', [`Authorization=Bearer ${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`]);
            res.status(200).send({user: user, token: `Authorization=Bearer ${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`});
                
        }else{
            return next(new HttpException(401, 'email and password must be provided'));
        }
        
    }

    logout = (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        logger.info(`Usuario successfully logged out`);
        return res.json({message: 'success'});
    }

    historic = async (req: Request, res: Response, next: NextFunction) => {
        
        const id = req.params.id;
        console.log(id);
        
        if(id){
        
            const user = await userModel.findOne({uuid: id}).populate('historic');
            
            if(!user)
                return next(new HttpException(401, 'user not found'));


            logger.info(`user ${user} found`);
            res.status(200).send(user);
                
        }else{
            return next(new HttpException(401, 'id is necessary to delete the service'));
        }

    }

    private generateToken = (user: User): TokenData => {
        console.log("--");
        
        console.log(user);
        
        const expiresIn = 60 * 60;
        const secret = JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
          _uuid: user.uuid,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }



}