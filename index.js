const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
const mongoURI = process.env['mongoURI'];

mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const recipeSchema = new mongoose.Schema({
	name: String,
	ingredients: [String],
	instructions: [String],
	time: Number,
	location: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// GET all recipes
app.get("/api/recipes", async (req, res) => {
	try {
		const recipes = await Recipe.find({});
		res.json(recipes);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// GET a specific recipe by ID
app.get("/api/recipes/:recipeId", async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId);
		if (!recipe) {
			res.status(404).send("Recipe not found");
		} else {
			res.json(recipe);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// POST a new recipe
app.post("/api/recipes", async (req, res) => {
	try {
		const recipe = new Recipe(req.body);
		await recipe.save();
		res.json(recipe);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// PUT (update) a recipe by ID
app.put("/api/recipes/:recipeId", async (req, res) => {
	try {
		const recipe = await Recipe.findByIdAndUpdate(
			req.params.recipeId,
			req.body,
			{ new: true }
		);
		if (!recipe) {
			res.status(404).send("Recipe not found");
		} else {
			res.json(recipe);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// DELETE a recipe by ID
app.delete("/api/recipes/:recipeId", async (req, res) => {
	try {
		const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);
		if (!recipe) {
			res.status(404).send("Recipe not found");
		} else {
			res.json(recipe);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// GET recipes containing search text
app.get("/api/recipes/search", async (req, res) => {
	try {
		const searchText = req.query.q;
		const recipes = await Recipe.find({
			$or: [
				{ name: { $regex: searchText, $options: "i" } },
			],
		});
		res.json(recipes);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));