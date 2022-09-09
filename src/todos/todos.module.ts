import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AuthService } from 'src/auth/auth.service';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService,AuthService],
  exports:[TodosService]
})
export class TodosModule {}
