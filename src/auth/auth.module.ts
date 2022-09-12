import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserController } from '../user/user.controller';
import { LocalStrategy } from './local.strategy';
import { TodosService } from 'src/todos/todos.service';
import { TodosController } from 'src/todos/todos.controller';
import { Todo } from 'src/todos/entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Todo]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'TheQA',
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
    
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UserService,
    TodosService,
  ],
  controllers: [AuthController, UserController, TodosController],
  exports: [AuthService],
})
export class AuthModule {}
