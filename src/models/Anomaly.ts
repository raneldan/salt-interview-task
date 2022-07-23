import { AbnormalReason } from "../enums/AbnormalReason.enum";
import { ApiModel, Param } from "./ApiModel";
import ParamTypeFactory from "./ParamTypeFactory";
import { RequestParam } from "./ReceivedRequest";

export interface Anomaly {
    field: string;
    reason: AbnormalReason,
}

export interface HttpRequestAnomaly {
    section: string;
    anomalies: Anomaly[];
}

export type AnomalyDetector = (model: Param[], request: RequestParam[]) => Anomaly[];


export const checkTypeMisMatch : AnomalyDetector = (model: Param[], request: RequestParam[]): Anomaly[] => {
    let errors: Anomaly[] = [];
    request.forEach((param: RequestParam) => {
        const paramToCheck: Param = model.find(x => x.name === param.name);
        if (!paramToCheck) {
            errors.push({field: param.name, reason: AbnormalReason.UNKOWN_FIELD});
        }else {
            paramToCheck.types.forEach((type: string) => {
                if (!ParamTypeFactory.createTypeValidationFunction(type)(param.value)) {
                    errors.push({field: param.name, reason: AbnormalReason.TYPE_MISMATCH});
                }
            })
        }
    });
    return errors;
}


export const checkMissingRequieredFields : AnomalyDetector = (model: Param[], request: RequestParam[]): Anomaly[] => {
    const requieredParamsNames: string[] = model
        .filter(param => param.required)
        .map(x => x.name);
    const requestParamsNames: string[] = request.map((requestParam) => requestParam.name);
    return requieredParamsNames.filter(x => !requestParamsNames.includes(x))
                .map((p) => ({field: p, reason:AbnormalReason.MISSING_REQUIRED_PARAM}));
}


export const anomaliesTests: AnomalyDetector[] =
    [checkTypeMisMatch, checkMissingRequieredFields];
