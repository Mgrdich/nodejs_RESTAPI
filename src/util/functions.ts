import {NextFunction} from "express";

const errorThrower = function (errMessage: string, statusCode: number) {
    const error = new Error(errMessage);
    error["statusCode"] = statusCode;
    throw error;
};

const errorCatcher = function (next: NextFunction, err: Error) {
    if (!err["statusCode"]) {
        err["statusCode"] = 500;
    }
    next(err);
};
export {errorThrower, errorCatcher};