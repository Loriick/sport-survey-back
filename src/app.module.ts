import { Module } from '@nestjs/common';

import { LeaguesModule } from './leagues/leagues.modules';

@Module({
  imports: [LeaguesModule],
})
export class AppModule {}
