import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    // временный slug
    article.slug = 'slug';

    // tipeORM сам подставит id из currentUser в связь между User и Article
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }
}
