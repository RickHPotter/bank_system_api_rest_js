import { withdraws, deposits, transfers } from "../models/transaction.js"

// UTIL
//
const date_now = () => {
  return (new Date()).toISOString().slice(0, 19).replace("T", " ")
}

// WRITE
//
export const transfer_in = (account, value) => {
  account.saldo += value
  const log = {
    data: date_now(),
    numero_conta: account.numero,
    valor: value
  }
  deposits.push(log)
}

export const transfer_out = (account, value) => {
  account.saldo -= value
  const log = {
    data: date_now(),
    numero_conta: account.numero,
    valor: value
  }
  withdraws.push(log)
}

export const transfer_in_out = (from_account, to_account, value) => {
  from_account.saldo -= value
  to_account.saldo += value
  const log = {
    data: date_now(),
    numero_conta_origem: from_account.numero,
    numero_conta_destino: to_account.numero,
    valor: value
  }
  transfers.push(log)
}

// READ
//
export const retrieve_deposits = (id) => {
  return deposits.filter(e => e.numero_conta === id)
}

export const retrieve_withdraws = (id) => {
  return withdraws.filter(e => e.numero_conta === id)
}

export const retrieve_transfers_in = (id) => {
  return transfers.filter(e => e.numero_conta_origem === id)
}

export const retrieve_transfers_out = (id) => {
  return deposits.filter(e => e.numero_conta_destino === id)
}

