# API Bitcoin Explorer

## Descrição
Esta é uma API Node.js para interagir com o [Bitcoin Core](https://btc-explorer.vercel.app/), permitindo acesso a funcionalidades como consulta de blocos, transações e endereços. A API é projetada para facilitar a integração com o Bitcoin Core, utilizando a biblioteca `bitcoin-core` para se comunicar com um nó Bitcoin.

---

## Recursos

- Obter detalhes de um bloco pelo **height**
- Consultar informações sobre transações pelo **txid**
- Verificar o saldo e detalhes de um endereço
- Implementação de rate limiting para segurança
- Documentação interativa usando Swagger

---

## Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Bitcoin-Core**
- **Swagger** para documentação
- **Rate Limiting** para controle de requisições

---

## Pré-requisitos

- **Node.js** v12+
- **Bitcoin Core** configurado e rodando
- Acesso às credenciais de RPC do Bitcoin Core (usuário, senha, host e porta)

---

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env` ou diretamente:

   ```env
   BITCOIN_RPC_USER=seu_usuario
   BITCOIN_RPC_PASSWORD=sua_senha
   BITCOIN_RPC_PORT=8332
   BITCOIN_RPC_HOST=127.0.0.1
   ```

---

## Executando o Projeto

1. Inicie o servidor:

   ```bash
   npm start
   ```

2. Acesse a documentação Swagger:

   ```
   http://localhost:5000/api-docs
   ```

---

## Endpoints Principais

### **1. Obter Bloco pelo Height**

- **Endpoint:** `/block/:height`
- **Método:** GET
- **Exemplo de Requisição:**

  ```bash
  curl http://localhost:5000/block/100
  ```

- **Exemplo de Resposta:**

  ```json
  {
    "hash": "000000000000000000examplehash...",
    "confirmations": 120,
    "size": 1200,
    "height": 100,
    "time": 1678901234,
    "tx": ["txid1", "txid2", "txid3"]
  }
  ```

### **2. Consultar Transação pelo txid**

- **Endpoint:** `/transaction/:txid`
- **Método:** GET
- **Exemplo de Requisição:**

  ```bash
  curl http://localhost:5000/transaction/bc1exampletxid...
  ```

- **Exemplo de Resposta:**

  ```json
  {
    "txid": "bc1exampletxid...",
    "confirmations": 10,
    "blockhash": "000000000000000000examplehash...",
    "time": 1678901234,
    "details": [...]
  }
  ```

---

## Melhorias Implementadas

- **Rate Limiting:** Limitação de requisições para evitar abuso.
- **Validação:** Verificação dos parâmetros de entrada para evitar erros inesperados.
- **Exemplos no Swagger:** Adição de exemplos para facilitar o uso.

---

## Deploy no Heroku

1. Certifique-se de que o projeto esteja preparado:
   - Arquivo `Procfile` com:

     ```
     web: node src/app.js
     ```

   - Porta dinâmica configurada:

     ```javascript
     const PORT = process.env.PORT || 5000;
     ```

2. Faça o deploy:

   ```bash
   heroku create
   git push heroku main
   ```

3. Configure as variáveis de ambiente no Heroku:

   ```bash
   heroku config:set BITCOIN_RPC_USER=seu_usuario
   heroku config:set BITCOIN_RPC_PASSWORD=sua_senha
   heroku config:set BITCOIN_RPC_PORT=8332
   heroku config:set BITCOIN_RPC_HOST=127.0.0.1
   ```

4. Teste a aplicação em:

   ```
   https://nome-do-app.herokuapp.com
   ```

---

## Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório
2. Crie uma branch para sua funcionalidade/bugfix: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'Adicionei nova funcionalidade'`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Abra um Pull Request

---

## Licença

📚 Um Projeto de Aprendizagem :
Este projeto é parte da nossa jornada de aprendizagem, com o objetivo de explorar e entender o desenvolvimento full-stack. Ele não se destina ao uso em produção e não deve ser usado para fins críticos ou comerciais. Em vez disso, ele serve como uma plataforma para experimentação, desenvolvimento de habilidades e colaboração.

Essa jornada nos permitiu mergulhar em novas tecnologias, superar desafios e aumentar nossa expertise. É emocionante ver o quão longe chegamos e o tremendo potencial para nosso futuro com este projeto.
