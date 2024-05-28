import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entities/user.entity";
import {sign} from 'jsonwebtoken'
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userService: Repository<UserEntity>
    ){}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto)

        return await this.userService.save(newUser)
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