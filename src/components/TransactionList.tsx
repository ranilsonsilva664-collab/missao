import { useState } from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'todos' || t.tipo === filter;
    const matchesSearch =
      t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string, descricao: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a transação "${descricao}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Histórico de Transações</h2>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Pesquisar por descrição, categoria ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>
          <div className="flex justify-center md:justify-end gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('entrada')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === 'entrada'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilter('saida')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === 'saida'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Saídas
            </button>
          </div>
        </div>

        {/* Lista de Transações */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700/50 transition-all"
              >
                {/* Layout responsivo do cartão: coluna no mobile, linha no desktop */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Informações principais */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${transaction.tipo === 'entrada'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                      >
                        {transaction.tipo === 'entrada' ? '📈 ENTRADA' : '📉 SAÍDA'}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium capitalize">
                        {transaction.categoria}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 transition-colors">
                      {transaction.descricao}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      <span>
                        📅{' '}
                        {new Date(transaction.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span>👤 {transaction.responsavel}</span>
                    </div>
                  </div>

                  {/* Valor e botão de excluir */}
                  <div className="flex items-center md:items-start justify-center md:justify-end gap-4 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <p
                        className={`text-2xl font-bold ${transaction.tipo === 'entrada' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                      >
                        {transaction.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transaction.valor)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(transaction.id, transaction.descricao)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                      title="Excluir transação"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Total Entradas</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(
                    filteredTransactions
                      .filter((t) => t.tipo === 'entrada')
                      .reduce((sum, t) => sum + t.valor, 0)
                  )}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg transition-colors">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">Total Saídas</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-400">
                  {formatCurrency(
                    filteredTransactions
                      .filter((t) => t.tipo === 'saida')
                      .reduce((sum, t) => sum + t.valor, 0)
                  )}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Saldo</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(
                    filteredTransactions
                      .filter((t) => t.tipo === 'entrada')
                      .reduce((sum, t) => sum + t.valor, 0) -
                    filteredTransactions
                      .filter((t) => t.tipo === 'saida')
                      .reduce((sum, t) => sum + t.valor, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
