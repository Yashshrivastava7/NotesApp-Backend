import mongoose, { Schema } from "mongoose";

export const UserPass = new Schema({
    username: {type: String},
    password: {type: String}
});

export const Notes = new Schema({
    username: {type: String},
    title: {type: String},
    notes: {type: String}
});
