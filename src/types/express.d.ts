import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
}
