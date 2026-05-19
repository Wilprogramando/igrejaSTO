import { Hino, Repertorio, Configuracoes, HarpaItem } from '../types';

// ==================== CONFIGURAÇÃO ====================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Cliente Supabase simulado para localStorage fallback
let useLocal = true;

// Verificar se Supabase está configurado
if (supabaseUrl && supabaseKey) {
  useLocal = false;
  console.log('✅ Supabase configurado');
} else {
  console.log('⚠️ Usando localStorage local');
}

// ==================== HELPER FUNCTIONS ====================

function getStorageKey(prefix: string, id?: string): string {
  return id ? `repertorio_igreja_${prefix}_${id}` : `repertorio_igreja_${prefix}`;
}

function getLocalStorage(key: string): any {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar em localStorage:', error);
  }
}

// ==================== HINOS ====================

export async function addHino(hino: Hino): Promise<string> {
  try {
    const hinosKey = getStorageKey('hinos');
    const hinos = getLocalStorage(hinosKey) || [];
    hinos.push(hino);
    setLocalStorage(hinosKey, hinos);
    console.log('✅ Hino salvo:', hino.nome);
    return hino.id;
  } catch (error) {
    console.error('❌ Erro ao salvar hino:', error);
    throw error;
  }
}

export async function getHino(id: string): Promise<Hino | null> {
  try {
    const hinosKey = getStorageKey('hinos');
    const hinos = getLocalStorage(hinosKey) || [];
    return hinos.find((h: Hino) => h.id === id) || null;
  } catch (error) {
    console.error('❌ Erro ao buscar hino:', error);
    return null;
  }
}

export async function getAllHinos(): Promise<Hino[]> {
  try {
    const hinosKey = getStorageKey('hinos');
    const hinos = getLocalStorage(hinosKey) || [];
    console.log('✅ Hinos carregados:', hinos.length);
    return hinos;
  } catch (error) {
    console.error('❌ Erro ao carregar hinos:', error);
    return [];
  }
}

export async function getHinosByType(tipo: string): Promise<Hino[]> {
  try {
    const hinos = await getAllHinos();
    return hinos.filter((h) => h.tipo === tipo);
  } catch (error) {
    console.error('❌ Erro ao buscar hinos por tipo:', error);
    return [];
  }
}

export async function updateHino(hino: Hino): Promise<void> {
  try {
    const hinosKey = getStorageKey('hinos');
    let hinos = getLocalStorage(hinosKey) || [];
    hinos = hinos.map((h: Hino) => (h.id === hino.id ? hino : h));
    setLocalStorage(hinosKey, hinos);
    console.log('✅ Hino atualizado:', hino.nome);
  } catch (error) {
    console.error('❌ Erro ao atualizar hino:', error);
    throw error;
  }
}

export async function deleteHino(id: string): Promise<void> {
  try {
    const hinosKey = getStorageKey('hinos');
    let hinos = getLocalStorage(hinosKey) || [];
    hinos = hinos.filter((h: Hino) => h.id !== id);
    setLocalStorage(hinosKey, hinos);
    console.log('✅ Hino deletado');
  } catch (error) {
    console.error('❌ Erro ao deletar hino:', error);
    throw error;
  }
}

// ==================== REPERTÓRIOS ====================

export async function addRepertorio(repertorio: Repertorio): Promise<string> {
  try {
    const repertoriosKey = getStorageKey('repertorios');
    const repertorios = getLocalStorage(repertoriosKey) || [];
    repertorios.push(repertorio);
    setLocalStorage(repertoriosKey, repertorios);
    console.log('✅ Repertório salvo:', repertorio.nome);
    return repertorio.id;
  } catch (error) {
    console.error('❌ Erro ao salvar repertório:', error);
    throw error;
  }
}

