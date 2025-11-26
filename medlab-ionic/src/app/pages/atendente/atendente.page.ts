import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BotaoGrandeComponent } from '../../components/botao-grande/botao-grande.component';
import { FilaService } from '../../services/fila.service';
import { SenhaService } from '../../services/senha.service';
import { Senha, TipoSenha } from '../../models/senha.model';

@Component({
  selector: 'app-atendente',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, BotaoGrandeComponent],
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss'],
})
export class AtendentePage implements OnInit {
  guicheAtual: number = 1;
  guiches: number[] = [1, 2, 3, 4, 5]; // Até 5 guichês disponíveis
  senhaAtual: Senha | null = null;
  tamanhoFila: number = 0;
  contagemPorTipo: { SP: number; SG: number; SE: number } = { SP: 0, SG: 0, SE: 0 };
  TipoSenha = TipoSenha;
  tempoMedioEsperado: number = 0;
  private filaCompleta: Senha[] = [];

  constructor(
    private filaService: FilaService,
    private senhaService: SenhaService
  ) {}

  ngOnInit(): void {
    this.filaService.fila$.subscribe((fila: Senha[]) => {
      this.filaCompleta = fila;
      this.tamanhoFila = fila.length;
      this.contagemPorTipo = this.filaService.obterContagemPorTipo();
    });

    this.filaService.ultimaSenhaChamada$.subscribe((senha: Senha | null) => {
      if (senha && senha.guiche === this.guicheAtual) {
        this.senhaAtual = senha;
        
        // Calcula tempo médio esperado para o tipo da senha
        if (senha.tipo) {
          this.tempoMedioEsperado = Math.round(
            this.filaService.calcularTempoMedioEsperado(senha.tipo)
          );
        }
      }
    });
  }

  onGuicheChange(guiche: number | string): void {
    this.guicheAtual = typeof guiche === 'string' ? parseInt(guiche, 10) : guiche;
    this.senhaAtual = null;
    this.tempoMedioEsperado = 0;
  }

  /**
   * Chama o próximo da fila seguindo a lógica de priorização
   * Qualquer guichê pode atender qualquer tipo de senha
   */
  chamarProximo(): void {
    const senha: Senha | null = this.filaService.chamarProximo(this.guicheAtual);
    if (senha) {
      this.senhaAtual = senha;
      
      // Calcula tempo médio esperado
      if (senha.tipo) {
        this.tempoMedioEsperado = Math.round(
          this.filaService.calcularTempoMedioEsperado(senha.tipo)
        );
      }
    }
  }

  /**
   * Inicia o atendimento da senha atual
   */
  iniciarAtendimento(): void {
    if (this.senhaAtual && !this.senhaAtual.dataAtendimentoInicio) {
      this.senhaAtual.dataAtendimentoInicio = new Date();
      this.senhaService.atualizarSenha(this.senhaAtual);
    }
  }

  /**
   * Finaliza o atendimento da senha atual
   */
  finalizarAtendimento(): void {
    if (this.senhaAtual) {
      this.filaService.finalizarAtendimento(this.senhaAtual);
      setTimeout(() => {
        this.senhaAtual = null;
        this.tempoMedioEsperado = 0;
      }, 2000);
    }
  }

  /**
   * Verifica se há senhas na fila
   */
  get temProximaSenha(): boolean {
    return this.filaCompleta.length > 0;
  }

  /**
   * Verifica se a senha atual está em atendimento
   */
  get emAtendimento(): boolean {
    return this.senhaAtual !== null && 
           this.senhaAtual.dataAtendimentoInicio !== undefined &&
           !this.senhaAtual.atendida;
  }

  /**
   * Obtém texto descritivo do tipo de senha
   */
  obterTipoTexto(tipo: TipoSenha): string {
    const tipos: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'Prioritária',
      [TipoSenha.SG]: 'Geral',
      [TipoSenha.SE]: 'Retirada de Exames'
    };
    return tipos[tipo] || tipo;
  }

  /**
   * Obtém cor do badge por tipo de senha
   */
  obterCorTipo(tipo: TipoSenha): string {
    const cores: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'danger',
      [TipoSenha.SG]: 'primary',
      [TipoSenha.SE]: 'success'
    };
    return cores[tipo] || 'medium';
  }

  /**
   * Formata data para exibição
   */
  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  /**
   * Formata tempo em minutos
   */
  formatarTempo(minutos: number): string {
    if (minutos < 1) {
      return '< 1 min';
    }
    return `${minutos} min`;
  }
}
