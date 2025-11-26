import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Estatisticas, Senha, TipoSenha } from '../models/senha.model';
import { SenhaService } from './senha.service';

@Injectable({
  providedIn: 'root'
})
export class EstatisticasService {
  constructor(private senhaService: SenhaService) {}

  obterEstatisticas(): Observable<Estatisticas> {
    return this.senhaService.senhas$.pipe(
      map(senhas => {
        const totalEmitidas = senhas.length;
        const totalAtendidas = senhas.filter(s => s.atendida).length;
        const totalNaoAtendidas = senhas.filter(s => s.naoAtendida).length;

        const porTipo = {
          SP: {
            emitidas: senhas.filter(s => s.tipo === TipoSenha.SP).length,
            atendidas: senhas.filter(s => s.tipo === TipoSenha.SP && s.atendida).length
          },
          SG: {
            emitidas: senhas.filter(s => s.tipo === TipoSenha.SG).length,
            atendidas: senhas.filter(s => s.tipo === TipoSenha.SG && s.atendida).length
          },
          SE: {
            emitidas: senhas.filter(s => s.tipo === TipoSenha.SE).length,
            atendidas: senhas.filter(s => s.tipo === TipoSenha.SE && s.atendida).length
          }
        };

        return {
          totalEmitidas,
          totalAtendidas,
          totalNaoAtendidas,
          porTipo
        };
      })
    );
  }
  obterRelatorioDiario(data: Date): Observable<Senha[]> {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    return this.senhaService.senhas$.pipe(
      map(senhas => 
        senhas.filter(s => {
          const dataEmissao = s.dataEmissao;
          return dataEmissao >= inicio && dataEmissao <= fim;
        })
      )
    );
  }
  obterRelatorioMensal(ano: number, mes: number): Observable<Senha[]> {
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59, 999);

    return this.senhaService.senhas$.pipe(
      map(senhas => 
        senhas.filter(s => {
          const dataEmissao = s.dataEmissao;
          return dataEmissao >= inicio && dataEmissao <= fim;
        })
      )
    );
  }

  /**
   * Obtém relatório de tempo médio de atendimento
   * Agrupa por tipo de senha e calcula médias
   */
  obterRelatorioTempoMedio(): Observable<{
    SP: { media: number; min: number; max: number; total: number };
    SG: { media: number; min: number; max: number; total: number };
    SE: { media: number; min: number; max: number; total: number };
    geral: { media: number; min: number; max: number; total: number };
  }> {
    return this.senhaService.senhas$.pipe(
      map(senhas => {
        const senhasAtendidas = senhas.filter(s => s.atendida && s.tempoAtendimento !== undefined);
        
        const calcularEstatisticas = (senhasFiltradas: Senha[]) => {
          if (senhasFiltradas.length === 0) {
            return { media: 0, min: 0, max: 0, total: 0 };
          }
          
          const tempos = senhasFiltradas.map(s => s.tempoAtendimento!);
          const soma = tempos.reduce((acc, t) => acc + t, 0);
          
          return {
            media: Math.round(soma / tempos.length * 100) / 100,
            min: Math.min(...tempos),
            max: Math.max(...tempos),
            total: senhasFiltradas.length
          };
        };

        return {
          SP: calcularEstatisticas(senhasAtendidas.filter(s => s.tipo === TipoSenha.SP)),
          SG: calcularEstatisticas(senhasAtendidas.filter(s => s.tipo === TipoSenha.SG)),
          SE: calcularEstatisticas(senhasAtendidas.filter(s => s.tipo === TipoSenha.SE)),
          geral: calcularEstatisticas(senhasAtendidas)
        };
      })
    );
  }

  /**
   * Obtém relatório detalhado de todas as senhas
   * Inclui: numeração, tipo, data/hora emissão, data/hora atendimento, guichê
   */
  obterRelatorioDetalhado(dataInicio?: Date, dataFim?: Date): Observable<Senha[]> {
    return this.senhaService.senhas$.pipe(
      map(senhas => {
        let senhasFiltradas = [...senhas];
        
        if (dataInicio) {
          senhasFiltradas = senhasFiltradas.filter(s => s.dataEmissao >= dataInicio);
        }
        
        if (dataFim) {
          senhasFiltradas = senhasFiltradas.filter(s => s.dataEmissao <= dataFim);
        }
        
        // Ordena por data de emissão
        return senhasFiltradas.sort((a, b) => 
          a.dataEmissao.getTime() - b.dataEmissao.getTime()
        );
      })
    );
  }
}
