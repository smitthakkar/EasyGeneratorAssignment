import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI...' })
  token: string;
}