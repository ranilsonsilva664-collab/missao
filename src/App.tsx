import { useState, useMemo, useEffect } from 'react';
import { Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import Settings from './components/Settings';
import { Login } from './components/Login';
import { db, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nova' | 'historico' | 'configuracoes'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('church-dark-mode');
    return saved === 'true';
  });

  // Monitorar modo escuro
  useEffect(() => {
    localStorage.setItem('church-dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Calcular totais
  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const valor = Number(t.valor) || 0;
      if (t.tipo === 'entrada') {
        acc.entradas += valor;
        acc.saldo += valor;
      } else {
        acc.saidas += valor;
        acc.saldo -= valor;
      }
      return acc;
    }, { entradas: 0, saidas: 0, saldo: 0 });
  }, [transactions]);

  // Carregar transações do Firestore em tempo real
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'transactions'), orderBy('data', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Transaction[];
      setTransactions(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (!user) return;

      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      setActiveTab('historico');
    } catch (error: any) {
      console.error("Erro ao adicionar transação:", error);
      alert(`Erro ao salvar no banco de dados: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const importTransactions = async (data: any[]) => {
    const converted = data.map(item => {
      const tipo: 'entrada' | 'saida' = item.type === 'entrada' ? 'entrada' : 'saida';
      return {
        tipo,
        categoria: item.category,
        valor: item.amount,
        descricao: item.description,
        data: item.date,
        responsavel: item.responsible
      };
    });

    try {
      for (const item of converted) {
        await addDoc(collection(db, 'transactions'), item);
      }
      alert(`${converted.length} transações importadas com sucesso!`);
    } catch (error) {
      console.error("Erro na importação:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-indigo-950 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Tesouraria</h1>
                <p className="text-blue-100 dark:text-blue-300 text-sm">Assembleia de Deus Missão Europa</p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all shadow-lg"
              title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex justify-center flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('nova')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'nova'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              ➕ Nova Transação
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'historico'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              📋 Histórico
            </button>
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'configuracoes'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard transactions={transactions} totals={totals} />
        )}
        {activeTab === 'nova' && (
          <TransactionForm onSubmit={addTransaction} />
        )}
        {activeTab === 'historico' && (
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        )}
        {activeTab === 'configuracoes' && (
          <Settings onImport={importTransactions} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Assembleia de Deus Missão Europa - Sistema de Tesouraria
          </p>
        </div>
      </footer>
    </div>
  );
}
