import React, { useRef } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SettingsProps {
  onImport: (data: any[]) => void;
}

const STORAGE_KEY_TRANSACTIONS = 'church-transactions';
const STORAGE_KEY_PDFS = 'church-pdf-attachments';

const Settings: React.FC<SettingsProps> = ({ onImport }) => {
  // Exportar dados para arquivo JSON (formato compatível com importação)
  const handleExport = () => {
    const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    const transactions = stored ? JSON.parse(stored) : [];

    const exportData = Array.isArray(transactions)
      ? transactions.map((t: any) => ({
        id: t.id,
        type: t.tipo,
        category: t.categoria,
        amount: t.valor,
        description: t.descricao,
        date: t.data,
        responsible: t.responsavel,
      }))
      : [];

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tesouraria_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Importar PDF (anexar comprovantes em PDF ao sistema)
  const handleImportPDF = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF (.pdf).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const stored = localStorage.getItem(STORAGE_KEY_PDFS);
        const existing = stored ? JSON.parse(stored) : [];

        const attachment = {
          id: `pdf_${Date.now()}`,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl,
        };

        const updated = Array.isArray(existing) ? [...existing, attachment] : [attachment];
        localStorage.setItem(STORAGE_KEY_PDFS, JSON.stringify(updated));

        alert(
          '✅ PDF salvo como comprovante no sistema. Ele não cria lançamentos automáticos; ' +
          'use-o apenas como anexo/arquivo de consulta.'
        );
      } catch (error) {
        alert('❌ Erro ao salvar o PDF.');
      }
    };

    reader.readAsDataURL(file);

    // limpar input para permitir novo upload do mesmo arquivo
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Configurações</h1>
        <p className="text-gray-600">Gerencie seus dados, backups e anexos</p>
      </div>

      {/* Exportar Dados */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Exportar Dados</h2>
            <p className="text-sm text-gray-500">Baixe um backup de todos os registros</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Exportar Backup (JSON)
        </button>
      </div>

      {/* Importar PDF (comprovantes) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Importar PDF</h2>
            <p className="text-sm text-gray-500">
              Anexe comprovantes em PDF aos registros da tesouraria
            </p>
          </div>
        </div>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleImportPDF}
          className="hidden"
          id="import-pdf"
        />
        <label
          htmlFor="import-pdf"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Selecionar Arquivo PDF
        </label>
        <p className="text-xs text-gray-500 mt-2 text-center">
          O PDF será salvo como <strong>comprovante/anexo</strong> no navegador. Ele não cria
          lançamentos automaticamente.
        </p>
      </div>

      {/* Sair do Sistema */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Sair do Sistema</h2>
            <p className="text-sm text-gray-500">Encerra sua sessão atual com segurança</p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Sair da Conta
        </button>
      </div>

      {/* Informações */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">📋 Como usar:</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>
            ✅ <strong>Exportar:</strong> crie backups regularmente para não perder seus dados
          </li>
          <li>
            ✅ <strong>Importar PDF:</strong> salve comprovantes (boletos, faturas, extratos) junto
            com os dados financeiros
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
