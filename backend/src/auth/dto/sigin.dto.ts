import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Username is required' })
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}