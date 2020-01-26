import * as express from "express";
import {body} from "express-validator";
import {createPost, getPosts, getPost} from "../controllers/feed";

const router = express.Router();

router.get('/posts', getPosts);

router.post('/posts', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], createPost);

router.get('/post/:postId',getPost);


export default router;