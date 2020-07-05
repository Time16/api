import * as mongoose from "mongoose";
import Service from "./service.interface";

const serviceSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    latitudeO: Number,
    longitudeO:Number,
    latitudeD: Number,
    longitudeD:Number,
    status: String,
    price:Number,
    estimated_time: Number,
    spent_time:Number,
    initial_time: Number,
    final_time: Number,
    date: Date,
    adress:{ 
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Adress',

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
});

const serviceModel = mongoose.model<Service & mongoose.Document>('Service', serviceSchema);

export default serviceModel;