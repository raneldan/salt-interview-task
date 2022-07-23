import { HTTPMethod } from "../enums/HttpMethod.enum";

export interface ReceivedRequest {
    path: string;
    method: HTTPMethod;
    queryParams: RequestParam[];
    headers: RequestParam[];
    body: RequestParam[]
}

export interface RequestParam {
    name: string;
    value: any;
}
