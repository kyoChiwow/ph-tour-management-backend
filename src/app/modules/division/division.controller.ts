import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.createDivision(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created",
    data: result,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivision();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All divisions fetched",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single division fetched",
    data: result.data,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DivisionService.updateDivision(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single division updated",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.deleteDivision(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single division deleted",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
