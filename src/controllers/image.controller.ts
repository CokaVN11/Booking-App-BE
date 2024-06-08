import { Request, Response } from "express";
import { ImageService } from "@services";

export class ImageController {
  private static instance: ImageController | null = null;

  private constructor() {}

  static getInstance(): ImageController {
    if (!ImageController.instance) {
      ImageController.instance = new ImageController();
    }

    return ImageController.instance;
  }

  uploadImage = async (req: Request, res: Response) => {
    try {
      const result = await ImageService.getInstance().uploadImage(
        (req as any).file
      );
      res
        .status(200)
        .json({ message: "Image uploaded successfully", url: result });
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };

  deleteImage = async (req: Request, res: Response) => {
    try {
      const public_id = req.params.public_id;
      const result = await ImageService.getInstance().deleteImage(public_id);
      res.status(200).json(result);
    } catch (error) {
      const _error = error as Error;
      res.status(400).json({ message: _error.message });
    }
  };
}
