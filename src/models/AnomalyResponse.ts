import { HttpRequestAnomaly } from "./Anomaly";

export interface AnomalyResponse {
    result: string;
    numberOfViolations: number;
    anomalies: HttpRequestAnomaly[];
}