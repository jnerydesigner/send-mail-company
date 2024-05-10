import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendMailDto } from './send-mail.dto';
import { SendMailService } from './send-mail.service';

@Controller('send-mail')
export class SendMailController {
  constructor(private readonly sendMailServie: SendMailService) {}
  @Get()
  sendMail() {
    return 'Mail sent successfully';
  }

  @Post()
  async sendMailPost(@Body() sendMailInput: SendMailDto) {
    return this.sendMailServie.sendMail(sendMailInput);
  }
}
