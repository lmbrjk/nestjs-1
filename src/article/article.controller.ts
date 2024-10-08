import { User } from '@app/decorators/user.decorator';
import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserEntity } from '@app/user/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async delete(@User('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(currentUserId, slug);
  }

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articleBySlug = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(articleBySlug);
  }
}
