import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/entities/todo.entity';
import { User_Permission } from './user/entities/user.permission.entity';
import 'dotenv/config';
import { ProductEntity } from './ecommerce/products/entities/product.entity';
import { CartEntity } from './ecommerce/cart/cart.entity';
import { OrderEntity } from './ecommerce/order/order.entity';
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'mongodb',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User,Todo,ProductEntity,CartEntity,OrderEntity],
      synchronize: false,
      useUnifiedTopology: true,
      authMechanism: 'DEFAULT',
      authSource: 'admin',
      logging: true
    }),
    AuthModule
    
    
  ]
})
export class AppModule {}
