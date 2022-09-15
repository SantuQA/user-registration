import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository} from 'typeorm';
import { User_Permission } from './entities/user.permission.entity';
import { UpdatePermissionDto } from './dto/update-user-permission';
import { AccessController, USER_TYPES } from './role.enum';
import { ObjectID } from 'mongodb';
import { UpdateUserControllerAccessDto } from './dto/update-user-controller-accsess';
import { ACCESSS_CONTROL } from './entities/access.control.entity';


@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(User_Permission)
    private readonly userPermissionRepository: MongoRepository<User_Permission>,
    @InjectRepository(ACCESSS_CONTROL)
    private readonly userAccessControllerRepository: MongoRepository<ACCESSS_CONTROL>
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
    user.userType = USER_TYPES.USER;
    const saveUser = await this.userRepository.save(user);
    permission.userId = saveUser._id.toString();
    permission.read = true;
    permission.write = false;
    permission.modify = false;
    permission.delete = false;
    await this.userPermissionRepository.save(permission);

    return {
      ...(saveUser),
      token: this.authService.generateToken(user),
    };
  }
  async createUserPermission(updatePermissionDto: UpdatePermissionDto){
    const user = new User();
    const permission = new User_Permission();
    let updateUserRole :string; 
    const idByteCheck = ObjectID.isValid(updatePermissionDto.userId);
    if(!idByteCheck){
      throw new BadRequestException(['not a valid id']);
    }
    const user_master = await this.userRepository.findOneById(updatePermissionDto.userId);
    if (!user_master) {
      throw new NotFoundException(['user does not exist!']);
    }
    const user_permission = await this.userPermissionRepository.findOne({
      where: { userId: updatePermissionDto.userId },
    });
    permission.read = updatePermissionDto.read;
    permission.write = updatePermissionDto.write;
    permission.modify = updatePermissionDto.modify;
    permission.delete = updatePermissionDto.delete;

    if(permission.read  == true && permission.write == true && permission.modify == true && permission.delete == true){
      updateUserRole = USER_TYPES.ADMIN;
    }else if(permission.read  == true && permission.write == false && permission.modify == true && permission.delete == false){
      updateUserRole = USER_TYPES.EDITOR;
    }else if(permission.read  == true && permission.write == false && permission.modify == false && permission.delete == false){
      updateUserRole = USER_TYPES.USER;
    }
    user.userType = updateUserRole;
    const updateUserMaster = this.userRepository.save({
      ...user_master, // existing fields
      ...user, // updated fields
    });
    const updateUserPermission = this.userRepository.save({
      ...user_permission, // existing fields
      ...permission, // updated fields
    });
    if(updateUserMaster && updateUserPermission){
      return "User Role Update Successfully"
    }
  }
  async updateUserControllerAccess(updateUserControllerAccessDto : UpdateUserControllerAccessDto){
    const idByteCheck = ObjectID.isValid(updateUserControllerAccessDto.userId);
    if(!idByteCheck){
      throw new BadRequestException(['not a valid id']);
    }
    const user_master = await this.userRepository.findOneById(updateUserControllerAccessDto.userId);
    if (!user_master) {
      throw new NotFoundException(['user does not exist!']);
    }
    let access_array =[];
    access_array = updateUserControllerAccessDto.access_controller;
    let cnt = 0;
    for (let i = 0; i < access_array.length; i++) {
      const element = access_array[i];
      const existingPermission = await this.userAccessControllerRepository.findOne({
        where: { controllerName: element },
      });
      if (existingPermission) {
        return `${element} permission already granted`;
      } else {
        await this.userAccessControllerRepository.save({controllerName:element,userId:user_master._id})
        cnt+=1;
      }
    }
    if (cnt >1) {
      return `all permission granted`;
    } else {
      return `permission granted`;
    }
  }

  async findAll() {
    return await this.userRepository.find();
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
  async findAllControllerName(){
    return  AccessController;
  }
}
