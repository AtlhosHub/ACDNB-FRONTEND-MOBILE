# ACDNB - Gestão de Mensalidades (Mobile)

## 📌 Sobre o projeto
Aplicação mobile para gestão de mensalidades de um clube de tênis de mesa.

## 🚀 Funcionalidades
- Cadastro de alunos
- Controle de pagamentos
- Visualização de inadimplência
- Lista de espera
- Dashboard com dados financeiros

## 🛠 Tecnologias utilizadas
- REACT NATIVE
- API REST
- Banco de dados seilá o que sei o que lá

## 🎯 Objetivo
Facilitar o controle financeiro e administrativo do clube.

## Criação de Novos Ícones
O projeto dispõe de um componente próprio para criação de exibição de ícones, porém, é necessário a declaração de novos ícone em "src/assets/icons/index.js". Atualmente estamos usando a biblioteca LineIcons como auxiliar para importar o SVG dos ícones.

É possível visualizar os ícones no site deles: [LineIcons](https://lineicons.com/free-icons)

Para adição de novos ícones siga os seguintes passos:
- Localizar o ícone desejado em "node_modules\@lineiconshq\free-icons\dist\index.d.ts"
    - Lembrese que ícone geralmente possui 4 variações: Outlined, Solid, Duotone e Bulk

- Rodar o seguinte comando, substituindo "NomeDoIcone" pelo nome do ícone:
```
node --input-type=module --eval "import * as i from './node_modules/@lineiconshq/free-icons/dist/index.esm.js'; console.log(JSON.stringify(i.NomeDoIcone, null, 2));"
```

- Copiar o retorno do terminal

- Criar uma nova constante em "src/assets/icons/index.js", colar o retorno do terminal e adiconar os seguinte valores:
    - `OPCIONAL` A mérito de padronização e limpeza, convém remover as seguintes chave/valor:
    - hasFill; hasStroke; hasStrokeWidth; defaultFill; category; variant; style 
```
    "defaultSize": 24,
    "defaultFill": "black",
```