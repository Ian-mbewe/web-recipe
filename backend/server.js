import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();

// Connect to database "recipe"
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "recipe",
  password: "lysonmbewe@2005",
  port: 5432
});

app.use(cors());
app.use(express.json());

// GET all recipes
app.get("/api/recipe", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipe");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET one recipe by ID
app.get("/api/recipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM recipe WHERE recipe_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST a new recipe
app.post("/api/recipe", async (req, res) => {
  const { flour_variant, relish, vegetables, vegetarian_alternative, servings } = req.body;
  try {
    await pool.query(
      `INSERT INTO recipe (flour_variant, relish, vegetables, vegetarian_alternative, servings)
       VALUES ($1, $2, $3, $4, $5)`,
      [flour_variant, relish, vegetables, vegetarian_alternative, servings]
    );
    res.status(201).json({ message: "Recipe added" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// PUT to update a recipe
app.put("/api/recipe/:id", async (req, res) => {
  const { id } = req.params;
  const { flour_variant, relish, vegetables, vegetarian_alternative, servings } = req.body;
  try {
    const result = await pool.query(
      `UPDATE recipe SET flour_variant=$1, relish=$2, vegetables=$3, vegetarian_alternative=$4, servings=$5
       WHERE recipe_id=$6`,
      [flour_variant, relish, vegetables, vegetarian_alternative, servings, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// DELETE a recipe
app.delete("/api/recipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM recipe WHERE recipe_id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Start server
app.listen(3000, () => console.log("✅ Server running on port 3000"));
