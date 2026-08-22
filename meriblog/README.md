# meriblog

Site pessoal — bio, projetos e artigos sobre Python, SQL, Git e biblioteconomia.

## Estrutura

```
meriblog/
├── index.html              → página inicial (hero, sobre, posts, projeto, contato)
├── posts/
│   └── exemplo-post.html   → template de artigo individual
├── assets/
│   ├── css/style.css       → todo o estilo (cores, tipografia, layout)
│   ├── js/main.js          → animações leves de scroll
│   └── img/                → coloque suas fotos/imagens aqui
└── README.md
```

## O que trocar primeiro

Procure por comentários `<!-- TROQUE ESTE TEXTO -->` dentro do `index.html` e do
`posts/exemplo-post.html` — são os textos de exemplo (bio, apresentação, artigo).

Também troque todo `SEU-USUARIO` pelos seus links reais do GitHub e LinkedIn
(aparecem no hero, no rodapé e na seção de projeto).

Pra trocar a "foto" da seção Sobre por uma imagem de verdade: coloque o
arquivo em `assets/img/`, e no `index.html` troque a `<div class="about-photo">`
por uma tag `<img>` apontando pro arquivo.

## Como criar um novo post

1. Duplique `posts/exemplo-post.html` e renomeie (ex: `posts/segundo-post.html`).
2. Troque o título, a data, o "call-number" (BLG.2026.02, BLG.2026.03...) e o conteúdo.
3. No `index.html`, dentro da seção `#posts`, troque um dos cards `<a href="#">`
   pra apontar pro novo arquivo, com o resumo do artigo.

## Publicando no GitHub Pages (passo a passo)

Isso assume que você já tem Git instalado e uma conta no GitHub.

```bash
# 1. entre na pasta do site
cd meriblog

# 2. inicialize o repositório git
git init

# 3. adicione todos os arquivos
git add .

# 4. faça o primeiro commit
git commit -m "primeiro commit: estrutura inicial do meriblog"

# 5. crie um repositório no GitHub chamado "meriblog" (pelo site github.com/new)
#    depois conecte seu repositório local a ele:
git remote add origin https://github.com/SEU-USUARIO/meriblog.git

# 6. envie o código
git branch -M main
git push -u origin main
```

Depois:

1. No GitHub, vá em **Settings → Pages** do repositório.
2. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
3. Salve. Em alguns minutos o site estará em
   `https://SEU-USUARIO.github.io/meriblog/`.

A partir daí, todo novo post ou ajuste de estilo é só:

```bash
git add .
git commit -m "descreva o que você mudou"
git push
```

## Rodando localmente antes de publicar

Não precisa de nada além de um navegador — dê duplo clique no `index.html`.
Se quiser um servidor local (recomendado pra testar links entre páginas):

```bash
python -m http.server 8000
# depois abra http://localhost:8000 no navegador
```
