import express, { response, Application } from 'express';
import path from 'path';
const mongoose = require("mongoose");
import cors from 'cors';
import { errors } from 'celebrate';



export default class App{

    public app: Application;

    public controllers = [
        //place to create instances of the controllers
    ]

    constructor() {        
        this.app = express();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeControllers(){
        this.controllers.forEach((controller) => {
            this.app.use('/', controller.router);
          });
    }

    private connectToDatabase(){
        const {MONGO_USER, MONGO_PASSWORD, MONGO_PATH} = process.env;
          mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {useNewUrlParser: true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("successful connection");
        });
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    }



}



