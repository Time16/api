import { NextFunction, Request, Response } from "express";
import jwt, { decode } from 'jsonwebtoken';
import { JWT_SECRET } from "../utils/utils";
import { DataStoredInToken } from "../models/authentication/auth";
import userModel from "../models/user/user.schema";
import logger from "../utils/logger";

export const AuthMiddleware = async (req:Request, res: Response, next: NextFunction) => {

            
        const cookies = req.cookies;
        

        if(!cookies.Authorization){
            logger.error('No token provided');
            return res.status(401).send({error: 'No token provided'});
        }
    
        
        const parts = cookies.Authorization.split(' ');
        
        if(parts.length !== 2){
            logger.error('Token error');
            return res.status(401).send({error: 'Token error'});
        }

        const [first, second] = parts;

        if(!/^Bearer$/i.test(first)){
            logger.error('Token malformated');
            return res.status(401).send({error: 'Token malformated'});
        }

        const verificationResponse = jwt.verify(second, JWT_SECRET) as DataStoredInToken;
        
        const user = await userModel.findOne({uuid: verificationResponse._uuid});

        if(user){
            return next();
        }else{
            logger.error('Token malformated');
            return res.status(401).send({error: 'Invalid Token'});
        }



}
