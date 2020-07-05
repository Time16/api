import * as mongoose from "mongoose";
import Adress from "./adress.interface";

const adressSchema = new mongoose.Schema({
    uuid: String,
    street: String,
    neighborhood: String,
    number: Number,
    city: String,
    state: String,
    zip_code: Number,
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: false
    }
});

const adressModel = mongoose.model<Adress & mongoose.Document>('Adress', adressSchema);

export default adressModel;