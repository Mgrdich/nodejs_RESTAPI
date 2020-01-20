import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {Post} from "../models/post";

function getPosts(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: "First Post",
                content: "this is the first post",
                imageUrl: "images/mgo.JPG",
                creator: {
                    name: "Mgo"
                },
                createdAt: new Date()

            }
        ]
    });
}

function createPost(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json(422).json({
            message: "Validation failed enter it again",
            errors: errors.array()
        })
    }
    const title = req.body.title;
    const content = req.body.content;

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
        console.log(err);
    });

}

export {getPosts, createPost};