import type { Response, Request } from "express";

class ApiResponse {
  static ok(res: Response, message: string, data = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res: Response, message: string, data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}

export default ApiResponse;
