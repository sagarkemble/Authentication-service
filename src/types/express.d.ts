import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
      name: string;
      email: string;
    };
  }
}
