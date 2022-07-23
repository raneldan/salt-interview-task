import { Request, Response } from 'express';
import logger from '../util/logger';
import { ApiModel } from '../models/ApiModel';
import { db } from './schema.controller';
import { AnomalyDetector, HttpRequestAnomaly, anomaliesTests} from '../models/Anomaly';
import { ReceivedRequest } from '../models/ReceivedRequest';
import config from '../config';
import { AnomalyResponse } from '../models/AnomalyResponse';

const SEPERATOR = config.SEPERATOR;

const requestAnomalyController = {
    post: async (req: Request, res: Response) => {
        try {
            const schema: ApiModel = await getSchemaFromDB(req.body.path, req.body.method);
            const inspectedRequest: ReceivedRequest = {
                path:req.body.path, 
                method:req.body.method,
                queryParams: req.body.query_params, 
                headers: req.body.headers, 
                body:req.body.body
            };
            const anomalies: HttpRequestAnomaly[] = checkForAnomalies(schema, inspectedRequest);
            res.send(formartResponse(anomalies));
        } catch(error) {
            logger.warn('no such schema in the DB!', error);
            res.sendStatus(400);
        }
    },
};


// mimic async read from the db
async function getSchemaFromDB(path: string, method: string): Promise<ApiModel | undefined> {
    return new Promise<ApiModel | undefined>((resolve, reject) => {
        if (db.has(path + SEPERATOR + method)) {
            const result:ApiModel = db.get(path + SEPERATOR + method);
            logger.info(`loaded ${path + ' ' + method} from the db`);
            resolve(result);
        } else {
            reject();
        }
    });
}

function checkForAnomalies(schema: ApiModel, request: ReceivedRequest): HttpRequestAnomaly[] {
    let anomaliesSummary: HttpRequestAnomaly[] = [];
    anomaliesTests.forEach((test: AnomalyDetector) => {
        anomaliesSummary.push({section: 'query_params', anomalies: test(schema.query_params, request.queryParams)});  
        anomaliesSummary.push({section: 'headers', anomalies: test(schema.headers, request.headers)});
        anomaliesSummary.push({section: 'body', anomalies: test(schema.body, request.body)});
    });
    return anomaliesSummary;
}

function formartResponse(anomal: HttpRequestAnomaly[]): AnomalyResponse {
    let errors: HttpRequestAnomaly[] = aggregateAnomalies(anomal);

    const violationsCoutner = errors.reduce((acc, cur) => {
        return acc + cur.anomalies.length;
    }, 0);
    
    const requestResult: string = violationsCoutner > 0 ? 'abnormal' : 'valid';
    return ({result: requestResult, numberOfViolations: violationsCoutner, anomalies: errors});
}

function aggregateAnomalies(anomal: HttpRequestAnomaly[]): HttpRequestAnomaly[] {
    const errorsMap = new Map(anomal.map(({section}) => [section, { section, anomalies: [] }])); 
    for (const {section, anomalies} of anomal) {
        const currSectionInMap = errorsMap.get(section);
        currSectionInMap.anomalies.push(...anomalies);
    }
    return [...errorsMap.values()];
}


export default requestAnomalyController;
