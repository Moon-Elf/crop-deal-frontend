import { CropType } from '../../enums/crop-type.enum';

export interface CropDto {
  id: string;
  name: string;
  type: CropType;
  createdAt: string;
}
