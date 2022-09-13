import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository, ObjectID } from 'typeorm';
import { User_Permission } from './entities/user.permission.entity';
import { UpdatePermissionDto } from './dto/update-user-permission';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(User_Permission)
    private readonly userPermissionRepository: MongoRepository<User_Permission>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    const permission = new User_Permission();
    
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }
    const existingUserEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const existingUserName = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserEmail || existingUserName) {
      throw new BadRequestException(['username or email is already taken']);
    }

    user.username = createUserDto.username;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.userType = 'USER';
    // if (createUserDto.userType) {
    //   user.userType = createUserDto.userType;
    // } else {
    //   user.userType = 'USER';
    // }
    const saveUser = await this.userRepository.save(user);
    permission.userId = saveUser._id.toString();
    permission.read = true;
    permission.write = false;
    permission.modify = false;
    permission.delete = false;
    await this.userPermissionRepository.save(permission)

    return {
      ...(saveUser),
      token: this.authService.generateToken(user),
    };
  }
  async createUserPermission(updatePermissionDto: UpdatePermissionDto){
    //console.log(updatePermissionDto);
    const property = await this.userRepository.findOneById(updatePermissionDto.userId);
    console.log(property);
    /* return this.userRepository.save({
      ...property, // existing fields
      ...updatePermissionDto, // updated fields
    }); */
  }

  async findAll() {
    return await await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneById(id);
  }
  async findOneByUsername(username: string) {
    const existingUserName = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!existingUserName) {
      throw new BadRequestException(['username not valid!']);
    }
    return existingUserName;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const property = await this.userRepository.findOneById(id);

    return this.userRepository.save({
      ...property, // existing fields
      ...updateUserDto, // updated fields
    });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new BadRequestException(['userid not valid!']);
    }
    return await this.userRepository.remove(user);
  }
}
