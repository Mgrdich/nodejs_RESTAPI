import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {Post} from "../models/post";
import {errorCatcher, errorThrower} from "../util/functions";

function getPosts(req: Request, res: Response, next: NextFunction) {

    Post.find()
        .then(function (posts) {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts: posts
            });
        }).catch(function (err) {
        // errorThrower(next, "", err.statusCode || 500);
    });
}

function createPost(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mes: string = "Validation failed, entered data is incorrect.";
        errorThrower(mes, 422);
    }
/*
    if (!req["file"]) {
        errorThrower("No image", 422);
    }
*/
    // const imageUrl: any = req["file"].path;
    const title: string = req.body.title;
    const content: string = req.body.content;

    const post = new Post({
        title, content,
        imageUrl: "images/mgo.JPG",
        creator: {
            name: "Mgo"
        },
    });
    post.save()
        .then(function (result) {
            res.status(201).json({
                message: "Post created successfully",
                post: result
            })
        }).catch(function (err) {
        errorCatcher(next, err);
    });

}

function getPost(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(function (post) {
            if (!post) {
                errorThrower("Something is Wrong", 404);
            }
            res.status(200).json({message: "Post Fetched", post: post})
        }).catch(function (err) {
        errorCatcher(next, err);
    });
}

export {getPosts, createPost, getPost};