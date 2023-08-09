import { accounts } from "../models/bank_account.js"

export const generate_unique_id = () => {
  return new Date().valueOf()
}

export const validate_user_attributes = (model, attributes = []) => {
  const missing = Object.keys(model)
    .filter(e => !model[e] && model[e] !== 0)
    .filter(e => attributes.includes(e))

  return missing
}

export const validate_uniqueness = (hash) => {
  let attributes = Object.keys(hash)
  const _already_taken = []

  for (const account of accounts) {
    const user = account.usuario
    if (attributes.length === 0) break

    for (const att of attributes) {
      if (user[att] === hash[att]) {
        _already_taken.push(att)
      }
    }
  }

  return _already_taken
}

export const find_bank_account_index = (id) => {
  let error = true
  const _index = accounts.findIndex(account => account.numero === id)
  if (_index !== -1) error = false

  return { _index, error }
}

export const find_bank_account = (id) => {
  let error = true
  const _account = accounts.find(account => account.numero === id)
  if (_account) error = false 

  return { _account, error }
}

export const new_bank_account = (nome, email, cpf, data_nascimento, telefone, senha) => {
  const user = { nome, cpf, data_nascimento, telefone, email, senha }
  return { numero: generate_unique_id(), saldo: 0, usuario: user}
}

export const edit_user = (original_user, user) => {
  let flag = false
  for (const key of Object.keys(original_user)) {
    if (user[key]) {
      original_user[key] = user[key] 
      flag = true
    }
  }
  return flag
}

