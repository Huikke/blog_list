const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('returns correct amount of blogs in JSON format', async () => {
  const response = await api.get('/api/blogs')
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('adds a blog to database and confirm it is added correctly', async () => {
  const newBlog = {
    title: 'Sinijuusto on juustoista juustoin',
    author: 'Sini Juustonen',
    url: 'sinijuusto.fi',
    likes: 2
  }

  await api.post('/api/blogs').send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const DbAfterPost = await helper.blogsInDb()
    expect(DbAfterPost).toHaveLength(helper.initialBlogs.length + 1)

    const titles = DbAfterPost.map(n => n.title)
    expect(titles).toContain('Sinijuusto on juustoista juustoin')
})

test('deletes a blog from database correctly', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

/* For testing put, doesn't work
test('updates a blog posts\'s likes count', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  
  blogToUpdate.likes += 1
  console.log(blogsAtStart)
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate.likes)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd)
}) */

afterAll(() => {
  mongoose.connection.close()
})