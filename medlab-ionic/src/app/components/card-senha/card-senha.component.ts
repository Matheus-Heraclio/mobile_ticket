import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Senha, TipoSenha } from '../../models/senha.model';

/** aqui ele exibe nos cards a senha, o serviço, o guiche e o horario em padrao br ( TOTEM )*/

@Component({
  selector: 'app-card-senha',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './card-senha.component.html',
  styleUrls: ['./card-senha.component.scss']
})
export class CardSenhaComponent {
  @Input() senha!: Senha;

  obterTipoTexto(tipo: TipoSenha): string {
    const tipos: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'Serviço Prioritário',
      [TipoSenha.SG]: 'Serviço Geral',
      [TipoSenha.SE]: 'Serviço de Exame'
    };
    return tipos[tipo] || tipo;
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  get classeBorda(): string {
    const cores: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'border-red-500',
      [TipoSenha.SG]: 'border-blue-500',
      [TipoSenha.SE]: 'border-green-500'
    };
    return cores[this.senha.tipo] || 'border-gray-500';
  }
}
