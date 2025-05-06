import { NgModule } from '@angular/core';
import { ShortenIdPipe } from './shorten-id.pipe';

@NgModule({
  declarations: [ShortenIdPipe],
  exports: [ShortenIdPipe]
})
export class PipesModule {}