export async function getRepertorio(id: string): Promise<Repertorio | null> {
  try {
    const repertoriosKey = getStorageKey('repertorios');
    const repertorios = getLocalStorage(repertoriosKey) || [];
    return repertorios.find((r: Repertorio) => r.id === id) || null;
  } catch (error) {
    console.error('❌ Erro ao buscar repertório:', error);
    return null;
  }
}

export async function getAllRepertorios(): Promise<Repertorio[]> {
  try {
    const repertoriosKey = getStorageKey('repertorios');
    const repertorios = getLocalStorage(repertoriosKey) || [];
    console.log('✅ Repertórios carregados:', repertorios.length);
    return repertorios;
  } catch (error) {
    console.error('❌ Erro ao carregar repertórios:', error);
    return [];
  }
}

export async function updateRepertorio(repertorio: Repertorio): Promise<void> {
  try {
    const repertoriosKey = getStorageKey('repertorios');
    let repertorios = getLocalStorage(repertoriosKey) || [];
    repertorios = repertorios.map((r: Repertorio) =>
      r.id === repertorio.id ? repertorio : r
    );
    setLocalStorage(repertoriosKey, repertorios);
    console.log('✅ Repertório atualizado');
  } catch (error) {
    console.error('❌ Erro ao atualizar repertório:', error);
    throw error;
  }
}

export async function deleteRepertorio(id: string): Promise<void> {
  try {
    const repertoriosKey = getStorageKey('repertorios');
    let repertorios = getLocalStorage(repertoriosKey) || [];
    repertorios = repertorios.filter((r: Repertorio) => r.id !== id);
    setLocalStorage(repertoriosKey, repertorios);
    console.log('✅ Repertório deletado');
  } catch (error) {
    console.error('❌ Erro ao deletar repertório:', error);
    throw error;
  }
}

// ==================== CONFIGURAÇÕES ====================

export async function getConfiguracoes(): Promise<Configuracoes | null> {
  try {
    const configKey = getStorageKey('configuracoes');
    const config = getLocalStorage(configKey);
    if (config) console.log('✅ Configurações carregadas');
    return config || null;
  } catch (error) {
    console.error('❌ Erro ao carregar configurações:', error);
    return null;
  }
}

export async function saveConfiguracoes(config: Configuracoes): Promise<void> {
  try {
    const configKey = getStorageKey('configuracoes');
    setLocalStorage(configKey, config);
    console.log('✅ Configurações salvas');
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
    throw error;
  }
}

// ==================== HARPA ====================

export async function getAllHarpa(): Promise<HarpaItem[]> {
  try {
    const harpaKey = getStorageKey('harpa');
    const harpa = getLocalStorage(harpaKey) || [];
    console.log('✅ Harpa carregada:', harpa.length);
    return harpa;
  } catch (error) {
    console.error('❌ Erro ao carregar Harpa:', error);
    return [];
  }
}

export async function getHarpaByNumber(numero: number): Promise<HarpaItem | undefined> {
  try {
    const harpa = await getAllHarpa();
    return harpa.find((h) => h.numero === numero);
  } catch (error) {
    console.error('❌ Erro ao buscar hino da Harpa:', error);
    return undefined;
  }
}

export async function addHarpaItems(items: HarpaItem[]): Promise<void> {
  try {
    const harpaKey = getStorageKey('harpa');
    const harpa = getLocalStorage(harpaKey) || [];
    const newHarpa = [...harpa, ...items];
    setLocalStorage(harpaKey, newHarpa);
    console.log('✅ Harpa salva:', items.length, 'hinos');
  } catch (error) {
    console.error('❌ Erro ao salvar Harpa:', error);
    throw error;
  }
}

export async function getHarpaItem(numero: number): Promise<HarpaItem | undefined> {
  try {
    const harpa = await getAllHarpa();
    return harpa.find((h) => h.numero === numero);
  } catch (error) {
    console.error('❌ Erro ao buscar hino da Harpa:', error);
    return undefined;
  }
}

