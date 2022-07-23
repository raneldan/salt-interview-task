import { HTTPMethod } from "../enums/HttpMethod.enum";


export interface ApiModel {
    path: string;
    method: HTTPMethod;
    query_params: Param[];
    headers: Param[];
    body: Param[];
}


export interface Param {
    name: string;
    types: string[];
    required: boolean;
}