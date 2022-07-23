import { Request, Response } from 'express';
import logger from '../util/logger';
import config from '../config';
import { ApiModel } from '../models/ApiModel';

const SEPERATOR = config.SEPERATOR;


export const db: Map<string, ApiModel> = new Map<string, ApiModel>();


const schemaController = {
    post: async (req: Request, res: Response) => {
        const schemas: ApiModel[] = [];

        req.body.forEach((obj: ApiModel) => 
            schemas.push({
                path: obj.path, 
                method: obj.method,
                query_params: obj.query_params, 
                headers: obj.headers, 
                body: obj.body})
        );
             
        try {
            await saveToDb(schemas);
            res.send();
        } catch (error) {
            logger.error('saving schema to db failed!');
            res.send(500);
        }
    },
};

async function saveToDb(schemas: ApiModel[]): Promise<boolean> {
    schemas.forEach((schema: ApiModel) => {
        const pathAndMethod: string = schema.path + SEPERATOR + schema.method;
        db.set(pathAndMethod, schema);
        logger.info(`saved ${schema.path + ' ' + schema.method} to the DB`);
    });
    // just to mimic async save to db
    return new Promise<boolean>((res) => res(true));
}

export default schemaController;
