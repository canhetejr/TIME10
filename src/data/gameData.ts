import { LevelConfig, MilestoneChest, ShopItem, TrackId } from '../types';

export interface TrackInfo {
  id: TrackId;
  title: string;
  subtitle: string;
  badge: string;
  themeColor: string;
  accentBorder: string;
  bgGradient: string;
  description: string;
  levelIds: number[];
}

export const TRACKS: TrackInfo[] = [
  {
    id: 'geral',
    title: 'Trilha 1: Formação Geral & Cidadania',
    subtitle: 'Ética, Direitos Humanos, Sustentabilidade e Fundamentos',
    badge: 'Módulo Básico',
    themeColor: 'from-blue-600 to-indigo-700',
    accentBorder: 'border-indigo-500/50',
    bgGradient: 'from-indigo-950/70 via-slate-900 to-indigo-950/40',
    description: 'Explore os conceitos essenciais de responsabilidade social, inclusão, sustentabilidade e raciocínio crítico avaliados no componente geral do ENADE.',
    levelIds: [1, 2, 3],
  },
  {
    id: 'raciocinio',
    title: 'Trilha 2: Raciocínio Lógico & Tecnologia',
    subtitle: 'Transformação Digital, Matriz Energética e Métodos de Análise',
    badge: 'Módulo Intermediário',
    themeColor: 'from-emerald-600 to-teal-700',
    accentBorder: 'border-emerald-500/50',
    bgGradient: 'from-emerald-950/70 via-slate-900 to-teal-950/40',
    description: 'Desafios dinâmicos envolvendo interpretação de dados, transição energética, ética em IA e tomada de decisão estratégica.',
    levelIds: [4, 5, 6],
  },
  {
    id: 'lideranca',
    title: 'Trilha 3: Desafio Nota 5 & Colação de Grau',
    subtitle: 'Casos Complexos, Bioética, Match-3 Avançado e o Grande Jackpot',
    badge: 'Módulo Avançado & Boss',
    themeColor: 'from-amber-600 to-yellow-600',
    accentBorder: 'border-amber-500/50',
    bgGradient: 'from-amber-950/70 via-slate-900 to-yellow-950/40',
    description: 'O estágio final da sua graduação! Resolva cenários integrados, realize combinações em cadeia e conquiste a pontuação máxima rumo ao diploma.',
    levelIds: [7, 8, 9],
  },
];

export const MILESTONE_CHESTS: MilestoneChest[] = [
  {
    id: 'chest_3',
    requiredStars: 3,
    rewardMoEdu: 150,
    title: 'Baú do Calouro Dedicado',
    description: 'Parabéns pelos primeiros passos! Bônus de MoEdu liberado.',
  },
  {
    id: 'chest_8',
    requiredStars: 8,
    rewardMoEdu: 350,
    title: 'Baú do Acadêmico Promissor',
    description: 'Domínio comprovado nas primeiras trilhas! MoEdu para investir.',
  },
  {
    id: 'chest_15',
    requiredStars: 15,
    rewardMoEdu: 600,
    title: 'Baú do Especialista ENADE',
    description: 'Excelente pontuação! Um grande impulso na sua carteira acadêmica.',
  },
  {
    id: 'chest_24',
    requiredStars: 24,
    rewardMoEdu: 1200,
    title: 'Cofre Dourado da Formatura Nota 5',
    description: 'Domínio absoluto de todas as 3 trilhas com pontuação lendária!',
  },
];

