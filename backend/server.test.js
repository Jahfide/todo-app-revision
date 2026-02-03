const request = require('supertest');
const app = require('./server');

describe('Todo API Tests', () => {
  
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test('GET /api/todos should return todos array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/todos should create a new todo', async () => {
    const newTodo = { title: 'Test Todo' };
    const res = await request(app)
      .post('/api/todos')
      .send(newTodo);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Todo');
    expect(res.body.completed).toBe(false);
  });

  test('POST /api/todos without title should return 400', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({});
    
    expect(res.statusCode).toBe(400);
  });

  test('PUT /api/todos/:id should update todo', async () => {
    const res = await request(app)
      .put('/api/todos/1')
      .send({ completed: true });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id should delete todo', async () => {
    const res = await request(app)
      .delete('/api/todos/1');
    
    expect(res.statusCode).toBe(204);
  });
});