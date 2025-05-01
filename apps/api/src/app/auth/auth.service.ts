import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersService.getUserByEmail(
      registerDto.email
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    return this.usersService.createUser(registerDto);
  }

  /**
   * Login user and return JWT token
   */
  async login(
    loginDto: LoginDto
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user,
    };
  }

  /**
   * Validate user credentials
   */
  private async validateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    // Use the comparePassword method from the UserDocument
    const isPasswordValid = await (
      user as UserDocument & {
        comparePassword: (password: string) => Promise<boolean>;
      }
    ).comparePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: (user as unknown as { _id: string })._id.toString(),
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'your_jwt_secret'),
      expiresIn: '12h', // Set to 12 hours as requested
    });
  }
}
