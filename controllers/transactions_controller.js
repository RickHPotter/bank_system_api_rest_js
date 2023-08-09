import { find_bank_account } from '../helpers/bank_accounts_helpers.js'

import { 
  transfer_in,
  transfer_out,
  transfer_in_out,
  retrieve_deposits,
  retrieve_withdraws,
  retrieve_transfers_in,
  retrieve_transfers_out
 } from '../helpers/transactions_helpers.js'

export const deposit = (req, res) => {
  const { numero_conta, valor } = req.body

  const id = Number(numero_conta)

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Essa Conta não é valida.'
    })
  }

  const value = Number(valor)

  if (isNaN(value) || value <= 0) {
    return res.status(400).json({
      error: 'Valor de Depósito deve ser maior que zero (0).'
    })
  }

  const { _account, error } = find_bank_account(id)

  if (error) return res.status(404).json({
    error: 'Não existe uma Conta com esse número.'
  })

  transfer_in(_account, value)
  return res.json({ message: 'Depósito feito com sucesso.' })
}

export const withdraw = (req, res) => {
  const { numero_conta, valor, senha } = req.body

  const id = Number(numero_conta)

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Essa Conta não é valida.'
    })
  }

  const value = Number(valor)

  if (isNaN(value) || value <= 0) {
    return res.status(400).json({
      error: 'Valor de Saque deve ser maior que zero (0).'
    })
  }

  const { _account, error } = find_bank_account(id)

  if (error) return res.status(404).json({
    error: 'Não existe uma Conta com esse número.'
  })

  if (_account.senha !== senha) return res.status(404).json({
    error: 'Senha inválida.'
  })

  if (value > _account.saldo) return res.status(403).json({
    error: 'Saldo Insuficiente para essa operação.'
  })

  transfer_out(_account, value)
  return res.json({ message: 'Saque feito com sucesso.' })
}

export const transfer = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

  const id_from = Number(numero_conta_origem)
  const id_to = Number(numero_conta_destino)

  if (isNaN(id_from + id_to)) {
    return res.status(400).json({
      error: 'Uma das Contas é valida.'
    })
  }

  const value = Number(valor)

  if (isNaN(value) || value <= 0) {
    return res.status(400).json({
      error: 'Valor de Transferência deve ser maior que zero (0).'
    })
  }

  const { _account: account_from, error: error_from } = find_bank_account(id);
  const { _account: account_to, error: error_to } = find_bank_account(id);

  if (error_from || error_to) return res.status(404).json({
    error: 'Uma das Contas não existe.'
  })

  if (account_from.senha !== senha) return res.status(404).json({
    error: 'Senha inválida.'
  })

  if (value > account_from.saldo) return res.status(403).json({
    error: 'Saldo Insuficiente para essa operação.'
  })

  transfer_in_out(account_from, account_to, value)
  return res.json({ message: 'Transferência feita com sucesso.' })
}

export const print_statement = (req, res) => {
  const { numero_conta } = req.query
  const id = Number(numero_conta)

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Essa Conta não é valida.'
    })
  }

  const { _account: _, error } = find_bank_account(id)

  if (error) return res.status(404).json({
    error: 'Não existe uma Conta com esse número.'
  })

  const _deposits = retrieve_deposits(id)
  const _withdraws = retrieve_withdraws(id)
  const _transfers_in = retrieve_transfers_in(id)
  const _transfers_out = retrieve_transfers_out(id)

  return res.json({
    deposits: _deposits,
    saques: _withdraws,
    transferenciasEnviadas: _transfers_in,
    transferenciasRecebidas: _transfers_out,
  })
}

