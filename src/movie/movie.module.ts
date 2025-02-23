import { Module } from '@nestjs/common';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
