import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {Posts} from "../models/post";
import {errorCatcher, errorThrower} from "../util/functions";
import {ITEMS_PER_PAGE} from "../util/constants";

function getPosts(req: Request, res: Response, next: NextFunction) {

    const currentPage: number = req.query.page || 1;
    let totalItems: number;
    Posts.find()
        .countDocuments()
        .then(function (count) {
            totalItems = count;
            return Posts.find()
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        }).then(function (posts) {
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: posts,
            totalItems:totalItems
        });
    }).catch(function (err) {
        errorCatcher(next, err);
    })
}

function createPost(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mes: string = "Validation failed, entered data is incorrect.";
        errorThrower(mes, 422);
    }
    /*
        if (!req["file"]) {   //TODO check out the image issue
            errorThrower("No image", 422);
        }
    */
    // const imageUrl: any = req["file"].path;
    const title: string = req.body.title;
    const content: string = req.body.content;

    const post = new Posts({
        title, content,
        imageUrl: 'images/mgo.JPG',
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
    Posts.findById(postId)
        .then(function (post) {
            if (!post) {
                errorThrower("Something is Wrong", 404);
            }
            res.status(200).json({message: "Post Fetched", post: post})
        }).catch(function (err) {
        errorCatcher(next, err);
    });
}

function updatePost(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mes: string = "Validation failed, entered data is incorrect.";
        errorThrower(mes, 422);
    }
    const postId = req.params.postId;
    let {title, content, image} = req.body;
    /*  if (req["file"]) {
          image = req["file"].path;
      }
      if (!image) {
          errorThrower("No File Picked", 422);
      }
    */
    Posts.findById(postId)
        .then(function (post) {
            if (!post) {
                errorThrower("Not Found", 422);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = 'images/mgo.JPG';
            return post.save()
        }).then(function (result) {
        res.status(200).json({message: 'Post Updated', post: result})
    }).catch(function (err) {
        errorCatcher(next, err);
    })
}

function deletePost(req: Request, res: Response, next: NextFunction) { //TODO if image upload is done correctly change this code to delete the image
    const postId = req.params.postId;
    Posts.deleteOne({_id: postId})
        .then(function () {
            res.status(200).json({message: 'Post Deleted'});
        }).catch(function (err) {
        errorCatcher(next, err);
    })
}

export {getPosts, createPost, getPost, updatePost, deletePost};