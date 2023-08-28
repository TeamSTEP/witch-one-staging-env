export {};

import ApillonApi from '../api/ApillonApi';

declare module 'express-session' {
    interface SessionData {
        isValidated?: boolean;
    }
}

declare global {
    namespace Express {
        export interface Request {
            apillonApiInst: ApillonApi;
        }
    }
}
