import express from 'express'

import { 
  validate_bank,
  validate_account
} from "../controllers/middleware.js"

import {
  get_bank_accounts, get_bank_account,
  add_bank_account,
  update_bank_account_user,
  delete_bank_account,
  check_balance
} from '../controllers/bank_accounts_controller.js'

import {
  deposit,
  withdraw,
  transfer,
  print_statement
} from "../controllers/transactions_controller.js"

const routes = express()

// ROUTES
//
routes.get('/contas', validate_bank, get_bank_accounts)
routes.get('/conta/:id', validate_bank, get_bank_account) // if /contas/:id, collide with /contas/saldo
routes.post('/contas', add_bank_account)
routes.put('/contas/:id/usuario', update_bank_account_user)
routes.delete('/contas/:id', delete_bank_account)

routes.get('/contas/saldo', validate_account, check_balance)
routes.get('/contas/extrato', validate_account, print_statement)

routes.post('/transacoes/depositar', deposit)
routes.post('/transacoes/sacar', withdraw)
routes.post('/transacoes/tranferir', transfer)

export { routes } 

