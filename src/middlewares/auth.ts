import { NextFunction, Request, Response } from "express";
import jwt, { decode } from 'jsonwebtoken';
import { JWT_SECRET } from "../utils/utils";

export const AuthMiddleware = (req:Request, res: Response, next: NextFunction) => {

            
        const authHeader = req.headers.authorization;


        if(!authHeader)
            return res.status(401).send({error: 'No token provided'});
    
        const parts = authHeader.split(' ');
        
        if(parts.length !== 2)
            return res.status(401).send({error: 'Token error'});

        const [first, second] = parts;

        if(!/^Bearer$/i.test(first))
            return res.status(401).send({error: 'Token malformated'});

        jwt.verify(second, JWT_SECRET, (err, decode) => {
            if(err)
                return res.status(401).send({error: 'Invalid Token'});

            return next();
        });


}



// const AuthMiddleware = (req, res, next) => {

//     const authHeader = req.headers.authorization;

//     if(!authHeader)
//         return res.status(401).send({error: 'No token provided'});

//     const parts = authHeader.split(' ');

//     if(!parts.length === 2)
//         return res.status(401).send({})
// };