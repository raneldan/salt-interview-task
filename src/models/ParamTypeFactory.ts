import { ParamType } from "../enums/ParamType.enum";
import { ValidateParamType, IntegerParamType, StringParamType, BooleanParamType, ListParamType, DateParamType, EmailParamType, UUIDParamType, AuthTokenParamType } from "./ParamType";

export default class ParamTypeFactory {
    static createTypeValidationFunction(paramType: string): ValidateParamType {
        switch (paramType) {
            case ParamType.INT:
                return IntegerParamType;
            case ParamType.STRING:
                return StringParamType;
            case ParamType.BOOLEAN:
                return BooleanParamType;
            case ParamType.LIST:
                return ListParamType;
            case ParamType.DATE:
                return DateParamType;
            case ParamType.EMAIL:
                return EmailParamType;
            case ParamType.UUID:
                return UUIDParamType;
            case ParamType.AUTH_TOKEN:
                return AuthTokenParamType;
            default:
                return undefined;
        }
    }
}