import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as multer from "multer";
import feedRoutes from "./routes/feed";
import authRoutes from "./routes/auth";
import {NextFunction, Request, Response} from "express";
import * as mongoose from "mongoose";
import {MONGODB_URI} from "./util/constants";


const app = express();

const fileStorage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: Function) {
        cb(null, 'images');
    },
    filename: function (req: Request, file: any, cb: Function) {
        cb(null, `${new Date().toISOString()}-${file.originalname}`)
    }
});

const fileFilter = function (req: Request, file: any, cb: Function) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    cb(null, false);
};


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use('/auth',authRoutes);

app.use(function (err: any, req: Request, res: Response, next: NextFunction) { //TODO check out the interface for error message
    const status: number = err.statusCode || 500;
    const message: string = err.message;
    const data = err.data;
    res.status(status).json({message, data});
});

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        app.listen(8080);
    }).catch(function (err) {
    console.log(err);
});