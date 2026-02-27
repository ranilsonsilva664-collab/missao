import { useState } from 'react';
import { Transaction, TransactionType, EntryCategory, ExpenseCategory } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [tipo, setTipo] = useState<TransactionType>('entrada');
  const [categoria, setCategoria] = useState<string>('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [responsavel, setResponsavel] = useState('');

  const entryCategories: { value: EntryCategory; label: string }[] = [
    { value: 'dizimo', label: 'Dízimo' },
    { value: 'oferta', label: 'Oferta' },
    { value: 'doacao', label: 'Doação' },
    { value: 'evento', label: 'Evento' },
    { value: 'outros', label: 'Outros' },
  ];

  const expenseCategories: { value: ExpenseCategory; label: string }[] = [
    { value: 'aluguel', label: 'Aluguel' },
    { value: 'luz', label: 'Luz' },
    { value: 'agua', label: 'Água' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'evangelismo', label: 'Evangelismo' },
    { value: 'missoes', label: 'Missões' },
    { value: 'assistencia', label: 'Assistência Social' },
    { value: 'salarios', label: 'Salários' },
    { value: 'outros', label: 'Outros' },
  ];

  const categories = tipo === 'entrada' ? entryCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoria || !valor || !descricao || !responsavel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit({
      tipo,
      categoria: categoria as EntryCategory | ExpenseCategory,
      valor: parseFloat(valor),
      descricao,
      data,
      responsavel,
    });

    // Reset form
    setCategoria('');
    setValor('');
    setDescricao('');
    setData(new Date().toISOString().split('T')[0]);
    setResponsavel('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Transação *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setTipo('entrada');
                  setCategoria('');
                }}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${tipo === 'entrada'
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900/50 dark:text-gray-400'
                  }`}
              >
                ✅ Entrada
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipo('saida');
                  setCategoria('');
                }}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${tipo === 'saida'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/50 dark:text-gray-400'
                  }`}
              >
                ❌ Saída
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descrição detalhada da transação..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>

          {/* Data */}
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data *
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>

          {/* Responsável */}
          <div>
            <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsável *
            </label>
            <input
              type="text"
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome do responsável"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Registrar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
