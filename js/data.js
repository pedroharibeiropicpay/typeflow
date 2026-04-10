/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Dados das Lições, Teclado e Jogo
   ═══════════════════════════════════════════════════════════════ */

const LESSONS = [
  {
    id: 1, chapter: 1,
    title: "Home Row — Esquerda",
    keys: "A S D F",
    desc: "Os dedos da mão esquerda na posição base.",
    exercises: [
      "asdf asdf asdf asdf asdf asdf asdf asdf",
      "fdsa fdsa fdsa fdsa fdsa fdsa fdsa fdsa",
      "afsd afsd fasd fasd dafs dafs sadf sadf",
      "fada fada safas safas fada safas fada safas",
      "as safas das fadas as fadas das safas fada"
    ]
  },
  {
    id: 2, chapter: 1,
    title: "Home Row — Direita",
    keys: "J K L Ç",
    desc: "Os dedos da mão direita na posição base.",
    exercises: [
      "jklç jklç jklç jklç jklç jklç jklç jklç",
      "çlkj çlkj çlkj çlkj çlkj çlkj çlkj çlkj",
      "jkçl jkçl ljçk ljçk kçlj kçlj çjkl çjkl",
      "jjkk llçç jklç çlkj kjçl lçjk jklç çlkj",
      "lkjç jçlk kljç çjkl lçkj jklç lkçj çljk"
    ]
  },
  {
    id: 3, chapter: 1,
    title: "Home Row Completa",
    keys: "A S D F G H J K L Ç",
    desc: "Todas as teclas da linha base, incluindo G e H.",
    exercises: [
      "asdf ghjk lç asdf ghjk lç asdf ghjk lç",
      "gal salkal jag flag half dash hash flash",
      "gás sal já dag asd fgh jkl asd fgh jkl",
      "alk gal sal dal fal hal jal kal lal çal",
      "lag had gash lash sag shag jag dash flash"
    ]
  },
  {
    id: 4, chapter: 2,
    title: "Introduzindo E e I",
    keys: "E I",
    desc: "Adicionando as vogais E e I às teclas já aprendidas.",
    exercises: [
      "dedi kiki dedi kiki seis leis deis feis",
      "fiel seis leis feis geli sedi ides fieis",
      "disse fiel ideal ideias fidedigdeeside",
      "seis ideias deles eis digeledis fieis",
      "as ideias dele seis deles eis disse fiel"
    ]
  },
  {
    id: 5, chapter: 2,
    title: "Vogais O e U",
    keys: "O U",
    desc: "Expandindo com as vogais O e U.",
    exercises: [
      "lolo juju fogo ludo judo fulo fulo jogo",
      "solo judo fulo luso fuso lousa fogo jogo",
      "doido folio louvo sujos lousa folia dolo",
      "uso solo golfo ouvido dous girou fugo judo",
      "o uso do fogo solo ouviu o loudo dous girou"
    ]
  },
  {
    id: 6, chapter: 3,
    title: "Teclas R e T",
    keys: "R T",
    desc: "Dedos indicadores sobem — R (esquerda) e T (esquerda).",
    exercises: [
      "frfr ftft frfr ftft frfr ftft frtf frtf",
      "rato tiro frete trilha gruta forte triste",
      "trigo retido trator fritar trigo estrada",
      "a forte trilha triste atraiu o rato grosso",
      "o trator forte retido era triste e farto"
    ]
  },
  {
    id: 7, chapter: 3,
    title: "Teclas Y e N",
    keys: "Y N",
    desc: "Continuando com Y e N — dedo indicador direito.",
    exercises: [
      "jyjy jnjn jyjy jnjn jyjy jnjn jynj jynj",
      "jantar noite juntos unindo atingir anjo",
      "ninfa antigo entrada entorno nitidez enjoo",
      "nenhum nunca unindo sentindo junto nativos",
      "nada entrou no jantar e nenhum notou nada"
    ]
  },
  {
    id: 8, chapter: 4,
    title: "Teclas W e Q",
    keys: "W Q",
    desc: "Dedo anelar esquerdo para W e mindinho para Q.",
    exercises: [
      "swsw qaqa swsw qaqa qwsw sqaw swqa qasw",
      "quero quando quase aqui questao qualidade",
      "frequente qualquer quanto equipe sequencia",
      "a questao frequente quando quisera aqui eu",
      "quero qualquer quantia adequada e quisesse"
    ]
  },
  {
    id: 9, chapter: 4,
    title: "Teclas P e B",
    keys: "P B",
    desc: "P com o mindinho direito e B com o indicador esquerdo.",
    exercises: [
      "pbpb bpbp pbpb bpbp pbpb bpbp pbpb bpbp",
      "sobre pobre barco pista abrir plano brilho",
      "problema publico bravo pelo bispo proibido",
      "o problema publico sobre o plano foi breve",
      "abrir a porta para o pobre bravo do bispo"
    ]
  },
  {
    id: 10, chapter: 5,
    title: "Teclas C, V e X",
    keys: "C V X",
    desc: "A linha de baixo — C (médio), V (indicador), X (anelar).",
    exercises: [
      "dcdc fvfv sxsx dcdc fvfv sxsx cvxc cvxc",
      "vice exato cavalo exceto convite exclusivo",
      "xadrez convexo excesso vacilo cerveja vexar",
      "o convite exclusivo veio de cavalo e xadrez",
      "cerveja exata e convexo vacilo no exercicio"
    ]
  },
  {
    id: 11, chapter: 5,
    title: "Teclas Z e M",
    keys: "Z M",
    desc: "Z com o mindinho esquerdo e M com indicador direito.",
    exercises: [
      "azaz jmjm azaz jmjm azaz jmjm zmzm mzmz",
      "fazer mundo mesmo mesma azar maravilha zona",
      "amazona fazer zoom magazine mazela mescla",
      "o mundo maravilha faz zoom na amazona morta",
      "mesmo fazendo mazela no azar do magazine azul"
    ]
  },
  {
    id: 12, chapter: 6,
    title: "Números — 1 a 5",
    keys: "1 2 3 4 5",
    desc: "Os números da metade esquerda do teclado.",
    exercises: [
      "a1a s2s d3d f4f f5f a1a s2s d3d f4f f5f",
      "12 23 34 45 15 24 35 21 32 43 54 51 42 31",
      "sala 12 casa 34 mesa 45 dia 15 nota 23 fim",
      "12345 54321 13524 24135 31425 42513 51234",
      "foram 15 dias e 23 noites para 345 pessoas"
    ]
  },
  {
    id: 13, chapter: 6,
    title: "Números — 6 a 0",
    keys: "6 7 8 9 0",
    desc: "Os números da metade direita do teclado.",
    exercises: [
      "j6j j7j k8k l9l l0l j6j j7j k8k l9l l0l",
      "67 78 89 90 60 79 86 97 08 69 70 68 96 87",
      "dia 06 hora 17 sala 28 lote 39 caixa 0870",
      "67890 09876 68097 79086 80976 97068 06789",
      "123456 789012 345678 901234 567890 678901"
    ]
  },
  {
    id: 14, chapter: 7,
    title: "Palavras Comuns",
    keys: "Todas",
    desc: "Praticando as palavras mais usadas do português.",
    exercises: [
      "que para uma com por mais sua como ele ela",
      "mas dos era seu tem ser foi bem sem nos das",
      "isso pode depois ainda sobre entre cada vez",
      "quando muito mesmo antes aqui desde vai ser",
      "nosso outro cada onde esse pela isso seus bem"
    ]
  },
  {
    id: 15, chapter: 7,
    title: "Frases Completas",
    keys: "Todas",
    desc: "Treinando com frases reais e pontuação.",
    exercises: [
      "A pratica constante e o segredo da digitacao rapida e precisa.",
      "Cada dia de treino nos aproxima da fluencia no teclado.",
      "O importante nao e a velocidade, mas a consistencia do treino.",
      "Quem digita sem olhar para o teclado ganha tempo e produtividade.",
      "Com paciencia e dedicacao, qualquer pessoa pode digitar rapido."
    ]
  },
  {
    id: 16, chapter: 8,
    title: "Parágrafos — Desafio Final",
    keys: "Todas",
    desc: "Teste completo com textos longos e variados.",
    exercises: [
      "A digitacao e uma habilidade essencial no mundo moderno. Quanto mais rapido e preciso voce digita, mais produtivo se torna no dia a dia.",
      "Aprender a digitar corretamente evita a famosa LER, que e causada por postura e movimentos repetitivos inadequados durante longas sessoes.",
      "O teclado ABNT2 tem algumas particularidades em relacao ao layout americano, como a presenca do C cedilha e a posicao das teclas de acento.",
      "Praticar todos os dias, mesmo que por poucos minutos, e mais eficiente do que fazer sessoes longas esporadicas. A consistencia gera resultados.",
      "Parabens por chegar ate aqui! Voce completou todas as licoes do TypeFlow. Continue praticando no modo jogo para manter suas habilidades afiadas."
    ]
  }
];

