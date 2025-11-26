import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Senha, TipoSenha } from '../../models/senha.model';

/** exibe uma tabela com todas as senhas, emissao, tipo, status....(DASHBOARD)*/
@Component({
  selector: 'app-tabela-senhas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tabela-senhas.component.html',
  styleUrls: ['./tabela-senhas.component.scss']
})
export class TabelaSenhasComponent {
  @Input() senhas: Senha[] = [];

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  getBadgeClass(tipo: TipoSenha): string {
    const classes: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'badge-sp',
      [TipoSenha.SG]: 'badge-sg',
      [TipoSenha.SE]: 'badge-se'
    };
    return classes[tipo] || 'badge-default';
  }

  getStatusClass(senha: Senha): string {
    if (senha.naoAtendida) return 'badge-nao-atendida';
    if (senha.atendida) return 'badge-atendida';
    if (senha.dataChamada) return 'badge-chamada';
    return 'badge-aguardando';
  }

  getStatusTexto(senha: Senha): string {
    if (senha.naoAtendida) return 'Não Atendida';
    if (senha.atendida) return 'Atendida';
    if (senha.dataChamada) return 'Chamada';
    return 'Aguardando';
  }
}
