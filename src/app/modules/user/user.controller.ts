import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../../utils/jwt';

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServices.createUserService(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body);

    sendResponse(res, {
      success: true, 
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user
    })
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const payload = req.body;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const verifiedToken = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      success: true, 
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user
    })
  }
);

const getAllUsers = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.getAllUsers();
    
  sendResponse(res, {
      success: true, 
      statusCode: httpStatus.OK,
      message: "All users fetched successfully",
      meta: result.meta,
      data: result.data,
    })
})

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};

// route matching -> controller -> service -> model -> DB
