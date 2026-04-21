import db from "../confing/db.confi.js";

export const gettodo = async (userId) => {
  const [rows] = await db.query("SELECT * FROM todo WHERE user_id = ? ORDER BY id DESC", [userId]);
  return rows;
};


export const createtodo = async (title, userId) => {
  const [rows] = await db.query(
    "INSERT INTO todo (title, user_id) VALUES (?, ?)",
    [title, userId]
  );
  return rows;
};

export const deletetodo = async (id, userId) => {
  const [rows] = await db.query(
    "DELETE FROM todo WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  return rows;
};

export const updatetodo = async (id, title, isDone, userId) => {
  const [rows] = await db.query(
    "UPDATE todo SET title = ?, is_done = ? WHERE id = ? AND user_id = ?",
    [title, isDone, id, userId]
  );
  return rows;
};


export const deleteAllTodos = async (userId) => {
  const [rows] = await db.query(
    "DELETE FROM todo WHERE user_id = ?",
    [userId]
  );
  return rows;
};

