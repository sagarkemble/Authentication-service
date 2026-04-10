import type { Response, Request } from "express";

class ApiResponse {
  static ok(res: Response, message: string, data: null | object = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static html(res: Response, html: string, type: string) {
    res.setHeader("Content-Type", "text/html");
    if (type === "error") return res.status(400).send(html);
    else return res.status(200).send(html);
  }

  static created(res: Response, message: string, data: null | object = null) {
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
