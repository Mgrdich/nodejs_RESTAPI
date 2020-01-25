import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import feed from "./routes/feed";
import {NextFunction, Request, Response} from "express";
import * as mongoose from "mongoose";
import {MONGODB_URI} from "./util/constants";


const app = express();

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feed);

app.use(function (err:any, req:Request, res:Response, next:NextFunction) { //TODO check out the interface for error message
    const status: number = err.statusCode;
    const message: string = err.message;
    res.status(status).json({message: message});
});

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        app.listen(8080);
    }).catch(function (err) {
    console.log(err);
});