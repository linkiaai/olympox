// Compatibility is semantic only. Never normalize historical records before hashing.
const aliases = Object.freeze({
  'criar-personagem': 'create-character', 'produzir-peca': 'produce-piece', 'revisar-corrigir': 'review-correct',
  rascunho: 'draft', canon_aprovado: 'canon-approved', producao: 'production',
  candidato: 'candidate', aprovado: 'approved', aprovada: 'approved', rejeitado: 'rejected',
  pronta_para_producao: 'ready-for-production',
  aprovar: 'approve', corrigir: 'correct', reprovar: 'reject', pendente: 'pending',
  pronta: 'planned', em_execucao: 'in-progress', aguardando_decisao: 'awaiting-input',
  aguardando_ferramenta: 'awaiting-tool', resultado_incerto: 'uncertain-result', em_revisao: 'in-review',
  concluida: 'completed', falhou: 'failed', cancelada: 'cancelled',
  escuta: 'listening', 'visual-e-audio': 'visual-and-audio', nao_informado: 'not-provided',
  consultada: 'consulted', confirmada: 'confirmed', nao_permitida: 'not-permitted',
  organico: 'organic', anuncio: 'advertisement', exportacao: 'export',
  apresentacao: 'introduction', opiniao: 'opinion', discordancia: 'disagreement'
});

export const canonicalToken = value => typeof value === 'string' ? aliases[value] ?? value : value;
export const isToken = (value, expected) => canonicalToken(value) === expected;
export const oneOfTokens = (value, expected) => expected.includes(canonicalToken(value));

export const RUN_STATES = Object.freeze(['planned', 'in-progress', 'awaiting-input', 'awaiting-tool', 'uncertain-result', 'in-review', 'completed', 'failed', 'cancelled']);
