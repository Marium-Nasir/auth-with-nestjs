import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
// import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
// @UseInterceptors(CacheInterceptor)
// @CacheTTL(60000)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('getdata')
  // async getData() {
  //   try {
  //     return await this.appService.getData();
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }
  // @Post('setdata')
  // async postData(@Body() createDataDto: any) {
  //   try {
  //     return await this.appService.postData(createDataDto);
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }
}
