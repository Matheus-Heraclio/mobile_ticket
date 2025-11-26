import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotemPageRoutingModule } from './totem-routing.module';

import { TotemPage } from './totem.page';
import { BotaoGrandeComponent } from '../../components/botao-grande/botao-grande.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotemPageRoutingModule,
    BotaoGrandeComponent,
    TotemPage
  ]
})
export class TotemPageModule {}
