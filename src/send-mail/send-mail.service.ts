import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './send-mail.dto';
import { promisify } from 'node:util';
import * as fs from 'node:fs';

const readFileAsync = promisify(fs.readFile);
const createFileAsync = promisify(fs.writeFile);

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(sendMailInput: SendMailDto) {
    const template = await readFileAsync(
      'src/template/mail.template.html',
      'utf8',
    );

    const replacedTemplateSaudation = this.replaceData(
      template,
      '{{saudation}}',
      this.getGreetings(),
    );

    let replacedTemplate = this.replaceData(
      replacedTemplateSaudation,
      '{{recrutador}}',
      sendMailInput.name,
    );

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{vaga}}',
      sendMailInput.vacancy,
    );

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{empresa}}',
      sendMailInput.company,
    );

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{empresa}}',
      sendMailInput.company,
    );

    replacedTemplate = this.replaceData(replacedTemplate, '{{emoji}}', '💪');

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{area}}',
      'Desenvolvimento de Software',
    );

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{empresa}}',
      sendMailInput.company,
    );

    replacedTemplate = this.replaceData(
      replacedTemplate,
      '{{candidato}}',
      process.env.MAIL_CANDIDATE_NAME,
    );

    await createFileAsync(
      'src/template/replace-template.html',
      replacedTemplate,
    );

    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL_FROM,
        to: sendMailInput.email,
        subject: `Vaga de Emprego: ${sendMailInput.vacancy}`,
        html: replacedTemplate,
      });
    } catch (err) {
      console.log(err);
    }

    return {
      send: sendMailInput,
    };
  }

  replaceData(template: string, data: string, replace: string) {
    return template.replace(data, replace);
  }

  getGreetings() {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {
      return 'Good Morning! 🏖';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon! 🏜';
    } else {
      return 'Good Evening! 🎑';
    }
  }
}
