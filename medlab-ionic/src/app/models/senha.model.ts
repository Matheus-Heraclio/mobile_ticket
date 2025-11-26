/*aqui fica as enumeraçoes de tipos de senhas*/
export enum TipoSenha {
  SP = 'SP',
  SG = 'SG',
  SE = 'SE'
}

export interface Senha {
  id: string;
  numero: string;
  tipo: TipoSenha;
  dataEmissao: Date;
  dataChamada?: Date;
  dataAtendimentoInicio?: Date;
  dataAtendimentoFim?: Date;
  guiche?: number;
  atendida: boolean;
  naoAtendida: boolean;
  tempoAtendimento?: number; 
}

export interface Estatisticas {
  totalEmitidas: number;
  totalAtendidas: number;
  totalNaoAtendidas: number;
  porTipo: {
    SP: { emitidas: number; atendidas: number };
    SG: { emitidas: number; atendidas: number };
    SE: { emitidas: number; atendidas: number };
  };
}
