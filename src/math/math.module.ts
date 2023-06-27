import { Module } from '@nestjs/common';
import { MathService } from './math.service';
import { MathController } from './math.controller';
import { CellService } from './cell.service';

@Module({
  providers: [MathService,CellService],
  controllers: [MathController]
})
export class MathModule {}
