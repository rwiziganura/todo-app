import * as userService from '../services/user.services.js';

export async function gettodo(req, res, next) {
  try {
    const todos = await userService.gettodo(req.user.id);
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export const createtodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    await userService.createtodo(title, req.user.id);
    res.status(201).json({ message: "todo created" });
  } catch (error) {
    next(error);
  }
};

export const deletetodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deletetodo(id, req.user.id);
    res.status(200).json({ message: "todo deleted" });
  } catch (error) {
    next(error);
  }
};

export const updatetodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, is_done } = req.body;
    
    // We allow title to be optional if only is_done is changing, but title is usually sent
    await userService.updatetodo(id, title, is_done, req.user.id);
    res.status(200).json({ message: "todo updated" });
  } catch (error) {
    next(error);
  }
};


export const deleteAllTodos = async (req, res, next) => {
  try {
    await userService.deleteAllTodos(req.user.id);
    res.status(200).json({ message: "all todos deleted" });
  } catch (error) {
    next(error);
  }
};

