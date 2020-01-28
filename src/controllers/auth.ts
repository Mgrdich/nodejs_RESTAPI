import {User} from "../models/user";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {errorCatcher, errorThrower} from "../util/functions";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

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
    }).catch(function (err: Error) {
        errorCatcher(next, err);
    });
}

function logIn(req: Request, res: Response, next: NextFunction) {
    let {email, password} = req.body;
    let loadedUser: any;
    User.findOne({email})
        .then(function (user) {
            if (!user) {
                let mess = "A User with this email is not found";
                errorThrower(mess, 401); //Not Authenticated
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        }).then(function (isEqual: boolean) {
        if (!isEqual) {
            let mess = "Wrong Password";
            errorThrower(mess, 401); //Not Authenticated
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            "somesuperSecretKey", {
                expiresIn: '1h'
            }
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString()})
    }).catch(function (err: Error) {
        errorCatcher(next, err);
    });

}

export {signUp, logIn};