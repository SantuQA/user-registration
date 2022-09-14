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
import { SessionSerializer } from './session.serializer';
import { User_Permission } from 'src/user/entities/user.permission.entity';
import { ProductsService } from '../ecommerce/products/products.service';
import { ProductsController } from '../ecommerce/products/products.controller';
import { ProductEntity } from 'src/ecommerce/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    TypeOrmModule.forFeature([User_Permission]),
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
    SessionSerializer,
    ProductsService
  ],
  controllers: [AuthController, UserController, TodosController,ProductsController],
  exports: [AuthService],
})
export class AuthModule {}
