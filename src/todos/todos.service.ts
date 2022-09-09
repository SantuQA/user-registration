import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MongoRepository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Todo)
    private readonly todoRepository: MongoRepository<Todo>,
  ) {}
  // create(createTodoDto: CreateTodoDto) {
  //   return 'This action adds a new todo';
  // }

  // findAll() {
  //   return `This action returns all todos`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} todo`;
  // }

  // update(id: number, updateTodoDto: UpdateTodoDto) {
  //   return `This action updates a #${id} todo`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} todo`;
  // }
  async create(createTodoDto: CreateTodoDto) {
    const todo = new Todo();
   

    todo.userId = createTodoDto.userId;
    todo.title = createTodoDto.title;
    todo.completed = createTodoDto.completed;
   
    return {
      ...(await this.todoRepository.save(todo))
    };
  }

  async findAll() {
    return await this.todoRepository.find();
  }

  async findOne(id: string) {
    return await this.todoRepository.findOneById(id);
  }
  // async findOneByUsername(userId: string) {
  //   const existingUserName = await this.todoRepository.findOne({
  //     where: { userId: userId },
  //   });
  //   if (!existingUserName) {
  //     throw new BadRequestException(['username not valid!']);
  //   }
  //   return existingUserName;
  // }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const property = await this.todoRepository.findOneById(id);
    const todo = await this.todoRepository.findOneById(id);

    return this.todoRepository.save({
      ...property,
      ...updateTodoDto,
    });
  }

  async remove(id: string) {
    const todo = await this.todoRepository.findOneById(id);
    if (!todo) {
      throw new BadRequestException(['todo not found!']);
    }
    return await this.todoRepository.remove(todo);
  }
}
