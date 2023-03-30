const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let totalLikesCount = 0

  blogs.forEach(blog => {
    totalLikesCount += blog.likes
  })

  return totalLikesCount
}

module.exports = { dummy, totalLikes }