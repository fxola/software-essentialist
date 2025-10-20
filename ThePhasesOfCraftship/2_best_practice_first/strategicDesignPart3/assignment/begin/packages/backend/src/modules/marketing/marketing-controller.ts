import { NextFunction, Request, Response } from "express";
import { AddEmailDTO } from "./marketing-dto";
import { MarketingService } from "./marketing-service";

export class MarketingController {
  constructor(private marketingService: MarketingService) {}

  addEmailToList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = AddEmailDTO.prepare(req.body);
      const email = await this.marketingService.addToEmailToList(dto);

      return res.status(201).json({
        success: true,
        error: undefined,
        data: { email, message: "Email added successfully" },
      });
    } catch (e) {
      next(e);
    }
  };
}
