# TypeFlow

Curso de digitação moderno, gratuito e open source. Roda 100% no browser, sem backend, sem cadastro — é só abrir e começar a praticar.

**Acesse agora:** [pedroharibeiropicpay.github.io/typeflow](https://pedroharibeiropicpay.github.io/typeflow/)

---

## O que é

Um curso completo de digitação com 16 lições progressivas que te levam do zero (posição base ASDF JKL;) até digitar parágrafos inteiros sem olhar pro teclado. Inspirado em cursos clássicos de datilografia, mas com visual e UX modernos.

## Features

- **16 lições em 8 capítulos** — progressão gradual: home row → vogais → consoantes → números → frases → parágrafos
- **Teclado virtual** com indicador de cor por dedo (mindinho, anelar, médio, indicador, polegar)
- **Métricas em tempo real** — WPM, precisão, combo e tempo durante cada exercício
- **Sistema de XP e níveis** — gamificação pra manter a motivação
- **Palavras Cadentes** — mini-game onde palavras caem e você precisa digitar antes de chegar ao fundo
- **Dashboard** com gráficos de evolução da velocidade
- **Mapa de calor** mostrando quais teclas você mais erra
- **Progresso salvo** via localStorage — fecha o browser e volta sem perder nada
- **Dark theme** estilo Monkeytype — tipografia mono, gradients, animações suaves
- **Zero dependências** — HTML, CSS e JS puro. Sem framework, sem build, sem npm install

## Como usar

Abra o link e comece a digitar. É só isso.

Se preferir rodar localmente:

```bash
git clone https://github.com/pedroharibeiropicpay/typeflow.git
cd typeflow
open index.html
```

## Estrutura do projeto

```
typeflow/
├── index.html           # HTML estrutural
├── css/style.css        # Estilos (dark theme, componentes)
├── js/
│   ├── data.js          # Lições, teclado, palavras do jogo
│   ├── state.js         # Persistência, XP, níveis
│   ├── engine.js        # Motor de digitação (WPM, precisão, progressão)
│   ├── keyboard.js      # Teclado virtual e highlight
│   ├── game.js          # Mini-game Palavras Cadentes
│   ├── ui.js            # Interface, navegação, gráficos
│   └── app.js           # Bootstrap e event listeners
└── tests/
    ├── helper.js        # Loader para rodar scripts de browser no Node
    ├── data.test.js     # Validação dos dados das lições
    ├── state.test.js    # Testes de persistência e XP
    └── engine.test.js   # Testes do motor e progressão
```

## Testes

40 testes automatizados usando `node:test` (Node 18+). Sem dependências.

```bash
node --test tests/*.test.js
```

Cobrem:
- Estrutura e conteúdo das lições (sem caracteres estranhos, sem palavras grudadas)
- Persistência e recuperação de estado
- Cálculo de XP e level up
- Progressão de exercícios (1→2→3→4→5 sem repetir)
- Desbloqueio de lições (lição N completa → lição N+1 disponível)

## Contribuindo

Contribuições são bem-vindas! Abra um PR com sua sugestão — ele será analisado por uma IA (via HubAI Nitro) que vai revisar código, conteúdo e consistência antes do merge.

### Algumas ideias de contribuição

- **Novas lições** — acentuação (á, é, ã, ç), pontuação avançada, teclas especiais
- **Novos idiomas** — adaptar exercícios pra inglês, espanhol, etc
- **Novos mini-games** — corrida de palavras, modo zen, desafio contra o relógio
- **Temas visuais** — light mode, alto contraste, temas customizados
- **Acessibilidade** — suporte a screen readers, navegação por teclado completa
- **Métricas** — precisão por dedo, evolução por tecla, sugestão de lições pra reforçar
- **PWA** — transformar em app instalável com service worker

### Como contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b minha-melhoria`)
3. Faça suas alterações
4. Rode os testes (`node --test tests/*.test.js`) — todos devem passar
5. Commit seguindo o padrão (`feat: adiciona lição de acentuação`)
6. Abra um Pull Request descrevendo o que mudou e por quê

### Regras

- Mantenha zero dependências externas — só HTML, CSS e JS puro
- Se adicionar lições, rode `node --test tests/data.test.js` pra validar o conteúdo
- Exercícios devem usar palavras reais em português
- Não quebre a progressão existente (IDs sequenciais, 5 exercícios por lição)

## Licença

MIT — use, modifique e distribua como quiser.
