export default (err, req, res) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Что-то пошло не так!' })
}
