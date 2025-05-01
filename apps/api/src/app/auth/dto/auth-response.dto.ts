import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'User data',
    type: UserResponseDto,
  })
  user!: UserResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout status message',
    example: 'Logout successful',
  })
  message!: string;
}
