import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabelaSenhasComponent } from '../../components/tabela-senhas/tabela-senhas.component';
import { AlertController } from '@ionic/angular';
import { EstatisticasService } from '../../services/estatisticas.service';
import { SenhaService } from '../../services/senha.service';
import { Estatisticas, Senha, TipoSenha } from '../../models/senha.model';

type FiltroPeriodo = 'hoje' | 'semana' | 'mes' | 'todos';
type FiltroTipo = 'todos' | TipoSenha;
type FiltroStatus = 'todos' | 'aguardando' | 'chamada' | 'atendida' | 'naoAtendida';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TabelaSenhasComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  estatisticas: Estatisticas | null = null;
  senhasFiltradas: Senha[] = [];
  todasSenhas: Senha[] = [];
  relatorioTM: any = null;
  mostrarRelatorioTM: boolean = false;

  filtroPeriodo: FiltroPeriodo = 'hoje';
  filtroTipo: FiltroTipo = 'todos';
  filtroStatus: FiltroStatus = 'todos';

  constructor(
    private estatisticasService: EstatisticasService,
    private senhaService: SenhaService,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.estatisticasService.obterEstatisticas().subscribe((est: Estatisticas) => {
      this.estatisticas = est;
    });

    this.estatisticasService.obterRelatorioTempoMedio().subscribe((relatorio: any) => {
      this.relatorioTM = relatorio;
    });

    this.senhaService.senhas$.subscribe((senhas: Senha[]) => {
      this.todasSenhas = senhas;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    let senhas: Senha[] = [...this.todasSenhas];
    if (this.filtroPeriodo !== 'todos') {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (this.filtroPeriodo === 'hoje') {
        const fim = new Date();
        fim.setHours(23, 59, 59, 999);
        senhas = senhas.filter(s => s.dataEmissao >= hoje && s.dataEmissao <= fim);
      } else if (this.filtroPeriodo === 'semana') {
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - 7);
        senhas = senhas.filter(s => s.dataEmissao >= inicio);
      } else if (this.filtroPeriodo === 'mes') {
        const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        senhas = senhas.filter(s => s.dataEmissao >= inicio);
      }
    }
    if (this.filtroTipo !== 'todos') {
      senhas = senhas.filter(s => s.tipo === this.filtroTipo);
    }
    if (this.filtroStatus !== 'todos') {
      switch (this.filtroStatus) {
        case 'aguardando':
          senhas = senhas.filter(s => !s.dataChamada);
          break;
        case 'chamada':
          senhas = senhas.filter(s => s.dataChamada && !s.atendida && !s.naoAtendida);
          break;
        case 'atendida':
          senhas = senhas.filter(s => s.atendida);
          break;
        case 'naoAtendida':
          senhas = senhas.filter(s => s.naoAtendida);
          break;
      }
    }

    senhas.sort((a, b) => b.dataEmissao.getTime() - a.dataEmissao.getTime());

    this.senhasFiltradas = senhas;
  }

  calcularTaxaAtendimento(): number {
    if (!this.estatisticas || this.estatisticas.totalEmitidas === 0) {
      return 0;
    }
    return Math.round((this.estatisticas.totalAtendidas / this.estatisticas.totalEmitidas) * 100);
  }

  async limparSenhasDoDia(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja limpar todas as senhas emitidas hoje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.senhaService.limparSenhasDoDia();
          }
        }
      ]
    });

    await alert.present();
  }

  toggleRelatorioTM(): void {
    this.mostrarRelatorioTM = !this.mostrarRelatorioTM;
  }

  formatarTempo(minutos: number | undefined | null): string {
    if (minutos === undefined || minutos === null) return 'N/A';
    // Garante que o valor é um número antes de usar toFixed
    if (typeof minutos !== 'number') return 'N/A'; 
    // Se menor que 1 minuto, mostra em segundos
    if (minutos < 1) {
      const segundos = minutos * 60;
      return `${segundos.toFixed(1)} seg`;
    }
    return `${minutos.toFixed(2)} min`; // Ajustado para 2 casas decimais para maior precisão
  }

  obterTipoTexto(tipo: TipoSenha): string {
    const tipos: Record<TipoSenha, string> = {
      [TipoSenha.SP]: 'Prioritária',
      [TipoSenha.SG]: 'Geral',
      [TipoSenha.SE]: 'Retirada de Exames'
    };
    return tipos[tipo] || tipo;
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}
