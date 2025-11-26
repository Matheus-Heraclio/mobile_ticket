import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Senha, TipoSenha } from '../models/senha.model';

interface SenhaSerializada {
  id: string;
  numero: string;
  tipo: TipoSenha;
  dataEmissao: string;
  dataChamada: string | null;
  dataAtendimentoInicio: string | null;
  dataAtendimentoFim: string | null;
  guiche?: number;
  atendida: boolean;
  naoAtendida: boolean;
  tempoAtendimento?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SenhaService {
  private senhas: Senha[] = [];
  private senhasSubject = new BehaviorSubject<Senha[]>([]);
  public senhas$ = this.senhasSubject.asObservable();
  private contadoresDiarios: { [key: string]: number } = {};
  private readonly STORAGE_KEY_SENHAS = 'sistema_senhas_dados';
  private readonly STORAGE_KEY_CONTADORES = 'sistema_senhas_contadores';

  constructor() {
    this.carregarDados();
    this.iniciarLimpezaAutomatica();
  }

  /**
   * Inicia limpeza automática diária às 17h
   */
  private iniciarLimpezaAutomatica(): void {
    // Verifica a cada hora se passou das 17h para limpar
    setInterval(() => {
      const agora = new Date();
      const hora = agora.getHours();
      const minuto = agora.getMinutes();
      
      // Se for 17h00, limpa as senhas do dia
      if (hora === 17 && minuto === 0) {
        this.limparSenhasDoDia();
      }
    }, 60000); // Verifica a cada minuto
  }

  emitirSenha(tipo: TipoSenha): Senha {
    const hoje = new Date();
    
    // Validação de horário de funcionamento (7h - 17h)
    const hora = hoje.getHours();
    if (hora < 7 || hora >= 17) {
      throw new Error('Fora do horário de funcionamento. O sistema opera das 7h às 17h.');
    }
    const dataStr = this.formatarData(hoje);
    const chave = `${dataStr}-${tipo}`;

    if (!this.contadoresDiarios[chave]) {
      this.contadoresDiarios[chave] = 0;
    }
    this.contadoresDiarios[chave]++;

    const sequencia = this.contadoresDiarios[chave]!.toString().padStart(2, '0');
    const numero = `${dataStr}-${tipo}${sequencia}`;

    const novaSenha: Senha = {
      id: this.gerarId(),
      numero,
      tipo,
      dataEmissao: hoje,
      atendida: false,
      naoAtendida: false
    };

    this.senhas.push(novaSenha);
    this.salvarDados();
    this.senhasSubject.next([...this.senhas]);
    return novaSenha;
  }

  obterSenhas(): Senha[] {
    return [...this.senhas];
  }

  obterUltimasChamadas(quantidade: number = 5): Senha[] {
    return this.senhas
      .filter(s => s.dataChamada && s.guiche)
      .sort((a, b) => (b.dataChamada?.getTime() || 0) - (a.dataChamada?.getTime() || 0))
      .slice(0, quantidade);
  }

  atualizarSenha(senha: Senha): void {
    const index = this.senhas.findIndex(s => s.id === senha.id);
    if (index !== -1) {
      this.senhas[index] = { ...senha };
      this.salvarDados();
      this.senhasSubject.next([...this.senhas]);
    }
  }

  /**
   * Verifica se está dentro do horário de funcionamento
   */
  estaNoHorarioDeFuncionamento(): boolean {
    const agora = new Date();
    const hora = agora.getHours();
    return hora >= 7 && hora < 17;
  }

  /**
   * Limpa senhas do dia atual
   */
  limparSenhasDoDia(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fim = new Date();
    fim.setHours(23, 59, 59, 999);
    this.senhas = this.senhas.filter(s => s.dataEmissao < hoje || s.dataEmissao > fim);
    const dataStr = this.formatarData(new Date());
    Object.keys(this.contadoresDiarios).forEach(chave => {
      if (chave.startsWith(dataStr)) {
        delete this.contadoresDiarios[chave];
      }
    });
    this.salvarDados();
    this.senhasSubject.next([...this.senhas]);
  }
  private formatarData(data: Date): string {
    const ano = data.getFullYear().toString().slice(-2);
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}${mes}${dia}`;
  }
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  private salvarDados(): void {
    try {
      const senhasParaSalvar: SenhaSerializada[] = this.senhas.map(s => ({
        ...s,
        dataEmissao: s.dataEmissao.toISOString(),
        dataChamada: s.dataChamada ? s.dataChamada.toISOString() : null,
        dataAtendimentoInicio: s.dataAtendimentoInicio ? s.dataAtendimentoInicio.toISOString() : null,
        dataAtendimentoFim: s.dataAtendimentoFim ? s.dataAtendimentoFim.toISOString() : null
      }));
      localStorage.setItem(this.STORAGE_KEY_SENHAS, JSON.stringify(senhasParaSalvar));
      localStorage.setItem(this.STORAGE_KEY_CONTADORES, JSON.stringify(this.contadoresDiarios));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }
  private carregarDados(): void {
    try {
      const senhasSalvas = localStorage.getItem(this.STORAGE_KEY_SENHAS);
      if (senhasSalvas) {
        const senhasParsed: SenhaSerializada[] = JSON.parse(senhasSalvas);
        this.senhas = senhasParsed.map(s => ({
          ...s,
          dataEmissao: new Date(s.dataEmissao),
          dataChamada: s.dataChamada ? new Date(s.dataChamada) : undefined,
          dataAtendimentoInicio: s.dataAtendimentoInicio ? new Date(s.dataAtendimentoInicio) : undefined,
          dataAtendimentoFim: s.dataAtendimentoFim ? new Date(s.dataAtendimentoFim) : undefined
        }));
        this.senhasSubject.next([...this.senhas]);
      }
      const contadoresSalvos = localStorage.getItem(this.STORAGE_KEY_CONTADORES);
      if (contadoresSalvos) {
        this.contadoresDiarios = JSON.parse(contadoresSalvos);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }
}
