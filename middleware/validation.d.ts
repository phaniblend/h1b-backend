import { Request, Response, NextFunction } from 'express';
export declare const authValidation: {
    register: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    login: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    resendVerification: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    changePassword: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
};
//# sourceMappingURL=validation.d.ts.map