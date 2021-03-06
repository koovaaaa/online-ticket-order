import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPlaceService } from './admin-place.service';
import { AddCountryAdminDto } from './dto/add-country.admin.dto';
import { Country } from '../../../entity/country/country.entity';
import { EditCountryAdminDto } from './dto/edit-country.admin.dto';
import { AddCityAdminDto } from './dto/add-city.admin.dto';
import { AddCitiesAdminDto } from './dto/add-cities.admin.dto';
import { EditCityAdminDto } from './dto/edit-city.admin.dto';
import { City } from '../../../entity/city/city.entity';
import { PaginationDto } from '../../../helper/dto/pagination.dto';
import { PaginationService } from '../../../helper/services/pagination.service';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { PaginationTypeEnum } from '../../../enum/pagination-type.enum';

@ApiTags('Admin Place')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/places')
export class AdminPlaceController {
  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly paginationService: PaginationService,
  ) {}
  @Get('country/get-countries')
  async getAllCountries() {
    return await this.adminPlaceService.getAllCountries();
  }

  @Get('country/:id')
  async getCountryById(@Param('id') countryId: string): Promise<Country> {
    return await this.adminPlaceService.getCountryById(countryId);
  }

  @Post('country/add-country')
  async addNewCountry(
    @Body() createNewCountry: AddCountryAdminDto,
  ): Promise<Country> {
    return await this.adminPlaceService.addNewCountry(createNewCountry);
  }

  @Put('country/edit-country/:id')
  async editCountry(
    @Param('id') countryId: string,
    @Body() editCountry: EditCountryAdminDto,
  ): Promise<Country> {
    return await this.adminPlaceService.editCountry(countryId, editCountry);
  }

  @Get('city/get-cities')
  async getAllCities(@Query() pagination: PaginationDto): Promise<City[]> {
    const paginationSet = this.paginationService.setPagination(
      pagination,
      PaginationTypeEnum.TABLE,
    );
    return await this.adminPlaceService.getAllCities(paginationSet);
  }

  @Get('city/get-city/:id')
  async getCityById(@Param('id') cityId: string): Promise<City> {
    return await this.adminPlaceService.getCityById(cityId);
  }

  @Get('city/get-cities-from-country/:id')
  async getCitiesFromCountry(
    @Query() pagination: PaginationDto,
    @Param('id') countryId: string,
  ): Promise<{
    cities: City[];
    numberOfCities: number;
    defaultPerPage: number;
  }> {
    return await this.adminPlaceService.getCitiesFromCountry(
      countryId,
      pagination,
    );
  }

  @Post('city/add-city')
  async addNewCity(@Body() addCity: AddCityAdminDto): Promise<City> {
    return await this.adminPlaceService.addCity(addCity);
  }

  @Post('city/add-cities')
  async addNewCities(@Body() newCities: AddCitiesAdminDto): Promise<City[]> {
    return await this.adminPlaceService.addCities(newCities);
  }

  @Put('city/edit-city/:id')
  async editCity(
    @Param('id') cityId: string,
    @Body() editCity: EditCityAdminDto,
  ): Promise<City> {
    return await this.adminPlaceService.editCity(cityId, editCity);
  }
}
