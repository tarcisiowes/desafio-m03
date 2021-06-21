const conexao = require('../conexao')

const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwt_secret')

const authy = async (req, res, next) => {

  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json('Token não informado.')
  }

  try {

    const token = authorization.replace('Bearer', '').trim()

    const { id } = jwt.verify(token, jwtSecret)

    const { rows, rowCount } = await conexao.query('select * from usuarios where id = $1', [id])

    if (rowCount === 0) {
      
      return res.status(404).json("Usuario não encontrado")
    }
    
    const {senha, ... usuario} = rows[0]
    
    req.usuario = usuario

    next()

  } catch (error) {

    return res.status(400).json(error.message)
  }

}

module.exports = authy