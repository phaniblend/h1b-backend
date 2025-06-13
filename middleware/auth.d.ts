import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map