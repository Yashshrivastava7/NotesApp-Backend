import mongoose, { Schema } from "mongoose";

const UserPass = new Schema({
    username: {type: String},
    password: {type: String}
});

const Notes = new Schema({
    username: {type: String},
    title: {type: String},
    notes: {type: String}
});
