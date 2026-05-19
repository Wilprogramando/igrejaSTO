import { supabase } from '../lib/supabase';
import { Hino, Repertorio, Configuracoes, HarpaItem, HinoNoRepertorio } from '../types';

type HinoRow = {
  id: string;
  nome: string;
  tom: string;
  cantor: string;
  letra: string;
  categoria: string;
  observacoes: string | null;
  tipo: 'comum' | 'harpa';
  numero_harpa: number | null;
  criado_em: string;
  atualizado_em: string;
};

type RepertorioRow = {
  id: string;
  nome: string;
  data: string;
  horario: string | null;
  observacoes: string | null;
  hinos: HinoNoRepertorio[];
  criado_em: string;
  atualizado_em: string;
};

type ConfigRow = {
  id: string;
  nome_igreja: string;
  responsavel: string;
  rodape_pdf: string;
  logo: string | null;
  titulo_sistema: string | null;
  logo_sistema: string | null;
};

const hinoToRow = (h: Hino): HinoRow => ({
  id: h.id,
  nome: h.nome,
  tom: h.tom,
  cantor: h.cantor,
  letra: h.letra,
  categoria: h.categoria,
  observacoes: h.observacoes ?? null,
  tipo: h.tipo,
  numero_harpa: h.numeroHarpa ?? null,
  criado_em: h.criadoEm,
  atualizado_em: h.atualizadoEm,
});

const rowToHino = (r: HinoRow): Hino => ({
  id: r.id,
  nome: r.nome,
  tom: r.tom,
  cantor: r.cantor,
  letra: r.letra,
  categoria: r.categoria,
  observacoes: r.observacoes ?? undefined,
  tipo: r.tipo,
  numeroHarpa: r.numero_harpa ?? undefined,
  criadoEm: r.criado_em,
  atualizadoEm: r.atualizado_em,
});

const repertorioToRow = (r: Repertorio): RepertorioRow => ({
  id: r.id,
  nome: r.nome,
  data: r.data,
  horario: r.horario ?? null,
  observacoes: r.observacoes ?? null,
  hinos: r.hinos,
  criado_em: r.criadoEm,
  atualizado_em: r.atualizadoEm,
});

const rowToRepertorio = (r: RepertorioRow): Repertorio => ({
  id: r.id,
  nome: r.nome,
  data: r.data,
  horario: r.horario ?? undefined,
  observacoes: r.observacoes ?? undefined,
  hinos: r.hinos ?? [],
  criadoEm: r.criado_em,
  atualizadoEm: r.atualizado_em,
});

const configToRow = (c: Configuracoes): ConfigRow => ({
  id: c.id ?? 'config',
  nome_igreja: c.nomeIgreja,
  responsavel: c.responsavel,
  rodape_pdf: c.rodapePdf,
  logo: c.logo ?? null,
  titulo_sistema: c.tituloSistema ?? null,
  logo_sistema: c.logoSistema ?? null,
});

const rowToConfig = (r: ConfigRow): Configuracoes => ({
  id: r.id,
  nomeIgreja: r.nome_igreja,
  responsavel: r.responsavel,
  rodapePdf: r.rodape_pdf,
  logo: r.logo ?? undefined,
  tituloSistema: r.titulo_sistema ?? undefined,
  logoSistema: r.logo_sistema ?? undefined,
});

const harpaCristaBase: HarpaItem[] = [
  { numero: 1, nome: 'Jesus, que Luz Brilhou' },
  { numero: 2, nome: 'Eu Ouço a Voz de Jesus' },
  { numero: 3, nome: 'Bem-vindo ao Lar' },
  { numero: 4, nome: 'Há Paz, Há Paz' },
  { numero: 5, nome: 'Já Fui Achado por Cristo' },
  { numero: 6, nome: 'Bênçãos, Bênçãos' },
  { numero: 7, nome: 'Que Deus Abençoe a Todos Nós' },
  { numero: 8, nome: 'Adoro a Cristo, Meu Senhor' },
  { numero: 9, nome: 'Glória a Deus' },
  { numero: 10, nome: 'Eu Sou Muito Feliz' },
];

export async function initializeHarpaBase() {
  const { count, error } = await supabase
    .from('harpa')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  if ((count ?? 0) === 0) {
    const { error: insertError } = await supabase.from('harpa').insert(harpaCristaBase);
    if (insertError) throw insertError;
  }
}

