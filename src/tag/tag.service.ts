import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
    findAll() {
        return ["one", "two", "three"]
    }
}
