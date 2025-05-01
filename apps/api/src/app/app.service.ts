import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class AppService {
  getData(): MessageDto {
    const message = new MessageDto();
    message.message = 'Hello API';
    return message;
  }
}
