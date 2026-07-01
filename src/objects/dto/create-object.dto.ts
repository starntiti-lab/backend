import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateObjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @MinLength(2, { message: 'Le titre doit faire au moins 2 caractères' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire' })
  @MinLength(5, { message: 'La description doit faire au moins 5 caractères' })
  description: string;
}