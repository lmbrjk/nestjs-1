import { JWT_SECRET } from "@app/config";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import {verify} from 'jsonwebtoken'
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService){}

    async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
        // next() - попадаем дальше в контроллер

        if(!req.headers.authorization){
            req.user = null
            next()
            return
        }

        const userToken = req.headers.authorization.split(' ')[1]

        try {
            const decodeUserToken = verify(userToken, JWT_SECRET)
            const user = await this.userService.getUserById(decodeUserToken.id)

            req.user = user
            next()
        } catch(err) {
            req.user = null
            next()
        }
        
    }
}