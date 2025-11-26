import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BotaoGrandeComponent } from '../../components/botao-grande/botao-grande.component';
import { SenhaService } from '../../services/senha.service';
import { TipoSenha, Senha } from '../../models/senha.model';

@Component({
  selector: 'app-totem',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, BotaoGrandeComponent],
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss'],
})
export class TotemPage {
  TipoSenha = TipoSenha;
  senhaGerada: Senha | null = null;
  mensagemErro: string | null = null;
  horarioFuncionamento: boolean = true;

  constructor(private senhaService: SenhaService) {
    this.verificarHorario();
    // Verifica horário a cada minuto
    setInterval(() => this.verificarHorario(), 60000);
  }

  verificarHorario(): void {
    this.horarioFuncionamento = this.senhaService.estaNoHorarioDeFuncionamento();
  }

  emitirSenha(tipo: TipoSenha): void {
    try {
      this.mensagemErro = null;
      this.senhaGerada = this.senhaService.emitirSenha(tipo);
      
      setTimeout(() => {
        this.senhaGerada = null;
      }, 10000);
    } catch (error: any) {
      this.mensagemErro = error.message || 'Erro ao emitir senha';
      setTimeout(() => {
        this.mensagemErro = null;
      }, 5000);
    }
  }

  obterTipoTexto(tipo: TipoSenha): string {
    const tipos: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'Serviço Prioritário',
      [TipoSenha.SG]: 'Serviço Geral',
      [TipoSenha.SE]: 'Serviço Especial'
    };
    return tipos[tipo] || tipo;
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}
