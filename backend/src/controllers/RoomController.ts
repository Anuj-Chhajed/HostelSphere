import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/RoomService';

export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  public createBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.roomService.createBlock(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.roomService.createRoom(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public getBlocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.roomService.getAllBlocks();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.roomService.getAllRooms();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
