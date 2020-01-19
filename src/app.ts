import * as express from "express";
import * as bodyParser from "body-parser";
import feed from "./routes/feed";
import {NextFunction, Request, Response} from "express";


const app = express();

app.use(bodyParser.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    next();
});

app.use('/feed', feed);

app.listen(8080);