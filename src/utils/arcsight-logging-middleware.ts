import { NextFunction, Request, Response } from "express";
import { APP_VERSION } from "src/global-config";

export default (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `CEF:0|GPNA|MODULE GAS DC|${APP_VERSION}|REQUEST|application got request|0| msg=app got ${req.method} request on ${req.url} from ${req.headers["host"]}`
  );
  return next();
};
