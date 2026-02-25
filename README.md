# Sistema de Tesouraria - Assembleia de Deus Missão Europa

Sistema completo de gestão financeira desenvolvido para controlar entradas e saídas da igreja.

## 🎯 Funcionalidades

### Dashboard
- **Resumo Financeiro**: Visualização rápida de entradas, saídas e saldo atual
- **Transações Recentes**: Últimas 5 movimentações registradas
- **Análise por Categoria**: Agrupamento de valores por categorias

### Nova Transação
- **Registro de Entradas**: 
  - Dízimo
  - Oferta
  - Doação
  - Evento
  - Outros

- **Registro de Saídas**:
  - Aluguel
  - Luz
  - Água
  - Manutenção
  - Evangelismo
  - Missões
  - Assistência Social
  - Salários
  - Outros

- **Campos do Formulário**:
  - Tipo (Entrada/Saída)
  - Categoria
  - Valor em Real Brasileiro (R$)
  - Descrição detalhada
  - Data
  - Nome do responsável

### Histórico
- **Pesquisa**: Busca por descrição, categoria ou responsável
- **Filtros**: Visualização por tipo (Todos, Entradas, Saídas)
- **Detalhes**: Informações completas de cada transação
- **Exclusão**: Possibilidade de remover transações
- **Resumo**: Totalizadores de entradas, saídas e saldo

### ⚙️ Configurações (Backup e Importação)
- **Exportar Dados (JSON)**: Baixa um backup completo de todos os registros
- **Importar Dados (JSON)**: Restaura registros de um backup anterior
- **Importar CSV**: Importa registros de planilhas Excel/CSV
- **Apagar Todos os Registros**: Limpa todos os dados permanentemente (com confirmação)

**Formato CSV para importação:**
```
Tipo,Categoria,Valor,Descrição,Data,Responsável
Entrada,Dízimo,500.00,João Silva,25/12/2024,João Silva
Saída,Luz,150.00,Conta de luz,20/12/2024,Maria Santos
```

## 💾 Armazenamento

Todos os dados são salvos automaticamente no **localStorage** do navegador, garantindo que as informações permaneçam mesmo após fechar a aplicação.

## 🎨 Interface

- Design moderno e responsivo
- Cores intuitivas (verde para entradas, vermelho para saídas)
- Navegação por abas
- Formatação de valores em Real Brasileiro (R$)
- Datas em formato português (pt-BR)

## 🚀 Tecnologias

- React 19
- TypeScript
- Tailwind CSS
- Vite
- LocalStorage API

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablets
- Smartphones

## 🔒 Segurança

- Validação de campos obrigatórios
- Confirmação antes de excluir transações
- Tipos TypeScript para maior segurança

---

**Assembleia de Deus Missão Europa** - Sistema de Tesouraria © 2024
