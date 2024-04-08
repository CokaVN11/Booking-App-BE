import { AmenityModel } from "@models/room.model";

export class ModeratorService {
  private static instance: ModeratorService | null = null;

  private constructor() {}

  static getInstance(): ModeratorService {
    if (!ModeratorService.instance) {
      ModeratorService.instance = new ModeratorService();
    }

    return ModeratorService.instance;
  }

  getAllAmenity = async () => {
    const amenities = await AmenityModel.find();
    if (!amenities) {
      throw new Error("No amenities found");
    }
    return amenities;
  };

  getAmenity = async (id: string) => {
    const amenity = await AmenityModel.findById(id);
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  }

  addAmenity = async (name: string, amenity_id: string) => {
    const amenity = new AmenityModel({ name, amenity_id });
    try {
      await amenity.save();
      return amenity;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  updateAmenity = async (id: string, name: string, amenity_id: string) => {
    const amenity = await AmenityModel.findByIdAndUpdate(id, { name, amenity_id }, { new: true });
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  }

  deleteAmenity = async (id: string) => {
    const amenity = await AmenityModel.findByIdAndDelete(id);
    if (!amenity) {
      throw new Error("Amenity not found");
    }
    return amenity;
  }
}