import { IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;

  @IsNotEmpty()
  providerId: number;
}
