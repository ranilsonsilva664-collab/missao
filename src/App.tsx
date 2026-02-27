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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Tesouraria</h1>
              <p className="text-blue-100 text-sm">Assembleia de Deus Missão Europa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('nova')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'nova'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              ➕ Nova Transação
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'historico'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              📋 Histórico
            </button>
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`px-6 py-4 font-medium transition-all ${activeTab === 'configuracoes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
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
