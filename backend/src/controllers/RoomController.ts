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

  public deleteBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.roomService.deleteBlock(req.params.id as string);
      res.status(200).json({ success: true, message: 'Block deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2003') {
        res.status(400).json({ success: false, message: 'Cannot delete block: it contains active room allocations' });
      } else {
        next(error);
      }
    }
  };

  public deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.roomService.deleteRoom(req.params.id as string);
      res.status(200).json({ success: true, message: 'Room deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2003') {
        res.status(400).json({ success: false, message: 'Cannot delete room: it is actively allocated' });
      } else {
        next(error);
      }
    }
  };
}
