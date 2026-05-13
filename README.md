# Figurinhas Copa 2026 (Android)

App React Native (Expo) para controlar figurinhas:

- Tela Todos os times com secoes expansivas
- Toque curto soma +1 figurinha
- Toque longo remove -1 figurinha
- Badge mostra repetidas (+N)
- Botao alterna ordem alfabetica x ordem do album
- Tela Faltantes usa snapshot e so reaplica filtro ao sair/entrar na tela
- Tela Status com totais e progresso por time

## 1) Rodar localmente

```bash
npm install
npm run start
```

No menu do Expo, use Android para abrir no device conectado.

## 2) Android sem Android Studio

Voce pode usar apenas Node + JDK + Android platform-tools (adb).

### Instalar dependencias (opcao winget)

```powershell
winget install OpenJS.NodeJS.LTS
winget install Microsoft.OpenJDK.17
winget install Google.PlatformTools
```

### Conferir ferramentas

```powershell
node -v
npm -v
java -version
adb version
```

## 3) Conectar celular

1. Ative modo desenvolvedor no Android
2. Ative depuracao USB
3. Conecte por cabo USB
4. Aceite o prompt de confianca no celular

Validar:

```powershell
adb devices
```

## 4) Instalar APK por ADB

Com Expo, o fluxo mais rapido para teste costuma ser:

```bash
npm run android
```

Se voce gerar um APK localmente, instala manual:

```powershell
adb install -r caminho\\do\\app-debug.apk
```

## 5) Regras de uso

- Toque 1x em uma figurinha: passa a "eu tenho" (quantidade 1)
- Toques seguintes: aumentam repetidas
- Toque longo: remove 1 unidade (sem ficar negativo)
- Na tela Faltantes, os itens nao somem na hora ao tocar; filtro atualiza so ao reentrar na tela
