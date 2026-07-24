export interface ApiErrorBody {
  message: string;
  errorCode: string;
  timestamp: string;
}

export class ApiError extends Error {
    constructor(message: string, public status: number, public errorCode: string, public timestamp: string) {
        super(message);
        this.name = "ApiError";
    }
}