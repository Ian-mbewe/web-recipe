// app.js
const recipeForm = document.getElementById("recipeForm");
const recipeList = document.getElementById("recipeList");

// Fetch recipes
async function getRecipes() {
  const res = await fetch("http://localhost:3000/api/recipes");
  const data = await res.json();
  recipeList.innerHTML = "";
  data.forEach(recipe => {
    const li = document.createElement("li");
    li.textContent = recipe.title;
    recipeList.appendChild(li);
  });
}

// Add a new recipe
recipeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  await fetch("http://localhost:3000/api/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  recipeForm.reset();
  getRecipes();
});

// Initialize
getRecipes();
