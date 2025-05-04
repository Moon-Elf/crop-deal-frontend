import { CropType } from "../../enums/crop-type.enum";

export interface EditCropDto {
    id: string,
    name: string,
    type: CropType
}