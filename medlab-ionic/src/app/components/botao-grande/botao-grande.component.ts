import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/*aqui fica as cores/personalizaçao do botoes (TOTEM/ATENDENTE) */

type CorBotao = 'azul' | 'verde' | 'vermelho' | 'amarelo';

interface CoresMap {
  [key: string]: string;
}

@Component({
  selector: 'app-botao-grande',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './botao-grande.component.html',
  styleUrls: ['./botao-grande.component.scss']
})

export class BotaoGrandeComponent {
  @Input() texto: string = '';
  @Input() cor: CorBotao = 'azul';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  get classeCor(): string {
    const cores: CoresMap = {
      azul: 'bg-blue-600 hover:bg-blue-700 text-white',
      verde: 'bg-green-600 hover:bg-green-700 text-white',
      vermelho: 'bg-red-600 hover:bg-red-700 text-white',
      amarelo: 'bg-yellow-400 hover:bg-yellow-600 text-gray-900'
    };
    return cores[this.cor];
  }
}
