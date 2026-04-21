// Temporary in-memory database for testing
let todos = [
  { id: 1, title: 'Sample todo 1' },
  { id: 2, title: 'Sample todo 2' }
];
let nextId = 3;

const tempDb = {
  query: async (sql, params) => {
    console.log('Mock DB Query:', sql, params);
    
    if (sql.includes('SELECT')) {
      return [todos];
    } else if (sql.includes('INSERT')) {
      const newTodo = { id: nextId++, title: params[0] };
      todos.push(newTodo);
      return [{ insertId: newTodo.id }];
    } else if (sql.includes('DELETE')) {
      const id = parseInt(params[0]);
      todos = todos.filter(todo => todo.id !== id);
      return [{ affectedRows: 1 }];
    }
    return [];
  }
};

export default tempDb;
