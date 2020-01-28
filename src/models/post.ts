import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
}, {timestamps: true});

const Posts = mongoose.model('Post', postSchema);

export {Posts};