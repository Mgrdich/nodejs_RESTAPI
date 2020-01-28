import * as express from "express";
import {body} from "express-validator";
import {signUp,logIn} from "../controllers/auth";
import {User} from "../models/user";

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Enter a Valid email')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(userDoc);
                }
            });
        }).normalizeEmail(),
    body('name')
        .trim()
        .not()
        .isEmpty(),
    body('password')
        .trim()
        .isLength({min: 5})
], signUp);

router.post('/login',logIn);

export default router;