import { LevelConfig, ShopItem } from '../types';

export const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Fase 1: O Show da Formação Geral',
    subtitle: 'Quiz Interativo de Conhecimentos Gerais & Ética',
    type: 'quiz',
    icon: '🧠',
    rewardMoEdu: 150,
    requiredStarsToUnlock: 0,
    description: 'Responda a 5 perguntas desafiadoras do ENADE antes que o tempo acabe! Mantenha o combo para faturar mais MoEdu.',
    quizQuestions: [
      {
        id: 'q1',
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
        id: 'q2',
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
        id: 'q3',
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
        id: 'q4',
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
        id: 'q5',
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
    title: 'Fase 2: Match-3 dos Documentos',
    subtitle: 'Organize a Pasta Acadêmica e Pontue Alto!',
    type: 'match3',
    icon: '📚',
    rewardMoEdu: 200,
    requiredStarsToUnlock: 1,
    description: 'Combine 3 ou mais itens acadêmicos iguais para despachar os documentos do ENADE! Alcance a meta de 1.200 pontos em 15 jogadas.',
    match3TargetScore: 1200,
    match3MaxMoves: 15
  },
  {
    id: 3,
    title: 'Fase 3: Giro da Fortuna ENADE',
    subtitle: 'Tigrinho Acadêmico & Caça-Níquel de MoEdu',
    type: 'slot',
    icon: '🎰',
    rewardMoEdu: 250,
    requiredStarsToUnlock: 2,
    description: 'Gire a roleta dos estudantes e combine os símbolos sagrados da aprovação para faturar um jackpot de MoEdu!',
    slotSpinsAllowed: 5,
    slotTargetMoEdu: 400
  },
  {
    id: 4,
    title: 'Fase 4: Desafio Especialista ENADE',
    subtitle: 'Quiz Rápido de Raciocínio Lógico & Diversidade',
    type: 'quiz',
    icon: '⚡',
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
    title: 'Fase 5: Super Match-3 Gabarito Nota 5',
    subtitle: 'Combinações Épicas e Explosões em Cadeia!',
    type: 'match3',
    icon: '🏆',
    rewardMoEdu: 350,
    requiredStarsToUnlock: 6,
    description: 'Meta ambiciosa: atinja 2.000 pontos em 18 jogadas! Ative bônus em cadeia para estourar o placar.',
    match3TargetScore: 2000,
    match3MaxMoves: 18
  },
  {
    id: 6,
    title: 'Fase 6: O Grande Jackpot do Diploma',
    subtitle: 'A Roleta Dourada da Colação de Grau',
    type: 'slot',
    icon: '👑',
    rewardMoEdu: 500,
    requiredStarsToUnlock: 9,
    description: 'A prova final! 7 giros da sorte na máquina de alta voltagem com multiplicadores de até 10x!',
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
    value: '🎓'
  },
  {
    id: 'avatar_tigre_fera',
    name: 'Mascote Fera ENADE',
    description: 'A aura do estudante imparável que domina qualquer questão.',
    price: 500,
    type: 'avatar',
    icon: '🐯🔥',
    value: '🐯'
  },
  {
    id: 'avatar_cientista',
    name: 'Mente Brilhante',
    description: 'Avatar do pesquisador nota máxima com jaleco e óculos estilosos.',
    price: 400,
    type: 'avatar',
    icon: '🧑‍🔬⚡',
    value: '🧑‍🔬'
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
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Beatriz "Gênio" Lima', moEdu: 2450, stars: 18, avatar: '🎓', title: 'Aluno Nota 5' },
  { rank: 2, name: 'Carlos "Fera" Mendes', moEdu: 2180, stars: 17, avatar: '🐯', title: 'Mestre do Gabarito' },
  { rank: 3, name: 'Juliana "Crânio" Rocha', moEdu: 1890, stars: 16, avatar: '🧑‍🔬', title: 'Mente Brilhante' },
  { rank: 4, name: 'Lucas "Calculista" Dias', moEdu: 1620, stars: 14, avatar: '📚', title: 'Explorador ENADE' },
  { rank: 5, name: 'Fernanda "Relâmpago" Silveira', moEdu: 1400, stars: 12, avatar: '⚡', title: 'Veterana' }
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
