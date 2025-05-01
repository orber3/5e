import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExamplesService } from './examples.service';
import { PaginationDto } from '../dto/pagination.dto';
import { CreateNameDto } from './dto/create-name.dto';
import { UpdateNameDto } from './dto/update-name.dto';

import type { NamesResponseDto } from '@y/libs';

@ApiTags('examples')
@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Get('names')
  @ApiOperation({ summary: 'Get a list of example names' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of names',
    type: 'NamesResponseDto', // Swagger will get this from decorator
  })
  async getNames(): Promise<NamesResponseDto> {
    const names = await this.examplesService.getNames();
    return { names };
  }

  @Get('names/paginated')
  @ApiOperation({ summary: 'Get paginated list of names' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of names',
  })
  async getPaginatedNames(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.examplesService.getPaginatedNames(page, limit);
  }

  @Get('names/:id')
  @ApiOperation({ summary: 'Get a name by ID' })
  @ApiParam({ name: 'id', description: 'Name ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a name by ID',
  })
  async getNameById(@Param('id') id: string) {
    return this.examplesService.getNameById(id);
  }

  @Post('names')
  @ApiOperation({ summary: 'Create a new name' })
  @ApiBody({
    type: CreateNameDto,
    description: 'Name data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'The name has been successfully created',
  })
  async createName(@Body() createNameDto: CreateNameDto) {
    return this.examplesService.createName(createNameDto.name);
  }

  @Put('names/:id')
  @ApiOperation({ summary: 'Update a name' })
  @ApiParam({ name: 'id', description: 'Name ID' })
  @ApiBody({
    type: UpdateNameDto,
    description: 'Updated name data',
  })
  @ApiResponse({
    status: 200,
    description: 'The name has been successfully updated',
  })
  async updateName(
    @Param('id') id: string,
    @Body() updateNameDto: UpdateNameDto
  ) {
    return this.examplesService.updateName(id, updateNameDto.name);
  }

  @Delete('names/:id')
  @ApiOperation({ summary: 'Delete a name' })
  @ApiParam({ name: 'id', description: 'Name ID' })
  @ApiResponse({
    status: 200,
    description: 'The name has been successfully deleted',
  })
  async deleteName(@Param('id') id: string) {
    return this.examplesService.deleteName(id);
  }
}
