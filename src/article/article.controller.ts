import { User } from '@app/decorators/user.decorator';
import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserEntity } from '@app/user/entities/user.entity';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<any> {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }
}
