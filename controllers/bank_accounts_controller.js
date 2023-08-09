import { accounts } from "../models/bank_account.js"

import { 
  validate_user_attributes,
  find_bank_account_index,
  find_bank_account,
  new_bank_account,
  edit_user,
  validate_uniqueness,
} from "../helpers/bank_accounts_helpers.js"


// READ
//
export const get_bank_accounts = (_, res) => { return res.json(accounts) }

export const get_bank_account = (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Essa Conta não é valida.'
    })
  }

  const { _account, error } = find_bank_account(id)
  if (error) return res.status(404).json({
    error: 'Não existe uma Conta com esse número.'
  })

  return res.json(_account)
}

// CREATE
//
export const add_bank_account = (req, res) => {
  const { nome, email, cpf, data_nascimento, telefone, senha } = req.body
  const bank_account = new_bank_account(nome, email, cpf, data_nascimento, telefone, senha)

  const _already_taken = validate_uniqueness({ cpf, email })

  if (_already_taken.length) {
    const attributes = _already_taken.join(' - ')
    return res.status(400).json({
      error: `Campo(s) [${attributes}] já existe(m) em algum outro cadastro.`
    })
  } 

  const attributes = ['nome', 'email', 'cpf', 'data_nascimento', 'telefone', 'senha']
  const missing = validate_user_attributes(bank_account.usuario, attributes)
  if (missing.length) {
    const attributes = missing.join(', ')
    return res.status(400).json({ error: `Atributos Faltantes: ${attributes}.` })
  }

  accounts.push(bank_account)
  return res.status(201).json({ 
    message: `Conta '${bank_account.numero}' foi criada.`
  })
}

// UPDATE
//
export const update_bank_account_user = (req, res) => {
  const id = Number(req.params.id)
  const { _account, error } = find_bank_account(id)

  if (error) return res.status(400).json({ 
    error: 'Conta com esse Número não existe.'
  })

  const { nome, email, cpf, data_nascimento, telefone, senha } = req.body
  const bank_account = new_bank_account(nome, email, cpf, data_nascimento, telefone, senha)

  const att = {} 
  if (cpf) att['cpf'] = cpf
  if (email) att['email'] = email

  const _already_taken = validate_uniqueness(att)

  if (_already_taken.length) {
    const attributes = _already_taken.join(' - ')
    return res.status(400).json({
      error: `Campo(s) [${attributes}] já existe(m) em algum outro cadastro.`
    })
  } 

  if (edit_user(_account.usuario, bank_account.usuario)) {
    return res.json({ 
      message: `Conta Número '${id}' foi atualizada.`,
    })
  } 

  return res.status(400).json({ 
    error: 'JSON vazio ou inválido. Nenhuma mudança foi feita.'
  })
}

// DELETE
//
export const delete_bank_account = (req, res) => {
  const id = Number(req.params.id)
  const { _index, error } = find_bank_account_index(id)

  if (error) return res.status(400).json({ 
    error: 'Conta com esse Número não existe.'
  })

  if (accounts[_index].saldo > 0) return res.status(400).json({
    error: 'Conta com saldo não pode ser cancelada.'
  })

  accounts.splice(_index, 1)
  return res.json({ message: `Conta de número '${id}' foi cancelada.` })
}


// USER INTERACTIONS
//
export const check_balance = (req, res) => {
  const { numero_conta } = req.query
  const id = Number(numero_conta)

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Essa Conta não é valida.'
    })
  }

  const { _account, error } = find_bank_account(id)
  if (error) return res.status(404).json({
    error: 'Não existe uma Conta com esse número.'
  })

  return res.json({ message: `Seu saldo é R$ ${_account.saldo / 10}.`})
}

