import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entities/user.entity";
import {sign} from 'jsonwebtoken'
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { AuthUserDto } from "./dto/authUser.dto";
import { compare } from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ){}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
        const userByEmail = await this.userRepository.findOne({
            where: {
                email: createUserDto.email
            }
        })

        const userByName = await this.userRepository.findOne({
            where: {
                username: createUserDto.username
            }
        })

        if(userByEmail || userByName){
            throw new HttpException('email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto)

        return await this.userRepository.save(newUser)
    }

    async authUser(authUserDto: AuthUserDto): Promise<UserEntity>{
        const userByEmail = await this.userRepository.findOne({
            where: {
                email: authUserDto.email
            },
            // без этого password-а не будет в userByEmail т.к entity {select: false}
            select: ['id', 'email', 'image', 'bio', 'username', 'password']
        })

        if(!userByEmail){
            throw new HttpException('there is no user with this username', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const passwordIsRight = this.hashPasswordComparison(authUserDto.password, userByEmail.password)

        if(!passwordIsRight){
            throw new HttpException('password is wrong', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        //  убирем из ответа пользователю пароль
        delete userByEmail.password

        return userByEmail
    }

    async hashPasswordComparison(password, passwordHashFromBase){
        const isRightPassword = await compare(password, passwordHashFromBase)
        return isRightPassword
    }

    getUserById(id: number): Promise<UserEntity>{
        return this.userRepository.findOne({
            where: {
                id: id
            }
        })
    }

    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, JWT_SECRET)
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }
}