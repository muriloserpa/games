import { Status } from '@prisma/client';

export class CreateGameDto {
  name: string;
  description?: string;
  image?: string;
  rate: number;
  status?: Status;
}
