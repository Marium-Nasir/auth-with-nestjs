/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class GenerateToken {
  constructor(private readonly jwtService: JwtService) {}
  async genToken(payload, expiresIn) {
    const expiresInSec = parseInt(expiresIn);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresInSec,
    });
    return token;
  }

  async decodeToken(token: string) {
    const decode = await this.jwtService.decode(token);
    return decode;
  }
}
