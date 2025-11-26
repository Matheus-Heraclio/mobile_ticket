import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Senha, TipoSenha } from '../models/senha.model';
import { SenhaService } from './senha.service';

@Injectable({
  providedIn: 'root'
})
export class FilaService {
  private fila: Senha[] = [];
  private filaSubject = new BehaviorSubject<Senha[]>([]);
  public fila$ = this.filaSubject.asObservable();

  private ultimaSenhaChamada: Senha | null = null;
  private ultimaSenhaChamadaSubject = new BehaviorSubject<Senha | null>(null);
  public ultimaSenhaChamada$ = this.ultimaSenhaChamadaSubject.asObservable();

  // Controle da sequência de priorização: [SP] -> [SE|SG] -> [SP] -> [SE|SG]
  private ultimoTipoChamado: TipoSenha | null = null;

  constructor(private senhaService: SenhaService) {
    this.senhaService.senhas$.subscribe((senhas: Senha[]) => {
      this.fila = senhas.filter((s: Senha) => !s.dataChamada && !s.naoAtendida);
      this.ordenarFila();
      this.filaSubject.next([...this.fila]);
    });
  }

  /**
   * Ordena a fila por data de emissão (FIFO dentro de cada tipo)
   */
  private ordenarFila(): void {
    if (this.fila.length <= 1) return;
    this.fila.sort((a, b) => a.dataEmissao.getTime() - b.dataEmissao.getTime());
  }

  /**
   * Chama o próximo da fila seguindo a lógica de priorização:
   * [SP] -> [SE|SG] -> [SP] -> [SE|SG]
   * 
   * Qualquer guichê pode atender qualquer tipo de senha
   */
  chamarProximo(guiche: number | string): Senha | null {
    const guicheNum = typeof guiche === 'string' ? parseInt(guiche, 10) : guiche;
    
    if (this.fila.length === 0) {
      return null;
    }

    const proximaSenha = this.obterProximaSenhaPorPrioridade();
    
    if (!proximaSenha) {
      return null;
    }

    // Remove da fila
    const index = this.fila.findIndex(s => s.id === proximaSenha.id);
    if (index !== -1) {
      this.fila.splice(index, 1);
    }

    // Atualiza dados da senha
    proximaSenha.dataChamada = new Date();
    proximaSenha.guiche = guicheNum;

    // Simula 5% de não atendimento
    if (Math.random() < 0.05) {
      proximaSenha.naoAtendida = true;
    } else {
      proximaSenha.dataAtendimentoInicio = new Date();
    }

    // Atualiza controle de priorização
    this.ultimoTipoChamado = proximaSenha.tipo;

    this.senhaService.atualizarSenha(proximaSenha);
    this.filaSubject.next([...this.fila]);
    this.ultimaSenhaChamada = proximaSenha;
    this.ultimaSenhaChamadaSubject.next(proximaSenha);

    return proximaSenha;
  }

  /**
   * Obtém a próxima senha seguindo a lógica de priorização
   * [SP] -> [SE|SG] -> [SP] -> [SE|SG]
   */
  private obterProximaSenhaPorPrioridade(): Senha | null {
    // Separa as senhas por tipo
    const senhasSP = this.fila.filter(s => s.tipo === TipoSenha.SP);
    const senhasSE = this.fila.filter(s => s.tipo === TipoSenha.SE);
    const senhasSG = this.fila.filter(s => s.tipo === TipoSenha.SG);

    // Se não há senhas, retorna null
    if (this.fila.length === 0) {
      return null;
    }

    // Lógica de priorização alternada
    if (this.ultimoTipoChamado === TipoSenha.SP) {
      // Último foi SP, agora deve chamar SE ou SG
      // Prioriza SE se houver, senão SG
      if (senhasSE.length > 0) {
        return senhasSE[0];
      } else if (senhasSG.length > 0) {
        return senhasSG[0];
      } else if (senhasSP.length > 0) {
        // Se não há SE nem SG, chama SP novamente
        return senhasSP[0];
      }
    } else {
      // Último foi SE ou SG (ou null no início), agora deve chamar SP
      if (senhasSP.length > 0) {
        return senhasSP[0];
      } else {
        // Se não há SP, chama SE ou SG
        if (senhasSE.length > 0) {
          return senhasSE[0];
        } else if (senhasSG.length > 0) {
          return senhasSG[0];
        }
      }
    }

    return null;
  }

  /**
   * Finaliza o atendimento de uma senha
   * Calcula o tempo de atendimento baseado no tipo
   */
  finalizarAtendimento(senha: Senha): void {
    if (senha.naoAtendida) {
      // Se não foi atendida, apenas atualiza
      this.senhaService.atualizarSenha(senha);
      return;
    }

    if (senha.dataAtendimentoInicio) {
      senha.dataAtendimentoFim = new Date();
      senha.atendida = true;
      
      // Calcula tempo real de atendimento
      const tempoMs: number = senha.dataAtendimentoFim.getTime() - senha.dataAtendimentoInicio.getTime();
      senha.tempoAtendimento = Math.round(tempoMs / 60000); // em minutos
      
      this.senhaService.atualizarSenha(senha);
    }
  }

  /**
   * Calcula o tempo médio esperado de atendimento por tipo de senha
   * SP: 15min ± 5min
   * SG: 5min ± 3min  
   * SE: 95% = 1min, 5% = 5min
   */
  calcularTempoMedioEsperado(tipo: TipoSenha): number {
    switch (tipo) {
      case TipoSenha.SP:
        // 15 ± 5 minutos (10 a 20 minutos)
        return 15 + (Math.random() * 10 - 5);
      
      case TipoSenha.SG:
        // 5 ± 3 minutos (2 a 8 minutos)
        return 5 + (Math.random() * 6 - 3);
      
      case TipoSenha.SE:
        // 95% = 1 minuto, 5% = 5 minutos
        return Math.random() < 0.95 ? 1 : 5;
      
      default:
        return 5;
    }
  }

  /**
   * Obtém a fila atual
   */
  obterFila(): Senha[] {
    return [...this.fila];
  }

  /**
   * Obtém contagem de senhas por tipo na fila
   */
  obterContagemPorTipo(): { SP: number; SG: number; SE: number } {
    return {
      SP: this.fila.filter(s => s.tipo === TipoSenha.SP).length,
      SG: this.fila.filter(s => s.tipo === TipoSenha.SG).length,
      SE: this.fila.filter(s => s.tipo === TipoSenha.SE).length
    };
  }
}
