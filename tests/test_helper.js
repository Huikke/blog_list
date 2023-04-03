const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Rantakeli",
    author: "Kalle Rantanen",
    url: "yle.fi",
    likes: 12
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }