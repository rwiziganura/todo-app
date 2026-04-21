import app from './app.js';
import todos from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { initializeDatabase } from "./confing/db-init.js";

// Run migrations on startup
initializeDatabase();

app.use("/api/auth", authRoutes);
app.use("/api", todos);


app.get('/', (req, res) => {
  res.send('Todo API is running!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});