const FINGER_MAP_ABNT2 = {
  '`':'pinky','1':'pinky','2':'ring','3':'middle','4':'index','5':'index',
  '6':'index','7':'index','8':'middle','9':'ring','0':'pinky','-':'pinky','=':'pinky',
  'q':'pinky','w':'ring','e':'middle','r':'index','t':'index',
  'y':'index','u':'index','i':'middle','o':'ring','p':'pinky','[':'pinky',']':'pinky',
  'a':'pinky','s':'ring','d':'middle','f':'index','g':'index',
  'h':'index','j':'index','k':'middle','l':'ring','ç':'pinky',
  'z':'pinky','x':'ring','c':'middle','v':'index','b':'index',
  'n':'index','m':'index',',':'middle','.':'ring','/':'pinky',
  ' ':'thumb'
};

const FINGER_MAP_INTL = {
  '`':'pinky','1':'pinky','2':'ring','3':'middle','4':'index','5':'index',
  '6':'index','7':'index','8':'middle','9':'ring','0':'pinky','-':'pinky','=':'pinky',
  'q':'pinky','w':'ring','e':'middle','r':'index','t':'index',
  'y':'index','u':'index','i':'middle','o':'ring','p':'pinky','[':'pinky',']':'pinky',
  'a':'pinky','s':'ring','d':'middle','f':'index','g':'index',
  'h':'index','j':'index','k':'middle','l':'ring',';':'pinky',"'":'pinky',
  'z':'pinky','x':'ring','c':'middle','v':'index','b':'index',
  'n':'index','m':'index',',':'middle','.':'ring','/':'pinky',
  ' ':'thumb'
};

