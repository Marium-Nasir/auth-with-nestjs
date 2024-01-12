// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  getHello(): string {
    return 'Hello World!';
  }

  // async getData(): Promise<string | undefined> {
  //   const value = await this.cacheManager.get<string>('key'); // ? Retrieve data from the cache
  //   return value;
  // }
  // async postData(createDataDto: object) {
  //   const value = createDataDto;
  //   await this.cacheManager.set('key', JSON.stringify(value)); //  ? Set data in the cache
  // }
}
