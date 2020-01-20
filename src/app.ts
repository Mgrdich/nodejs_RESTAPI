import * as express from "express";
import * as bodyParser from "body-parser";
import feed from "./routes/feed";
import {NextFunction, Request, Response} from "express";
import * as mongoose from "mongoose";
import {MONGODB_URI} from "./util/constants";


const app = express();

app.use(bodyParser.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feed);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        app.listen(8080);
    }).catch(function (err) {
    console.log(err);
});