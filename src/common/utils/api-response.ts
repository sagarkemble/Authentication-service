import type { Response } from "express";
class ApiResponse {
  static ok(res: Response, message: string, data: unknown) {
    return res.status(200).json({
      success: true,
      code: "OK",
      status: 200,
      message,
      data,
    });
  }
  static created(res: Response, message: string, data: unknown) {
    return res.status(201).json({
      success: true,
      code: "CREATED",
      status: 201,
      message,
      data,
    });
  }
  static html(res: Response, html: string, type: string) {
    res.setHeader("Content-Type", "text/html");
    if (type === "error") return res.status(400).send(html);
    else return res.status(200).send(html);
  }
}
export default ApiResponse;
