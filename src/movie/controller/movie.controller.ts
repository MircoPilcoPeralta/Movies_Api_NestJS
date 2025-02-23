import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';
import { MovieVo } from '../vo';
import { AddRaitingDto, CreateMovieDto } from '../dto';

@Controller('/api/movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll(): Promise<MovieVo[]> {
    const movies = await this.movieService.findAll();

    return movies.map(
      (movie) =>
        new MovieVo(
          movie.id,
          movie.title,
          movie.category,
          movie.releaseYear,
          movie.rateAverage,
          movie.voteCount,
        ),
    );
  }

  @Post()
  async register(@Body(ValidationPipe) createMovieDto: CreateMovieDto): Promise<MovieVo> {
    const savedMovie = await this.movieService.persist(createMovieDto);

    return new MovieVo(
      savedMovie.id,
      savedMovie.title,
      savedMovie.category,
      savedMovie.releaseYear,
      savedMovie.rateAverage,
      savedMovie.voteCount,
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MovieVo> {
    const findMovie = await this.movieService.findById(id);

    if (!findMovie) {
      throw new NotFoundException('The request movie ID does not exist');
    }

    return new MovieVo(
      findMovie.id,
      findMovie.title,
      findMovie.category,
      findMovie.releaseYear,
      findMovie.rateAverage,
      findMovie.voteCount,
    );
  }

  @Post(':id/raiting')
  async addRaiting(
    @Param('id', ParseIntPipe) id: number,
    @Body() addRaitingDto: AddRaitingDto,
  ): Promise<MovieVo> {
    try {
      const movie = await this.movieService.addRaiting(id, addRaitingDto.value);
      
      return new MovieVo(
        movie.id,
        movie.title,
        movie.category,
        movie.releaseYear,
        movie.rateAverage,
        movie.voteCount,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }



  }
}
