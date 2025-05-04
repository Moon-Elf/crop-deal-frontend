import { CropType } from "../../enums/crop-type.enum";

export interface CreateCropDto {
    name: string,
    type: CropType;
}