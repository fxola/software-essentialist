import { Request, Response } from "express";
import { Errors } from "../../shared/errors/constants";
import { parseUserForResponse } from "../../shared/utils";
import { CreateUserDTO } from "./user-dto";
import { UserService } from "./user-service";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const dto = CreateUserDTO.prepare(req.body);
      const { user } = await this.userService.save(dto);

      return res.status(201).json({
        error: undefined,
        data: parseUserForResponse(user),
        success: true,
      });
    } catch (e) {
      return res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  };
}
