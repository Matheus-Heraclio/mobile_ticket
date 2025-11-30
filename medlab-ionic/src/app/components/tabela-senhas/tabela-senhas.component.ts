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

  formatarTempo(minutos: number | undefined | null): string {
    if (minutos === undefined || minutos === null) return '-';
    // Garante que o valor é um número antes de usar toFixed
    if (typeof minutos !== 'number') return '-'; 
    // Se menor que 1 minuto, mostra em segundos
    if (minutos < 1) {
      const segundos = minutos * 60;
      return `${segundos.toFixed(1)} seg`;
    }
    return `${minutos.toFixed(2)} min`;
  }
}
