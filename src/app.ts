import express, { Express } from 'express';
import routes from './routes';
import { appRateLimiter, port } from './config';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import ApillonApi from './api/ApillonApi';

class ServerApp {
    public server: Express;
    private _apiInst: ApillonApi;

    constructor() {
        console.log('Starting the server');
        this.server = express();

        this._apiInst = new ApillonApi(process.env.API_KEY, process.env.API_SECRET);

        this.middlewares();
        this.routes();

        console.log(`Listening to port ${port}`);
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(appRateLimiter);
        this.server.use(helmet());
        this.server.use(cors());
        this.server.use(bodyParser.json());
        //this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(morgan('combined'));

        this.server.use((req, _, next) => {
            req.apillonApiInst = this._apiInst;
            next();
        });
    }

    routes() {
        this.server.use(routes);
    }
}

export default new ServerApp();