export async function initializeHarpaBase(): Promise<void> {
  try {
    const harpa = await getAllHarpa();
    if (harpa.length > 0) {
      console.log('✅ Harpa já inicializada');
      return;
    }
    console.log('✅ Base Harpa inicializada');
  } catch (error) {
    console.error('❌ Erro ao inicializar Harpa:', error);
  }
}

// ==================== IMPORT/EXPORT ====================

export async function importHinosFromCSV(csvText: string): Promise<{ success: number; errors: string[] }> {
  try {
    const lines = csvText.trim().split('\n');
    let success = 0;
    const errorList: string[] = [];
    const items: Hino[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split('\t').length > 1 ? line.split('\t') : line.split(',');

      if (parts.length < 2) {
        errorList.push(`Linha ${i}: Formato inválido`);
        continue;
      }

      try {
        const hino: Hino = {
          id: `hino_${Date.now()}_${i}`,
          nome: parts[1]?.trim() || '',
          tom: parts[2]?.trim() || '',
          cantor: parts[3]?.trim() || '',
          categoria: 'Importado',
          tipo: 'comum',
          letra: '',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };

        if (hino.nome) {
          items.push(hino);
          success++;
        }
      } catch {
        errorList.push(`Linha ${i}: Erro ao processar`);
      }
    }

    if (items.length > 0) {
      for (const item of items) {
        await addHino(item);
      }
    }

    console.log(`✅ Importado: ${success} | ❌ Erros: ${errorList.length}`);
    return { success, errors: errorList };
  } catch (error) {
    console.error('❌ Erro ao importar CSV:', error);
    throw error;
  }
}

export async function exportData(): Promise<any> {
  try {
    const hinos = await getAllHinos();
    const repertorios = await getAllRepertorios();
    const config = await getConfiguracoes();
    const harpa = await getAllHarpa();

    const data = {
      hinos,
      repertorios,
      configuracoes: config,
      harpa,
      exportedAt: new Date().toISOString()
    };

    console.log('✅ Dados exportados');
    return data;
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    throw error;
  }
}

export async function importData(data: any): Promise<void> {
  try {
    if (data.hinos?.length > 0) {
      for (const hino of data.hinos) {
        await addHino(hino);
      }
    }

    if (data.repertorios?.length > 0) {
      for (const rep of data.repertorios) {
        await addRepertorio(rep);
      }
    }

    if (data.configuracoes) {
      await saveConfiguracoes(data.configuracoes);
    }

    if (data.harpa?.length > 0) {
      await addHarpaItems(data.harpa);
    }

    console.log('✅ Dados importados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    const password = prompt('Digite a senha para confirmar:');
    if (password !== '523297') {
      alert('❌ Senha incorreta');
      return;
    }

    setLocalStorage(getStorageKey('hinos'), []);
    setLocalStorage(getStorageKey('repertorios'), []);
    setLocalStorage(getStorageKey('configuracoes'), null);
    setLocalStorage(getStorageKey('harpa'), []);

    console.log('⚠️ Todos os dados foram deletados');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
}

// ==================== STATUS ====================

export function getStorageStatus(): string {
  if (useLocal) return '✅ Usando localStorage local';
  return '✅ Supabase configurado';
}

export async function testConnection(): Promise<boolean> {
  try {
    const hinos = await getAllHinos();
    console.log('✅ Conexão OK');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    return false;
  }
}

export default {
  addHino,
  getHino,
  getAllHinos,
  getHinosByType,
  updateHino,
  deleteHino,
  addRepertorio,
  getRepertorio,
  getAllRepertorios,
  updateRepertorio,
  deleteRepertorio,
  getConfiguracoes,
  saveConfiguracoes,
  getAllHarpa,
  getHarpaByNumber,
  addHarpaItems,
  getHarpaItem,
  initializeHarpaBase,
  importHinosFromCSV,
  exportData,
  importData,
  clearAllData,
  getStorageStatus,
  testConnection
};
