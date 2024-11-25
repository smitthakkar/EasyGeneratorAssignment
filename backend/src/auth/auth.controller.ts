import { Controller, Post, Body, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SigninDto } from './dto/sigin.dto';
import { SignupResponseDto } from './dto/singup-response.dto';
import { SigninResponseDto } from './dto/sigin-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: SignupResponseDto })
  @ApiResponse({ status: 400, description: 'Validation errors' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(@Body() authDto: AuthDto) : Promise<SignupResponseDto>{
    Logger.log(`Starting request for signup`);
    return this.authService.signup(authDto.username, authDto.name, authDto.password);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiResponse({ status: 200, description: 'Successfully signed in', type: SigninResponseDto })
  @ApiResponse({ status: 400, description: 'Validation errors' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    Logger.log(`Starting request for signin`);
    return this.authService.signin(signinDto.username, signinDto.password);
  }
}