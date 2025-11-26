import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtendentePageRoutingModule } from './atendente-routing.module';

import { AtendentePage } from './atendente.page';
import { BotaoGrandeComponent } from '../../components/botao-grande/botao-grande.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtendentePageRoutingModule,
    BotaoGrandeComponent,
    AtendentePage
  ]
})
export class AtendentePageModule {}
