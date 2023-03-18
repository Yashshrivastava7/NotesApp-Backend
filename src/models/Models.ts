import mongoose, { Schema } from "mongoose";

export const UserPassSchema = new Schema({
    username: {type: String},
    password: {type: String}
});

export const NotesSchema = new Schema({
    username: {type: String},
    title: {type: String},
    notes: {type: String}
});
