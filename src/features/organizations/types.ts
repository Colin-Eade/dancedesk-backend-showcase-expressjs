import { BaseDTO } from '@/types/dto';

export interface OrganizationDTO extends Omit<BaseDTO, 'organizationId'> {
  name: string;
}
