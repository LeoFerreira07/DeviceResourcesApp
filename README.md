# DeviceResourcesApp

Aplicativo em **React Native (Expo)** desenvolvido para a atividade prática
**Acesso a Recursos Nativos do Dispositivo Móvel**.

O aplicativo solicita autorização ao usuário e integra-se a dois recursos
nativos do sistema operacional mobile:

- **Galeria de fotos** — seleção de uma imagem e exibição dela na tela;
- **Lista de contatos** — leitura dos contatos do dispositivo e exibição em
  uma lista otimizada (`FlatList`).

---

## Requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- Aplicativo **Expo Go** instalado em um dispositivo Android/iOS, ou um
  emulador Android / simulador iOS configurado

> Os recursos de galeria e contatos são nativos: eles **não funcionam no
> navegador** (`expo start --web`). Use um dispositivo físico ou emulador.

---

## Como executar

```bash
# 1. Clonar o repositório
git clone https://github.com/LeoFerreira07/DeviceResourcesApp.git
cd DeviceResourcesApp

# 2. Instalar as dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

Depois disso:

- **Dispositivo físico:** escaneie o QR Code exibido no terminal com o
  aplicativo **Expo Go**;
- **Emulador Android:** pressione `a` no terminal (ou rode `npm run android`);
- **Simulador iOS (macOS):** pressione `i` no terminal (ou rode `npm run ios`).

---

## Estrutura do projeto

```
DeviceResourcesApp/
├── App.js                                  # Tela principal (SafeAreaView + componentes)
├── app.json                                # Configuração do Expo e permissões nativas
├── package.json                            # Dependências e scripts
└── src/
    └── components/
        ├── ImagePickerComponent.js         # Permissão + galeria + exibição da imagem
        └── ContactsComponent.js            # Permissão + leitura + lista de contatos
```

---

## Permissões configuradas

As permissões estão declaradas em [`app.json`](./app.json):

**iOS (`ios.infoPlist`)**

| Chave | Finalidade |
| --- | --- |
| `NSPhotoLibraryUsageDescription` | Explica por que o app acessa a galeria de fotos |
| `NSContactsUsageDescription` | Explica por que o app acessa os contatos |

**Android (`android.permissions`)**

| Permissão | Finalidade |
| --- | --- |
| `READ_CONTACTS` | Ler os contatos do dispositivo |
| `WRITE_CONTACTS` | Manipular contatos do dispositivo |
| `READ_EXTERNAL_STORAGE` | Ler as imagens da galeria |
| `WRITE_EXTERNAL_STORAGE` | Gravar arquivos no armazenamento |

Além disso, os *config plugins* do `expo-image-picker` e do `expo-contacts`
estão configurados em `expo.plugins` com as mensagens exibidas ao usuário no
momento da solicitação.

---

## Funcionalidades

### 1. Galeria de imagens (`ImagePickerComponent.js`)

- Solicita a permissão de acesso à galeria com
  `ImagePicker.requestMediaLibraryPermissionsAsync()`;
- Abre a galeria com `ImagePicker.launchImageLibraryAsync()`;
- Armazena a URI da imagem selecionada no estado (`useState`) e a exibe em um
  componente `<Image />`;
- Permite remover a imagem exibida.

### 2. Contatos (`ContactsComponent.js`)

- Solicita a permissão de acesso aos contatos com
  `Contacts.requestPermissionsAsync()`;
- Carrega os contatos com `Contacts.getContactsAsync()`, trazendo os campos
  de **telefone** e **e-mail**;
- Exibe os contatos em uma `FlatList` com renderização otimizada
  (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize` e
  `removeClippedSubviews`);
- Usa ícones do `@expo/vector-icons` (FontAwesome) para telefone e e-mail;
- Permite recarregar a lista manualmente.

---

## Tratamento de permissões recusadas

O aplicativo trata todos os cenários de recusa:

| Cenário | Comportamento |
| --- | --- |
| Usuário recusa a permissão | `Alert` explicando a recusa; nenhum dado é acessado |
| Usuário bloqueia a permissão (`canAskAgain: false`) | `Alert` com atalho para as configurações do sistema (`Linking.openSettings()`) |
| Permissão de contatos recusada | Aviso permanente na tela com opção de tentar novamente |
| Usuário cancela a seleção da imagem | `Alert` informando o cancelamento; o estado não é alterado |
| Nenhum contato encontrado | `Alert` "Sem Contatos" e mensagem de lista vazia |
| Falha ao ler os contatos | `try/catch` com `Alert` de erro e log no console |
| Execução no navegador (web) | Aviso informando que o recurso é exclusivo de Android/iOS |

---

## Observação sobre a API de contatos

A partir do **Expo SDK 57** as funções `getContactsAsync()` e
`Contacts.Fields` foram movidas para o subpacote `expo-contacts/legacy` — a
importação a partir de `expo-contacts` lança erro em tempo de execução.
Por isso o projeto usa:

```js
import * as Contacts from 'expo-contacts/legacy';
```

A lógica permanece exatamente a mesma apresentada no guia da disciplina.

---

## Tecnologias

- React Native `0.86.2`
- Expo SDK `57`
- `expo-image-picker`
- `expo-contacts`
- `@expo/vector-icons`
