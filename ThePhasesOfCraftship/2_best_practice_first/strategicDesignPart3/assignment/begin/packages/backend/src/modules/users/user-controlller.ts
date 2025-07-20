import { NextFunction, Request, Response } from "express";
import { Errors } from "../../shared/errors/constants";
import { parseUserForResponse } from "../../shared/utils";
import { CreateUserDTO, GetUserByEmailDTO } from "./user-dto";
import { UserService } from "./user-service";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateUserDTO.prepare(req.body);
      const { user } = await this.userService.save(dto);

      return res.status(201).json({
        error: undefined,
        data: parseUserForResponse(user),
        success: true,
      });
    } catch (e) {
      next(e);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GetUserByEmailDTO.prepare(req.query);
      const user = await this.userService.getByEmail(dto);

      return res.status(200).json({
        error: undefined,
        data: parseUserForResponse(user),
        success: true,
      });
    } catch (e) {
      next(e);
    }
  };
}
