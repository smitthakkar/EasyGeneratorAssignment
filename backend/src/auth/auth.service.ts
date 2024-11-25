import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SigninResponseDto } from './dto/sigin-response.dto';
import { SignupResponseDto } from './dto/singup-response.dto';
import { UserSession } from './schemas/user-session.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSession.name) private userSessionModel: Model<UserSession>,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, name: string, password: string): Promise<SignupResponseDto> {
    // Check if the user already exists
    const userExists = await this.userModel.findOne({ email});
    if (userExists) {
      Logger.log("User doesn't exist");
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new this.userModel({ email, name, password: hashedPassword });
    await newUser.save();
    Logger.log("User saved successfully");
    // Return a JWT token
    const payload = { email: newUser.email, name: newUser.name };
    return payload;
  }

  async signin(email: string, password: string): Promise<SigninResponseDto> {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    Logger.log('Found user', !!user);
    if (!user) {
      Logger.error('Failed to find user');
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      Logger.error("Password doesn't match");
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Return JWT token
    const payload = { email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);
    Logger.log("Token created successfully");
    const newSession = new this.userSessionModel({email, token});
    await newSession.save();
    return { token };
  }
}