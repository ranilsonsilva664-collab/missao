import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  totals: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
}

export function Dashboard({ transactions, totals }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const recentTransactions = transactions.slice(0, 5);

  const categoriesData = transactions.reduce((acc, t) => {
    const key = t.categoria;
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0 };
    }
    acc[key].total += t.valor;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total de Entradas</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {formatCurrency(totals.entradas)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total de Saídas</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {formatCurrency(totals.saidas)}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Saldo Atual</p>
              <p className={`text-3xl font-bold mt-2 ${totals.saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totals.saldo)}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Transações Recentes</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma transação registrada</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{t.descricao}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.categoria} • {new Date(t.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`font-bold ${t.tipo === 'entrada' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.tipo === 'entrada' ? '+' : '-'} {formatCurrency(t.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categorias */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Por Categoria</h2>
          {Object.keys(categoriesData).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma categoria registrada</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoriesData)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 8)
                .map(([categoria, data]) => (
                  <div key={categoria} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{categoria}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{data.count} transações</p>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      {formatCurrency(data.total)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
