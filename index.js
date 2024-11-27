const express = require('express');
const { resolve } = require('path');
let { post } = require('./models/post.model');
let { sequelize } = require('./lib/index');
const { read } = require('fs');

const app = express();
const port = 3000;
app.use(express.json());

let posts = [
  {
    title: 'Getting Started with Node.js',
    content:
      'This post will guide you through the basics of Node.js and how to set up a Node.js project.',
    author: 'Alice Smith',
  },
  {
    title: 'Advanced Express.js Techniques',
    content:
      'Learn advanced techniques and best practices for building applications with Express.js.',
    author: 'Bob Johnson',
  },
  {
    title: 'ORM with Sequelize',
    content:
      'An introduction to using Sequelize as an ORM for Node.js applications.',
    author: 'Charlie Brown',
  },
  {
    title: 'Boost Your JavaScript Skills',
    content:
      'A collection of useful tips and tricks to improve your JavaScript programming.',
    author: 'Dana White',
  },
  {
    title: 'Designing RESTful Services',
    content: 'Guidelines and best practices for designing RESTful APIs.',
    author: 'Evan Davis',
  },
  {
    title: 'Mastering Asynchronous JavaScript',
    content:
      'Understand the concepts and patterns for writing asynchronous code in JavaScript.',
    author: 'Fiona Green',
  },
  {
    title: 'Modern Front-end Technologies',
    content:
      'Explore the latest tools and frameworks for front-end development.',
    author: 'George King',
  },
  {
    title: 'Advanced CSS Layouts',
    content: 'Learn how to create complex layouts using CSS Grid and Flexbox.',
    author: 'Hannah Lewis',
  },
  {
    title: 'Getting Started with React',
    content: 'A beginners guide to building user interfaces with React.',
    author: 'Ian Clark',
  },
  {
    title: 'Writing Testable JavaScript Code',
    content:
      'An introduction to unit testing and test-driven development in JavaScript.',
    author: 'Jane Miller',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await post.bulkCreate(posts);
    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding database', error: error.message });
  }
});

// Exercise 1: Fetch all posts
async function fetchAllPosts() {
  let posts = await post.findAll();
  return { posts };
}

app.get('/posts', async (req, res) => {
  try {
    let result = await fetchAllPosts();
    if (result.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Add a new post in the database
async function addNewPost(postData) {
  let newpost = await post.create(postData);
  return { newpost };
}
app.post('/posts/new', async (req, res) => {
  try {
    let newpost = req.body.newpost;
    let response = await addNewPost(newpost);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Update post information
async function updatePostById(id, newTrackData) {
  let postDetails = await track.findOne({ where: { id } });

  if (!trackDetails) {
    return {};
  }

  postDetails.set(newPostData);
  let updatePost = await postDetails.save();
  return { message: 'Post update successful', updatePost };
}

app.post('/posts/update/:id', async (req, res) => {
  try {
    let newPostData = req.body;
    let id = parseInt(req.params.id);

    let response = await updatePostById(id, newPostData);

    if (!response.message) {
      return res.status(404).json({ message: 'No track found with this id' });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Delete a post from the database
async function deletePostById(id) {
  let deletePostById = await posts.destroy({ where: { id } });

  if (deletePostById === 0) return {};
  return { message: 'Track record Deleted' };
}
app.post('/posts/delete', async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    let result = await deletePostById(id);
    if (!result.length === 0) {
      return res.status(404).json({ message: 'Post not found with this id' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