export async function getHarpaByNumber(numero: number): Promise<HarpaItem | undefined> {
  const { data, error } = await supabase.from('harpa').select('*').eq('numero', numero).maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export async function getAllHarpa(): Promise<HarpaItem[]> {
  const { data, error } = await supabase.from('harpa').select('*').order('numero');
  if (error) throw error;
  return data ?? [];
}

export async function addOrUpdateHarpa(item: HarpaItem) {
  const { error } = await supabase.from('harpa').upsert(item, { onConflict: 'numero' });
  if (error) throw error;
}

export async function addHino(hino: Hino) {
  const { error } = await supabase.from('hinos').insert(hinoToRow(hino));
  if (error) throw error;
}

export async function updateHino(hino: Hino) {
  const { error } = await supabase.from('hinos').update(hinoToRow(hino)).eq('id', hino.id);
  if (error) throw error;
}

export async function deleteHino(id: string) {
  const { error } = await supabase.from('hinos').delete().eq('id', id);
  if (error) throw error;
}

export async function getHino(id: string): Promise<Hino | undefined> {
  const { data, error } = await supabase.from('hinos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? rowToHino(data as HinoRow) : undefined;
}

export async function getAllHinos(): Promise<Hino[]> {
  const { data, error } = await supabase.from('hinos').select('*').order('nome');
  if (error) throw error;
  return (data ?? []).map((r) => rowToHino(r as HinoRow));
}

export async function getHinosByType(tipo: 'comum' | 'harpa'): Promise<Hino[]> {
  const { data, error } = await supabase.from('hinos').select('*').eq('tipo', tipo).order('nome');
  if (error) throw error;
  return (data ?? []).map((r) => rowToHino(r as HinoRow));
}

export async function addRepertorio(repertorio: Repertorio) {
  const { error } = await supabase.from('repertorios').insert(repertorioToRow(repertorio));
  if (error) throw error;
}

export async function updateRepertorio(repertorio: Repertorio) {
  const { error } = await supabase
    .from('repertorios')
    .update(repertorioToRow(repertorio))
    .eq('id', repertorio.id);
  if (error) throw error;
}

export async function deleteRepertorio(id: string) {
  const { error } = await supabase.from('repertorios').delete().eq('id', id);
  if (error) throw error;
}

export async function getRepertorio(id: string): Promise<Repertorio | undefined> {
  const { data, error } = await supabase.from('repertorios').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? rowToRepertorio(data as RepertorioRow) : undefined;
}

export async function getAllRepertorios(): Promise<Repertorio[]> {
  const { data, error } = await supabase.from('repertorios').select('*').order('data', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => rowToRepertorio(r as RepertorioRow));
}

export async function getConfiguracoes(): Promise<Configuracoes | null> {
  const { data, error } = await supabase.from('configuracoes').select('*').eq('id', 'config').maybeSingle();
  if (error) throw error;
  return data ? rowToConfig(data as ConfigRow) : null;
}

export async function saveConfiguracoes(config: Configuracoes) {
  config.id = 'config';
  const { error } = await supabase.from('configuracoes').upsert(configToRow(config), { onConflict: 'id' });
  if (error) throw error;
}

export async function exportData() {
  const [hinos, repertorios, configs, harpa] = await Promise.all([
    supabase.from('hinos').select('*'),
    supabase.from('repertorios').select('*'),
    supabase.from('configuracoes').select('*'),
    supabase.from('harpa').select('*'),
  ]);
  if (hinos.error) throw hinos.error;
  if (repertorios.error) throw repertorios.error;
  if (configs.error) throw configs.error;
  if (harpa.error) throw harpa.error;
  return {
    hinos: (hinos.data ?? []).map((r) => rowToHino(r as HinoRow)),
    repertorios: (repertorios.data ?? []).map((r) => rowToRepertorio(r as RepertorioRow)),
    configuracoes: (configs.data ?? []).map((r) => rowToConfig(r as ConfigRow)),
    harpa: harpa.data ?? [],
  };
}

export async function importData(data: any) {
  if (Array.isArray(data.hinos)) {
    await supabase.from('hinos').delete().neq('id', '');
    if (data.hinos.length) {
      const { error } = await supabase.from('hinos').insert(data.hinos.map(hinoToRow));
      if (error) throw error;
    }
  }
  if (Array.isArray(data.repertorios)) {
    await supabase.from('repertorios').delete().neq('id', '');
    if (data.repertorios.length) {
      const { error } = await supabase.from('repertorios').insert(data.repertorios.map(repertorioToRow));
      if (error) throw error;
    }
  }
  if (Array.isArray(data.configuracoes)) {
    await supabase.from('configuracoes').delete().neq('id', '');
    if (data.configuracoes.length) {
      const { error } = await supabase.from('configuracoes').insert(data.configuracoes.map(configToRow));
      if (error) throw error;
    }
  }
  if (Array.isArray(data.harpa)) {
    await supabase.from('harpa').delete().neq('numero', -1);
    if (data.harpa.length) {
      const { error } = await supabase.from('harpa').insert(data.harpa);
      if (error) throw error;
    }
  }
}

export async function clearAllData() {
  const t1 = await supabase.from('hinos').delete().neq('id', '');
  if (t1.error) throw t1.error;
  const t2 = await supabase.from('repertorios').delete().neq('id', '');
  if (t2.error) throw t2.error;
  const t3 = await supabase.from('configuracoes').delete().neq('id', '');
  if (t3.error) throw t3.error;
}

export async function importHinosFromCSV(csvContent: string): Promise<{ success: number; errors: string[] }> {
  const lines = csvContent.trim().split('\n');
  const errors: string[] = [];
  let success = 0;

  const dataLines = lines.slice(1);

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    try {
      const cells = line.includes('\t')
        ? line.split('\t').map((c) => c.trim())
        : line.split(',').map((c) => c.trim());

      if (cells.length < 3) {
        errors.push(`Linha ${i + 2}: Formato inválido. Esperado: Número\tNome\tLetra`);
        continue;
      }

      const numero = parseInt(cells[0]);
      const nome = cells[1];
      const letra = cells[2];

      if (isNaN(numero)) {
        errors.push(`Linha ${i + 2}: Número deve ser um inteiro.`);
        continue;
      }

      if (!nome || !letra) {
        errors.push(`Linha ${i + 2}: Nome ou letra em branco.`);
        continue;
      }

      const novoHino: Hino = {
        id: numero.toString(),
        nome,
        letra,
        numeroHarpa: numero,
        tom: 'C',
        cantor: 'A definir',
        categoria: 'Harpa',
        tipo: 'harpa',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };

      const { error } = await supabase.from('hinos').upsert(hinoToRow(novoHino), { onConflict: 'id' });
      if (error) {
        errors.push(`Linha ${i + 2}: ${error.message}`);
        continue;
      }

      success++;
    } catch (error) {
      errors.push(`Linha ${i + 2}: ${(error as Error).message}`);
    }
  }

  return { success, errors };
}
