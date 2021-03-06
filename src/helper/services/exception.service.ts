import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ExceptionService {
  handleException(error: any) {
    if (error.name.includes('EntityNotFoundError'))
      throw new NotFoundException(error.message);
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        throw new ConflictException(error.message);
      case 'ER_NO_REFERENCED_ROW_2':
        throw new NotFoundException(error.message);
      case 'ER_NO_DEFAULT_FOR_FIELD':
        throw new ConflictException(error.message);
      default:
        throw new BadRequestException(error.message);
    }
  }
}
