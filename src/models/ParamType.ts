export type ValidateParamType = (param: any) => boolean;

export const IntegerParamType : ValidateParamType = (param: any): boolean => {
    return typeof(param) === 'number' && (param % 1) === 0;
}

export const StringParamType : ValidateParamType = (param: any): boolean => {
    return typeof(param) === 'string';
}

export const BooleanParamType : ValidateParamType = (param: any): boolean => {
    return typeof(param) === 'boolean';
}

export const ListParamType : ValidateParamType = (param: any): boolean => {
    return Array.isArray(param);
}

export const DateParamType : ValidateParamType = (param: any): boolean => {
    const dateRegex:string = '^(0[1-9]|[1|2][0-9]|[3][0|1])[-](0[1-9]|[1][0-2])[-]([0-9]{4})$';
    const re: RegExp = new RegExp(dateRegex);
    return  re.test(param);
}

export const EmailParamType : ValidateParamType = (param: any): boolean => {
    const emailRegex:string = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$';
    const re: RegExp = new RegExp(emailRegex);
    return  re.test(param);
}

export const UUIDParamType : ValidateParamType = (param: any): boolean => {
    const UUIDRegex:string = '[a-f0-9]{12}';
    const re: RegExp = new RegExp(UUIDRegex);
    return  re.test(param);
}

export const AuthTokenParamType : ValidateParamType = (param: any): boolean => {
    const tokenRegex:string = "Bearer [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
    const re: RegExp = new RegExp(tokenRegex);
    return  re.test(param);
}
