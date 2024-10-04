const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Rota para registro de usuário
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Usuário registrado com sucesso');
  });
});

// Rota para login de usuário
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      res.status(200).send('Login realizado com sucesso');
    } else {
      res.status(401).send('E-mail ou senha incorretos');
    }
  });
});

// ===== CRUD de Livros =====

// Rota para adicionar um novo livro (Create)
app.post('/books', (req, res) => {
  const { title, writer, page_number, publish_date, isbn, cover } = req.body;

  const query = 'INSERT INTO books (title, writer, page_number, publish_date, isbn, cover) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [title, writer, page_number || null, publish_date, isbn, cover], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar livro:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Livro cadastrado com sucesso!');
  });
});

// Rota para listar todos os livros (Read All)
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Rota para obter um livro específico por ID (Read One)
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).send('Livro não encontrado');
    }
  });
});

// Rota para atualizar um livro existente (Update)
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, writer, page_number, publish_date, isbn, cover } = req.body;
  const query = `
    UPDATE books 
    SET title = ?, writer = ?, page_number = ?, publish_date = ?, cover = ?
    WHERE id = ?
  `;
  db.query(query, [title, writer, page_number, publish_date, isbn, cover, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Livro atualizado com sucesso');
    } else {
      res.status(404).send('Livro não encontrado');
    }
  });
});

// Rota para excluir um livro (Delete)
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Livro excluído com sucesso');
    } else {
      res.status(404).send('Livro não encontrado');
    }
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
