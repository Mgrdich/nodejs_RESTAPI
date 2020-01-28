import * as express from "express";
import {body} from "express-validator";
import {createPost, getPosts, getPost, updatePost, deletePost} from "../controllers/feed";
import {isAuth} from "../middleware/isAuth";

const router = express.Router();

router.get('/posts', isAuth, getPosts);

router.post('/posts', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], createPost);

router.get('/post/:postId', isAuth, getPost);

router.put('/posts/:postId', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], updatePost);

router.delete('/posts/:postId', isAuth, deletePost);

export default router;