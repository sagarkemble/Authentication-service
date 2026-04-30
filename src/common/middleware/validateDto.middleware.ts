import type { Request, Response, NextFunction } from "express";
import BaseDto from "../dto/base.dto.js";

export const validateDto = (DtoClass: typeof BaseDto) => {
  return (req: Request, res: Response, next: NextFunction) => {
    DtoClass.validate(req.body);
    next();
  };
};

export default validateDto;
