import * as jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {tokenPrivateKey} from "../util/constants";
import {errorThrower} from "../util/functions";

export function isAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        errorThrower("Not Authenticated", 401);
    }
    const token: string = authHeader.split(' ')[1];
    let decodedToken: string;
    try {
        decodedToken = jwt.verify(token, tokenPrivateKey)
    } catch (e) {
        errorThrower("500", 500);
    }
    if (!decodedToken) {
        errorThrower("Not Authenticated", 401);
    }
    req["userId"] = decodedToken["userId"];
    next();
}