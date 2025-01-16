const express = require("express");
const { resolve } = require("path");
let { post } = require("./models/post.model");
let { sequelize } = require("./lib/index");
const { read } = require("fs");

const app = express();
const port = 3000;
app.use(express.json());

let posts = [
  {
    title: "Getting Started with Node.js",
    content:
      "This post will guide you through the basics of Node.js and how to set up a Node.js project.",
    author: "Alice Smith",
  },
  {
    title: "Advanced Express.js Techniques",
    content:
      "Learn advanced techniques and best practices for building applications with Express.js.",
    author: "Bob Johnson",
  },
  {
    title: "ORM with Sequelize",
    content:
      "An introduction to using Sequelize as an ORM for Node.js applications.",
    author: "Charlie Brown",
  },
  {
    title: "Boost Your JavaScript Skills",
    content:
      "A collection of useful tips and tricks to improve your JavaScript programming.",
    author: "Dana White",
  },
  {
    title: "Designing RESTful Services",
    content: "Guidelines and best practices for designing RESTful APIs.",
    author: "Evan Davis",
  },
  {
    title: "Mastering Asynchronous JavaScript",
    content:
      "Understand the concepts and patterns for writing asynchronous code in JavaScript.",
    author: "Fiona Green",
  },
  {
    title: "Modern Front-end Technologies",
    content:
      "Explore the latest tools and frameworks for front-end development.",
    author: "George King",
  },
  {
    title: "Advanced CSS Layouts",
    content: "Learn how to create complex layouts using CSS Grid and Flexbox.",
    author: "Hannah Lewis",
  },
  {
    title: "Getting Started with React",
    content: "A beginners guide to building user interfaces with React.",
    author: "Ian Clark",
  },
  {
    title: "Writing Testable JavaScript Code",
    content:
      "An introduction to unit testing and test-driven development in JavaScript.",
    author: "Jane Miller",
  },
];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await post.bulkCreate(posts);
    res.status(200).json({ message: "Database Seeding Successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding database", error: error.message });
  }
});

// Exercise 1: Fetch all posts
async function fetchAllPosts() {
  let posts = await post.findAll();
  return { posts };
}

app.get("/posts", async (req, res) => {
  try {
    let result = await fetchAllPosts();
    if (result.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Add a new post in the database
async function detailedPost(postId) {
  return await post.findOne({ where: { id: postId } });
}

app.post("/posts/new", async (req, res) => {
  try {
    const { title, content, author } = req.body.newPost;

    const newPost = await post.create({ title, content, author });

    const postDetails = await detailedPost(newPost.id);

    res.json({ newPost: postDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Update post information
async function updatePostById(id, newPostData) {
  const [updatedCount, updatedPosts] = await post.update(newPostData, {
    where: { id },
    returning: true,
  });

  if (updatedCount === 0) {
    throw new Error("Post not found or no changes made");
  }

  return updatedPosts[0];
}

app.post("/posts/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newPostData = req.body;

    const updatedPostData = await updatePostById(id, newPostData);

    res.json({
      message: "Post updated successfully",
      updatedPost: updatedPostData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Delete a post from the database
async function deletePostById(id) {
  const result = await post.destroy({
    where: { id },
  });
  return result;
}
app.post("/posts/delete", async (req, res) => {
  try {
    const { id } = req.body;

    const deletionResult = await deletePostById(id);

    if (deletionResult === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
