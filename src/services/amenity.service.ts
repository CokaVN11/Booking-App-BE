import { AmenityModel } from "@models";

export class AmenityService {
    private static instance: AmenityService | null = null;

    private constructor() { }

    static getInstance(): AmenityService {
        if (!AmenityService.instance) {
            AmenityService.instance = new AmenityService();
        }

        return AmenityService.instance;
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

    addAmenity = async (name: string) => {
        const amenity = new AmenityModel({ name });
        try {
            await amenity.save();
            return amenity;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

    updateAmenity = async (id: string, name: string) => {
        const amenity = await AmenityModel.findByIdAndUpdate(id, { name }, { new: true });
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

    checkListAmenity = async (amenities_ids: string[]) => {
        try {
            const amenities = await AmenityModel.find({ _id: { $in: amenities_ids } });
            if (amenities.length != amenities_ids.length) {
                return false;
            }
            return true;
        } catch (error) {
            const _error = error as Error;
            throw new Error(_error.message);
        }
    }

}