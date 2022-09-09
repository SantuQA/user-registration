import { Controller, Post, Request, UseGuards, Get,ValidationPipe, Body  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth-guard.jwt';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiUnauthorizedResponse,ApiCreatedResponse, ApiBody , ApiBearerAuth} from '@nestjs/swagger';
import { LoginBody, LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOkResponse({description:'User Login'})
  @ApiUnauthorizedResponse({description: 'Invalid credentials'})
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    const token = await this.authService.generateToken(req.user);
    return {
      userId: req.user._id,
      access_token: token,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  } 
  /* @Post()
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBody({ type: RegisterBody })
  async register(
    @Body(ValidationPipe) credentials: RegisterDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginBody })
  async login(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.login(credentials);
    return { user };
  } */
}
