import { banco, contas } from '../src/bancodedados.js'

const bank = banco
const accounts = contas

export const validate_bank = (req, res, next) => {
  const { senha_banco } = req.query

  if (!senha_banco && senha_banco === '') {
    return res.status(400).json({
      message: 'Senha do Banco inválida.'
    })
  }

  if (senha_banco !== bank.senha) {
    return res.status(404).json({
      message: 'Senha do Banco incorreta.'
    })
  }

  next()
} 

//
export const validate_account = (req, res, next) => {
  const { numero_conta, senha } = req.query
  const id =  Number(numero_conta)

  if (!id) {
    return res.status(400).json({
      message: 'Número de Conta inválida.'
    })
  }

  const account = accounts.find(conta => conta.numero === id)

  if (!account) {
    return res.status(404).json({
      message: 'Número da Conta incorreta.'
    })
  }
  if (senha !== account.usuario.senha) {
    return res.status(404).json({
      message: 'Senha da Conta incorreta.'
    })
  }

  next()
} 

