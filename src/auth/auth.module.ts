import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from "@nestjs/jwt";
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserController } from '../user/user.controller';
import { LocalStrategy } from './local.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User]),JwtModule.registerAsync({
    useFactory: () => ({
      secret: "TheQA",
      signOptions: {
        expiresIn: '60m'
      }
    })
  })],
  providers: [LocalStrategy,JwtStrategy,AuthService,UserService],
  controllers:[AuthController,UserController],
  exports:[AuthService],
  
})
export class AuthModule {}
