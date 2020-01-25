import {NextFunction} from "express";

const errorThrower = function (next: NextFunction, err:string, statusCode: number) {
    const error = new Error(err);
    error["statusCode"] = statusCode;
    return next(error);
};

export {errorThrower};