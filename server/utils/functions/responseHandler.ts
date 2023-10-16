class ResponseHandler {
  status: any;
  message: any;
  data: any;
  constructor(status: any, message: any, data: any) {
    this.status = status;
    this.message = message || "";
    this.data = data || {};
  }
  sendResponse(res: any) {
    return res.status(this.status).json({
      message: this.message,
      data: this.data,
    });
  }
}
export function okResponse(res: any, message: string, data = {}) {
  const response = new ResponseHandler(200, message, data);
  return response.sendResponse(res);
}
export function createdResponse(res: any, message: string, data = {}) {
  const response = new ResponseHandler(201, message, data);
  return response.sendResponse(res);
}
export function badRequestResponse(res: any, message: string) {
  const response = new ResponseHandler(400, message, undefined);
  return response.sendResponse(res);
}
export function unAuthorizedResponse(res: any, message: string) {
  const response = new ResponseHandler(401, message, undefined);
  return response.sendResponse(res);
}
export function notFoundResponse(res: any, message: string) {
  const response = new ResponseHandler(404, message, undefined);
  return response.sendResponse(res);
}
export function internalServerErrorResponse(res: any, message: string) {
  const response = new ResponseHandler(500, message, undefined);
  return response.sendResponse(res);
}
export function conflictResponse(res: any, message: string) {
  const response = new ResponseHandler(409, message, undefined);
  return response.sendResponse(res);
}
