import { getCurrencies } from '../redux/actions/actions'
import { store } from '../index'

export const printHandler = print => ([date, expense]) => {
  print(`Date ${ date }`)
  const tabs = '    '
  expense.forEach(({ title, amount, currency }) => {
    print(`${ tabs }${ title } ${ amount } ${ currency }`)
  })
}

export const printExpense = (data, print) =>
  Object
    .entries(data)
    .sort(([d1], [d2]) => Date.parse(d1) - Date.parse(d2))
    .forEach(printHandler(print))

const VALIDATORS = {
  date (v) {
    if (!v.match(/^\d{4}[-./](0?[1-9]|1[012])[-./](0?[1-9]|[12][0-9]|3[01])$/)) {
      throw new Error('Invalid Date. Correct date format :<YYYY.MM.DD>')
    }
  },
  amount (v) {
    if (!Number(v)) throw new Error('amount should be a number')
  },
  currency (v, currencies) {
    if (!currencies.includes(v.toUpperCase())) throw new Error('Invalid currency')
  }
}

const validateArgsFactory = schema => (args, { currencies }) => {
  const [_, ...arg] = args
  if (!(arg.length >= schema.length)) {
    throw new Error(`Required ${ schema.length } arguments`)
  }

  schema.forEach((v, i) => {
    v(arg[i], currencies)
  })
}

const SCHEMA_FOR_COMMAND = {
  add: {
    validate: validateArgsFactory(
      [VALIDATORS.date, VALIDATORS.amount, VALIDATORS.currency, () => true]
    ),
    run: (args, { addExpense }) => {
      const [_, ...arg] = args
      addExpense({
        date: arg[0],
        amount: arg[1],
        currency: arg[2].toUpperCase(),
        title: arg.slice(3).join(' ')
      })
    }
  },
  clear: {
    validate: validateArgsFactory([VALIDATORS.date]),
    run: (args, { clearExpense }) => {
      const [_, ...arg] = args
      clearExpense(arg[0])
    }
  },
  total: {
    validate: validateArgsFactory([VALIDATORS.currency]),
    run: async (args, { print }) => {
      const result = await getCurrencies()
      const { expense } = store.getState()
      const totalEUR = Object.values(expense).flat()
        .reduce((sum, item) => sum + +item.amount / result.rates[item.currency], 0)
      const toCurrency = totalEUR * result.rates[args[1].toUpperCase()]
      print(`${ toCurrency } ${ args[1].toUpperCase() }`)
    }
  }
}

export const getCommand = args => {
  const [cmd] = args
  const command = SCHEMA_FOR_COMMAND[cmd]
  if (!command) throw new Error('Invalid command ' + cmd)
  return command
}

export default getCommand
