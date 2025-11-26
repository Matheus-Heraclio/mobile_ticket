import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Senha, TipoSenha } from '../../models/senha.model';

/** Exibe no painel de chamadas cards com senha, serviço, guiche e horario em padrao br ( PAINEL )*/
@Component({
  selector: 'app-painel-senha',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './painel-senha.component.html',
  styleUrls: ['./painel-senha.component.scss']
})
export class PainelSenhaComponent {
  @Input() senha!: Senha;

  obterTipoTexto(tipo: TipoSenha): string {
    const tipos: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'Serviço Prioritário',
      [TipoSenha.SG]: 'Serviço Geral',
      [TipoSenha.SE]: 'Serviço Especial'
    };
    return tipos[tipo] || tipo;
  }

  formatarHora(data: Date): string {
    return new Date(data).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
