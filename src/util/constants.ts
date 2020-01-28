const MONGODB_URI: string = "mongodb://localhost:27017/RestApi_Messages";

const tokenPrivateKey: string = "somesuperSecretKey"; //TODO change this to read from a secret file

const PORT_NUMBER: number = 8080;

const ITEMS_PER_PAGE: number = 2;

export {MONGODB_URI, ITEMS_PER_PAGE, tokenPrivateKey, PORT_NUMBER};