const KEYBOARD_ROWS_ABNT2 = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l','ç','~'],
  ['z','x','c','v','b','n','m',',','.','/']
];

const KEYBOARD_ROWS_INTL = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/']
];

// Dynamic accessors based on current layout setting
function getFingerMap() {
  return state.settings.layout === 'internacional' ? FINGER_MAP_INTL : FINGER_MAP_ABNT2;
}

function getKeyboardRows() {
  return state.settings.layout === 'internacional' ? KEYBOARD_ROWS_INTL : KEYBOARD_ROWS_ABNT2;
}

// Adapt exercise text for the selected layout
function adaptTextForLayout(text) {
  if (state.settings.layout === 'internacional') {
    return text.replace(/ç/g, ';').replace(/Ç/g, ':');
  }
  return text;
}

// Backward compat — used by keyboard.js rendering
let FINGER_MAP = FINGER_MAP_ABNT2;
let KEYBOARD_ROWS = KEYBOARD_ROWS_ABNT2;

function refreshLayoutGlobals() {
  FINGER_MAP = getFingerMap();
  KEYBOARD_ROWS = getKeyboardRows();
}

const GAME_WORDS = [
  'casa','mesa','porta','janela','livro','tempo','mundo','entre','sobre',
  'dentro','fora','antes','depois','agora','sempre','nunca','quase','tudo','nada',
  'certo','errado','grande','pequeno','forte','fraco','rapido','lento','bonito',
  'feio','alegre','triste','claro','escuro','quente','frio','novo','velho','alto',
  'baixo','largo','estreito','grosso','fino','macio','duro','leve','pesado',
  'aberto','fechado','cheio','vazio','limpo','sujo','seco','doce',
  'amargo','salgado','azedo','simples','facil','igual','diferente',
  'codigo','teclado','digital','programa','sistema','arquivo','cursor',
  'pixel','botao','tela','rede','dados','nuvem','servidor','backup','teste',
  'deploy','commit','branch','merge','sprint','debug','stack','array','loop'
];
