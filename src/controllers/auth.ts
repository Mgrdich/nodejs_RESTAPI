import {User} from "../models/user";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {errorCatcher, errorThrower} from "../util/functions";
import * as bcrypt from "bcrypt";


function signUp(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorThrower("Validation Failed", 422, errors.array());
    }
    let {email, password, name} = req.body;
    bcrypt.hash(password, 12)
        .then(function (hashedPw) {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name
            });
            return user.save()
        }).then(function (result) {
        res.status(201).json({message: "User is Created", userId: result._id})
    }).catch(function (err) {
        errorCatcher(next, err);
    });
}

export {signUp};