import { User } from '@app/decorators/user.decorator';
import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UpdateArticleDto } from '@app/dto/updateArticle.dto';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserEntity } from '@app/user/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleEntity } from './entities/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAllArticles(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getAllArticles(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
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

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articleBySlug = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(articleBySlug);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async delete(@User('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const updatedArticle = await this.articleService.updateArticle(
      currentUserId,
      slug,
      updateArticleDto,
    );

    return this.articleService.buildArticleResponse(updatedArticle);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const likeArticle = await this.articleService.likeArticle(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(likeArticle);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async dislikeArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const likeArticle = await this.articleService.dislikeArticle(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(likeArticle);
  }
}
