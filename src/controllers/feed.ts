import {NextFunction, Request, Response} from "express";


function getPosts(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({id: 1, name: "boxos"});
}

function createPost(req: Request, res: Response, next: NextFunction) {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({id: new Date().toISOString(), title, content});
}

export {getPosts, createPost};