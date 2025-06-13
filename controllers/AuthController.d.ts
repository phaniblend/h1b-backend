import { Request, Response } from 'express';
export declare class AuthController {
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    verifyEmail: (req: Request, res: Response) => Promise<void>;
    resendVerification: (req: Request, res: Response) => Promise<void>;
    refreshToken: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=AuthController.d.ts.map