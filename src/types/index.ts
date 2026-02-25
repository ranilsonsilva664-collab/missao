export type TransactionType = 'entrada' | 'saida';

export type EntryCategory = 'dizimo' | 'oferta' | 'doacao' | 'evento' | 'outros';
export type ExpenseCategory = 'aluguel' | 'luz' | 'agua' | 'manutencao' | 'evangelismo' | 'missoes' | 'assistencia' | 'salarios' | 'outros';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  categoria: EntryCategory | ExpenseCategory;
  valor: number;
  descricao: string;
  data: string;
  responsavel: string;
}
