import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {errorCatcher, errorThrower} from "../util/functions";
import {ITEMS_PER_PAGE} from "../util/constants";

import {Posts} from "../models/post";
import {User} from "../models/user";

const io = require('../socket');

async function getPosts(req: Request, res: Response, next: NextFunction) {

    const currentPage: number = req.query.page || 1;
    try {
        const totalItems = await Posts.find().countDocuments();

        const posts = await Posts.find()
            .populate('creator')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: posts,
            totalItems: totalItems
        });
    } catch (err) {
        errorCatcher(next, err);
    }
}

async function createPost(req: Request, res: Response, next: NextFunction) {
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

    let creator: any;

    const post = new Posts({
        title, content,
        imageUrl: 'images/mgo.JPG',
        creator: req["userId"],
    });
    try { //TODO all object take into consideration interfaces so no linter errors
        await post.save();
        const user = await User.findById(req["userId"]);
        user["posts"].push(post);
        await user.save();
        io.getIO().emit('posts', {
            action: 'create', post: {
                ...post["_doc"], creator: {
                    _id: req["userId"], name: user['name']
                }
            }
        });
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {_id: user._id, name: user["name"]}
        });
    } catch (err) {
        errorCatcher(next, err);
    }

}

async function getPost(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;
    try {
        const post = await Posts.findById(postId);
        if (!post) {
            errorThrower("Something is Wrong", 404);
        }
        res.status(200).json({message: "Post Fetched", post: post})

    } catch (err) {
        errorCatcher(next, err);
    }
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
    Posts.findById(postId).populate('creator')
        .then(function (post) {
            if (!post) {
                errorThrower("Not Found", 422);
            }
            if (post["creator"]._id.toString() !== req["userId"]) {
                errorThrower("Not Authorized", 403);
            }
            post["title"] = title;
            post["content"] = content;
            post["imageUrl"] = 'images/mgo.JPG';
            return post.save()
        }).then(function (result) {
        io.getIO().emit('posts', {
            action: 'delete',
            post: result
        });
        res.status(200).json({message: 'Post Updated', post: result})
    }).catch(function (err) {
        errorCatcher(next, err);
    })
}

//TODO fix the delete 
function deletePost(req: Request, res: Response, next: NextFunction) { //TODO if image upload is done correctly change this code to delete the image
    const postId: any = req.params.postId; //bcz user pull linter expect object id
    Posts.findById(postId)
        .then(function (post) {
            if (!post) {
                errorThrower("Not Found", 422);
            }
            if (post["creator"].toString() !== req["userId"]) {
                errorThrower("Not Authorized", 403);
            }
            let pr1 = Posts.findOneAndDelete(postId);
            let pr2 = User.findById(req["userId"]).then(function (user) {
                user["posts"].pull(postId);
                return user.save();
            }).catch(function (err: Error) {
                errorCatcher(next, err);
            });
            return Promise.all([pr1, pr2]);
        }).then(function () {
        io.getIO().emit('posts', {
            action: 'delete',
            post: postId
        });
        res.status(200).json({message: 'Post Deleted'});
    }).catch(function (err) {
        errorCatcher(next, err);
    })
}

export {getPosts, createPost, getPost, updatePost, deletePost};