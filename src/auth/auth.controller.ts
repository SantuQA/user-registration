import { Controller, Post, Request, UseGuards, Get,ValidationPipe, Body  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth-guard.jwt';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiUnauthorizedResponse,ApiCreatedResponse, ApiBody , ApiBearerAuth} from '@nestjs/swagger';
import { LoginBody, LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserCurrent } from 'src/user/user.decorator';
import { LocalGuard } from './auth-guard.local';
import { SessionGuard } from './session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOkResponse({description:'User Login'})
  @ApiUnauthorizedResponse({description: 'Invalid credentials'})
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    const token = await this.authService.generateToken(req.user);
    return {
      userId: req.user._id,
      access_token: token,
    };
  }
  @Get('profile')
  @UseGuards(SessionGuard)
  @ApiBearerAuth()
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  } 
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' }
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
