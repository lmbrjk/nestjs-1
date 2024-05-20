import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagEntity } from './entities/tag.entity';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService){}

    @Get()
    async findAll(): Promise<{tags: string[]}> {
        return await this.tagService.findAll()
    }
}
