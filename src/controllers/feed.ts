import {NextFunction, Request, Response} from "express";


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
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        post: {
            _id: new Date().toISOString(),
            title,
            content,
            creator: {
                name: "Mgo"
            },
            createdAt: new Date()
        },
        message: "Created Successfully"
    });
}

export {getPosts, createPost};