export const INITIAL_LEVELS: LevelConfig[] = [
  // --- TRILHA 1: FORMAÇÃO GERAL & CIDADANIA (Fases 1 a 3) ---
  {
    id: 1,
    trackId: 'geral',
    trackTitle: 'Trilha 1: Formação Geral',
    title: 'Fase 1: O Show da Formação Geral',
    subtitle: 'Quiz Interativo de Conhecimentos Gerais & Ética',
    type: 'quiz',
    icon: '🧠',
    difficulty: 'Iniciante',
    rewardMoEdu: 150,
    requiredStarsToUnlock: 0,
    description: 'Responda a 5 perguntas desafiadoras do ENADE antes que o tempo acabe! Mantenha o combo para faturar mais MoEdu.',
    quizQuestions: [
      {
        id: 'q1_1',
        question: 'Segundo as diretrizes de Ética e Responsabilidade Social, qual é o papel primordial da sustentabilidade no desenvolvimento contemporâneo?',
        theme: 'Sustentabilidade & Sociedade',
        options: [
          'Priorizar o crescimento econômico irrestrito e depois remediar impactos',
          'Harmonizar eficiência econômica, justiça social e equilíbrio ecológico',
          'Restringir todo avanço tecnológico em prol da estagnação produtiva',
          'Delegar a preservação ambiental unicamente a organizações não-governamentais'
        ],
        correctIndex: 1,
        explanation: 'O desenvolvimento sustentável integra os três pilares essenciais: econômico, social e ambiental, garantindo o presente sem esgotar o futuro.'
      },
      {
        id: 'q1_2',
        question: 'No contexto dos Direitos Humanos e Cidadania, a inclusão de grupos historicamente vulneráveis deve ser garantida através de:',
        theme: 'Cidadania & Direitos Humanos',
        options: [
          'Políticas públicas afirmativas, equidade de acesso e respeito à diversidade',
          'Padronização cultural homogênea sem diferenciação de necessidades',
          'Mecanismos puramente assistenciais de curto prazo e sem educação',
          'Eliminação de debates sociais no ambiente acadêmico e profissional'
        ],
        correctIndex: 0,
        explanation: 'A equidade e as políticas afirmativas são ferramentas cruciais para reparar desigualdades históricas e efetivar a cidadania plena.'
      },
      {
        id: 'q1_3',
        question: 'A Inteligência Artificial e a transformação digital na sociedade atual exigem do profissional diplomado uma postura de:',
        theme: 'Tecnologia & Inovação',
        options: [
          'Rejeição completa a qualquer sistema automatizado de tomada de decisão',
          'Uso crítico, consciente, pautado na ética de dados e na centralidade humana',
          'Delegação total da responsabilidade civil e moral para os algoritmos',
          'Aplicação indiscriminada de modelos sem checagem de vieses'
        ],
        correctIndex: 1,
        explanation: 'O profissional do futuro deve liderar a tecnologia com senso crítico e ética, mitigando vieses e priorizando o bem-estar humano.'
      },
      {
        id: 'q1_4',
        question: 'Ao analisar um gráfico estatístico com variação proporcional de dados econômicos, a leitura correta requer:',
        theme: 'Raciocínio Crítico & Dados',
        options: [
          'Considerar apenas os números absolutos sem contextualizar a taxa percentual',
          'Correlacionar grandezas, identificar tendências e checar a confiabilidade da fonte',
          'Aceitar a manchete sem averiguar a escala dos eixos apresentados',
          'Desconsiderar a margem de erro amostral expressa no estudo'
        ],
        correctIndex: 1,
        explanation: 'A alfabetização de dados exige examinar escalas, metodologias, correlações e fontes antes de extrair conclusões.'
      },
      {
        id: 'q1_5',
        question: 'O ENADE avalia não apenas a memorização de conteúdos, mas sobretudo a capacidade de:',
        theme: 'Competências do Estudante',
        options: [
          'Repetir fórmulas sem entender a aplicação prática no cotidiano',
          'Resolver problemas complexos, articular saberes e agir com compromisso social',
          'Competir individualmente sem cooperação com equipes multidisciplinares',
          'Ignorar o impacto da sua profissão na comunidade onde atua'
        ],
        correctIndex: 1,
        explanation: 'O exame prioriza competências integradas, raciocínio lógico-crítico e a capacidade transformadora do conhecimento acadêmico.'
      }
    ]
  },
  {
    id: 2,
    trackId: 'geral',
    trackTitle: 'Trilha 1: Formação Geral',
    title: 'Fase 2: Match-3 dos Documentos',
    subtitle: 'Organize a Pasta Acadêmica e Pontue Alto!',
    type: 'match3',
    icon: '📚',
    difficulty: 'Iniciante',
    rewardMoEdu: 200,
    requiredStarsToUnlock: 1,
    description: 'Combine 3 ou mais itens acadêmicos iguais para despachar os documentos do ENADE! Alcance a meta de 1.200 pontos em 15 jogadas.',
    match3TargetScore: 1200,
    match3MaxMoves: 15
  },
  {
    id: 3,
    trackId: 'geral',
    trackTitle: 'Trilha 1: Formação Geral',
    title: 'Fase 3: Giro da Fortuna ENADE',
    subtitle: 'Caça-Níquel Acadêmico de MoEdu',
    type: 'slot',
    icon: '🎰',
    difficulty: 'Iniciante',
    rewardMoEdu: 250,
    requiredStarsToUnlock: 2,
    isBossLevel: true,
    description: 'Gire a roleta dos estudantes e combine os símbolos sagrados da aprovação para concluir o primeiro módulo com chave de ouro!',
    slotSpinsAllowed: 5,
    slotTargetMoEdu: 400
  },

  // --- TRILHA 2: RACIOCÍNIO LÓGICO & TECNOLOGIA (Fases 4 a 6) ---
  {
    id: 4,
    trackId: 'raciocinio',
    trackTitle: 'Trilha 2: Raciocínio & Tecnologia',
    title: 'Fase 4: Desafio Especialista ENADE',
    subtitle: 'Quiz Rápido de Raciocínio Lógico & Diversidade',
    type: 'quiz',
    icon: '⚡',
    difficulty: 'Intermediário',
    rewardMoEdu: 300,
    requiredStarsToUnlock: 4,
    description: 'O nível subiu! Perguntas com cronômetro acelerado sobre matriz energética, diversidade cultural e bioética.',
    quizQuestions: [
      {
        id: 'q4_1',
        question: 'A transição para matrizes energéticas limpas no Brasil destaca-se principalmente pelo potencial de:',
        theme: 'Matriz Energética & Clima',
        options: [
          'Expansão eólica, solar e biomassa com redução de pegada de carbono',
          'Retorno massivo ao uso de usinas termelétricas a carvão mineral',
          'Substituição de todo transporte público por veículos movidos a querosene',
          'Abandono total da infraestrutura hidroelétrica já instalada'
        ],
        correctIndex: 0,
        explanation: 'O Brasil é referência em renováveis e tem grande potencial para liderar a expansão solar e eólica de baixo impacto.'
      },
      {
        id: 'q4_2',
        question: 'O conceito de interseccionalidade nos estudos sociais demonstra que:',
        theme: 'Diversidade & Equidade',
        options: [
          'Gênero, raça e classe social interagem gerando vivências e desafios específicos',
          'Todos os indivíduos enfrentam exatamente as mesmas barreiras estruturais',
          'As desigualdades sociais se resumem unicamente à renda financeira',
          'Não há correlação entre formação acadêmica e mobilidade social'
        ],
        correctIndex: 0,
        explanation: 'A interseccionalidade mostra como marcadores de identidade se cruzam e moldam oportunidades e vulnerabilidades.'
      },
      {
        id: 'q4_3',
        question: 'Na bioética e pesquisa científica, o consentimento livre e esclarecido assegura:',
        theme: 'Bioética & Ciência',
        options: [
          'A autonomia, transparência e proteção integral aos participantes de estudos',
          'A dispensa de revisão por comitês de ética em experimentos com humanos',
          'O sigilo dos resultados mesmo quando há risco grave à saúde pública',
          'A exclusão de qualquer termo formal para facilitar a coleta rápida de dados'
        ],
        correctIndex: 0,
        explanation: 'O consentimento livre e esclarecido é a salvaguarda basilar da dignidade humana em investigações científicas.'
      },
      {
        id: 'q4_4',
        question: 'Em uma tomada de decisão gerencial, a falácia do custo irrecuperável (sunk cost) ocorre quando se decide:',
        theme: 'Tomada de Decisão & Lógica',
        options: [
          'Insistir num projeto inviável só porque já se investiu muito nele no passado',
          'Calcular adequadamente o retorno futuro sobre o investimento marginal',
          'Diversificar riscos com planejamento prévio e contingência',
          'Interromper um erro imediatamente para salvar recursos restantes'
        ],
        correctIndex: 0,
        explanation: 'A falácia do custo irrecuperável prende o gestor a perdas passadas em vez de focar nas perspectivas e valor futuro real.'
      },
      {
        id: 'q4_5',
        question: 'Qual é o impacto da extensão universitária na formação integral do estudante?',
        theme: 'Extensão & Sociedade',
        options: [
          'Conectar o conhecimento teórico às demandas reais da comunidade local',
          'Manter a universidade isolada dos problemas sociais ao seu redor',
          'Substituir as aulas teóricas por atividades sem embasamento técnico',
          'Reduzir a exigência acadêmica para facilitar a formatura em massa'
        ],
        correctIndex: 0,
        explanation: 'A extensão universitária promove o diálogo entre a academia e a sociedade, enriquecendo o aprendizado e gerando impacto cidadão.'
      }
    ]
  },
  {
    id: 5,
    trackId: 'raciocinio',
    trackTitle: 'Trilha 2: Raciocínio & Tecnologia',
    title: 'Fase 5: Match-3 Inovação & Dados',
    subtitle: 'Combinações Rápidas de Artigos & Relatórios',
    type: 'match3',
    icon: '📊',
    difficulty: 'Intermediário',
    rewardMoEdu: 350,
    requiredStarsToUnlock: 6,
    description: 'O laboratório precisa de velocidade! Alcance 1.600 pontos em 16 jogadas para validar os dados do ENADE.',
    match3TargetScore: 1600,
    match3MaxMoves: 16
  },
  {
    id: 6,
    trackId: 'raciocinio',
    trackTitle: 'Trilha 2: Raciocínio & Tecnologia',
    title: 'Fase 6: Giro Tecnológico da Pesquisa',
    subtitle: 'Roleta Científica com Multiplicadores Altos',
    type: 'slot',
    icon: '🧪',
    difficulty: 'Avançado',
    rewardMoEdu: 400,
    requiredStarsToUnlock: 8,
    isBossLevel: true,
    description: 'A máquina de pesquisa está energizada! Consiga 600 MoEdu em 6 giros com símbolos especiais de inovação.',
    slotSpinsAllowed: 6,
    slotTargetMoEdu: 600
  },

  // --- TRILHA 3: DESAFIO NOTA 5 & COLAÇÃO DE GRAU (Fases 7 a 9) ---
  {
    id: 7,
    trackId: 'lideranca',
    trackTitle: 'Trilha 3: Desafio Nota 5',
    title: 'Fase 7: Casos Integrados & Gestão',
    subtitle: 'Quiz Avançado de Cenários Complexos e Governança',
    type: 'quiz',
    icon: '🎓',
    difficulty: 'Avançado',
    rewardMoEdu: 450,
    requiredStarsToUnlock: 11,
    description: 'Estudos de caso reais! Questões complexas envolvendo governança ESG, liderança ética e resolução de conflitos.',
    quizQuestions: [
      {
        id: 'q7_1',
        question: 'Na governança corporativa contemporânea, a sigla ESG (Environmental, Social and Governance) estabelece que:',
        theme: 'Governança & ESG',
        options: [
          'Empresas devem mensurar seu impacto socioambiental e integridade institucional além do lucro',
          'Critérios ambientais e sociais devem ser ignorados quando o mercado financeiro oscila',
          'Apenas empresas estatais possuem obrigação de prestar contas à sociedade',
          'A governança serve exclusivamente para blindar a diretoria executiva de auditorias'
        ],
        correctIndex: 0,
        explanation: 'O ESG integra métricas de sustentabilidade ambiental, justiça social e governança ética à estratégia central das organizações.'
      },
      {
        id: 'q7_2',
        question: 'Ao lidar com desinformação e fake news em uma era de hiperconectividade, a postura ética do profissional diplomado exige:',
        theme: 'Cultura Digital & Fake News',
        options: [
          'Checar fontes fidedignas, valorizar o método científico e combater o discurso de ódio',
          'Compartilhar dados não verificados para gerar engajamento rápido nas redes',
          'Confiar apenas em opiniões de fóruns anônimos sem respaldo técnico',
          'Evitar posicionamento crítico mesmo diante de riscos claros à saúde pública'
        ],
        correctIndex: 0,
        explanation: 'A responsabilidade social do universitário envolve a defesa da ciência, a verificação de fontes e o combate à desinformação.'
      },
      {
        id: 'q7_3',
        question: 'Em um projeto multidisciplinar, a liderança servidora e humanizada se caracteriza por:',
        theme: 'Liderança & Trabalho em Equipe',
        options: [
          'Capacitar a equipe, ouvir ativamente e criar um ambiente de segurança psicológica',
          'Centralizar todas as decisões e punir imediatamente qualquer sugestão divergente',
          'Omitir o feedback para evitar conversas difíceis com os liderados',
          'Impor metas inalcançáveis sem fornecer ferramentas de execução'
        ],
        correctIndex: 0,
        explanation: 'A liderança moderna atua facilitando o desenvolvimento das pessoas, estimulando autonomia e cultivando cooperação.'
      },
      {
        id: 'q7_4',
        question: 'No planejamento de cidades inteligentes e sustentáveis, o princípio da mobilidade urbana prioriza:',
        theme: 'Urbanismo & Mobilidade',
        options: [
          'Transporte público integrado, ciclovias e acessibilidade universal para pedestres',
          'Exclusividade de investimentos para vias expressas de automóveis particulares',
          'Eliminação de calçadas para ampliar o fluxo de caminhões pesados',
          'Segregação geográfica das áreas residenciais em relação aos centros de trabalho'
        ],
        correctIndex: 0,
        explanation: 'A mobilidade sustentável prioriza o transporte coletivo eficiente e modos ativos, garantindo equidade e menor emissão de poluentes.'
      },
      {
        id: 'q7_5',
        question: 'Ao concluir sua graduação e obter a nota máxima no ENADE, o compromisso maior do novo profissional é:',
        theme: 'Compromisso Social & Futuro',
        options: [
          'Aplicar seu conhecimento técnico para gerar valor ético, inclusivo e transformador na sociedade',
          'Guardar o diploma e não se atualizar mais ao longo da carreira',
          'Desconsiderar os impactos sociais das suas criações e intervenções',
          'Limitar seu aprendizado estritamente ao que foi visto na sala de aula'
        ],
        correctIndex: 0,
        explanation: 'A graduação é o ponto de partida de uma jornada contínua de aprendizagem permanente, ética e contribuição social.'
      }
    ]
  },
  {
    id: 8,
    trackId: 'lideranca',
    trackTitle: 'Trilha 3: Desafio Nota 5',
    title: 'Fase 8: Super Match-3 Gabarito Nota 5',
    subtitle: 'Combinações Épicas e Explosões em Cadeia!',
    type: 'match3',
    icon: '🏆',
    difficulty: 'Avançado',
    rewardMoEdu: 500,
    requiredStarsToUnlock: 14,
    description: 'Meta ambiciosa: atinja 2.200 pontos em 18 jogadas! Ative bônus em cadeia para estourar o placar.',
    match3TargetScore: 2200,
    match3MaxMoves: 18
  },
  {
    id: 9,
    trackId: 'lideranca',
    trackTitle: 'Trilha 3: Desafio Nota 5',
    title: 'Fase 9: O Grande Jackpot da Colação',
    subtitle: 'A Roleta Dourada da Nota 5 Suprema',
    type: 'slot',
    icon: '👑',
    difficulty: 'Mestre ENADE',
    rewardMoEdu: 800,
    requiredStarsToUnlock: 18,
    isBossLevel: true,
    description: 'A prova final! 7 giros da sorte na máquina de alta voltagem com multiplicadores lendários de até 10x!',
    slotSpinsAllowed: 7,
    slotTargetMoEdu: 800
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'avatar_capelo_ouro',
    name: 'Capelo Lendário',
    description: 'Ícone dourado radiante para o aluno que busca a nota 5.',
    price: 300,
    type: 'avatar',
    icon: '🎓✨',
    value: 'capelo'
  },
  {
    id: 'avatar_tigre_fera',
    name: 'Mascote Fera ENADE',
    description: 'A aura do estudante imparável que domina qualquer questão.',
    price: 500,
    type: 'avatar',
    icon: '🐯🔥',
    value: 'tiger'
  },
  {
    id: 'avatar_cientista',
    name: 'Mente Brilhante',
    description: 'Avatar do pesquisador nota máxima com jaleco e óculos estilosos.',
    price: 400,
    type: 'avatar',
    icon: '🧑‍🔬⚡',
    value: 'scientist'
  },
  {
    id: 'avatar_coruja_sabedoria',
    name: 'Coruja da Sabedoria',
    description: 'O guardião do conhecimento supremo para mestres do ENADE.',
    price: 650,
    type: 'avatar',
    icon: '🦉💎',
    value: 'owl'
  },
  {
    id: 'title_mestre_gabarito',
    name: 'Título: Mestre do Gabarito',
    description: 'Exibe o título honorário no topo do seu HUD de jogo.',
    price: 250,
    type: 'title',
    icon: '📜',
    value: 'Mestre do Gabarito'
  },
  {
    id: 'title_estudante_nota5',
    name: 'Título: Aluno Nota 5',
    description: 'O título mais cobiçado de toda a universidade.',
    price: 450,
    type: 'title',
    icon: '⭐',
    value: 'Aluno Nota 5'
  },
  {
    id: 'title_rei_moedu',
    name: 'Título: Magnata do MoEdu',
    description: 'Para quem acumulou fortuna nos minijogos e roletas.',
    price: 600,
    type: 'title',
    icon: '💎',
    value: 'Magnata do MoEdu'
  },
  {
    id: 'title_guardiao_trilhas',
    name: 'Título: Guardião das Trilhas',
    description: 'Consagrado por desbravar todos os módulos acadêmicos.',
    price: 800,
    type: 'title',
    icon: '🗺️',
    value: 'Guardião das Trilhas'
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Beatriz "Gênio" Lima', moEdu: 3450, stars: 27, avatar: 'capelo', title: 'Aluno Nota 5' },
  { rank: 2, name: 'Carlos "Fera" Mendes', moEdu: 3180, stars: 25, avatar: 'tiger', title: 'Mestre do Gabarito' },
  { rank: 3, name: 'Juliana "Crânio" Rocha', moEdu: 2890, stars: 24, avatar: 'scientist', title: 'Mente Brilhante' },
  { rank: 4, name: 'Lucas "Calculista" Dias', moEdu: 2420, stars: 21, avatar: 'owl', title: 'Guardião das Trilhas' },
  { rank: 5, name: 'Fernanda "Relâmpago" Silveira', moEdu: 2100, stars: 19, avatar: 'capelo', title: 'Magnata do MoEdu' }
];

export const MATCH3_ITEMS = [
  { id: 'book', name: 'Livro', emoji: '📚', color: 'from-amber-400 to-amber-600', border: 'border-amber-400' },
  { id: 'grad', name: 'Capelo', emoji: '🎓', color: 'from-blue-500 to-indigo-700', border: 'border-blue-400' },
  { id: 'exam', name: 'Gabarito', emoji: '📝', color: 'from-emerald-400 to-teal-600', border: 'border-emerald-400' },
  { id: 'trophy', name: 'Troféu', emoji: '🏆', color: 'from-yellow-300 to-amber-500', border: 'border-yellow-300' },
  { id: 'bulb', name: 'Ideia', emoji: '💡', color: 'from-orange-400 to-rose-500', border: 'border-orange-400' },
  { id: 'medal', name: 'Medalha', emoji: '🎖️', color: 'from-purple-500 to-pink-600', border: 'border-purple-400' }
];

export const SLOT_SYMBOLS = [
  { id: 'tiger', name: 'Fera ENADE', emoji: '🐯', payout3: 500, payout2: 120, rarity: 'jackpot', color: 'text-amber-400' },
  { id: 'diploma', name: 'Diploma Nota 5', emoji: '📜', payout3: 350, payout2: 80, rarity: 'high', color: 'text-yellow-300' },
  { id: 'capelo', name: 'Capelo de Ouro', emoji: '🎓', payout3: 250, payout2: 60, rarity: 'medium', color: 'text-blue-400' },
  { id: 'moedu', name: 'MoEdu Dourada', emoji: '🪙', payout3: 200, payout2: 50, rarity: 'medium', color: 'text-amber-300' },
  { id: 'trophy', name: 'Troféu Brilhante', emoji: '🏆', payout3: 150, payout2: 40, rarity: 'low', color: 'text-orange-400' },
  { id: 'coffee', name: 'Café da Madrugada', emoji: '☕', payout3: 100, payout2: 30, rarity: 'low', color: 'text-emerald-400' }
];

