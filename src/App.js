import React, { useEffect } from 'react'
import Terminal from 'terminal-in-react'
import { connect } from 'react-redux'

import { store } from './index'
import { add, clear, fetchCurrencies } from './redux/actions/actions'
import { getCommand, printExpense } from './utils/commands'

const App = ({ expense, addExpense, clearExpense, fetchCurrencies, currencies }) => {
  useEffect(() => {
    fetchCurrencies()
  }, [])
  return (
    <div className="wrapper">
      <h1 className="title">track money</h1>
      <div className="terminal">
        {currencies.length && <Terminal
          color='green'
          backgroundColor='black'
          barColor='black'
          style={{ fontWeight: 'bold', fontSize: '1em' }}
          commands={{
            'add': (args, print) => {
              try {
                const command = getCommand(args)
                command.validate(args, { currencies })
                command.run(args, { addExpense })
                const { expense } = store.getState()
                printExpense(expense, print)
              } catch (e) {
                print(e.message)
              }
            },
            'list': (args, print) => {
              const { expense } = store.getState()
              printExpense(expense, print)
            },
            'clear': (args, print) => {
              try {
                const command = getCommand(args)
                command.validate(args, { currencies })
                command.run(args, { clearExpense })
                const { expense } = store.getState()
                printExpense(expense, print)
              } catch (e) {
                print(e.message)
              }
            },
            'total': (args, print) => {
              try {
                const command = getCommand(args)
                command.validate(args, { currencies })
                command.run(args, { print }).catch(e => print(e.message))
              } catch (e) {
                print(e.message)
              }
            },
            'currency': (args, print) => {
              try {
                currencies.forEach((_, i, arr) => {
                  if (i * 20 > arr.length) throw new Error('End of list')
                  const pr = arr.slice(i * 20, i * 20 + 20).toString()
                  print(pr)
                })
              } catch (e) {
                print(e.message)
              }
            }
          }}
          descriptions={{
            add: "adds expense entry to the list of user expenses : add <'YYYY.MM.DD'> <amount of money> <'currency'> <'name of product'>",
            list: 'shows the list of all expenses sorted by date : list',
            clear: "removes all expenses for specified date : clear <'YYYY.MM.DD'>",
            total: "calculate the total amount of money spent and present it to user in specified currency : total <'currency'>",
            currency: 'shows the list of currencies'
          }}
          msg='You can type "help" command here to watch all available commands.'
        />}
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    expense: state.expense,
    currencies: state.currency
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addExpense: data => dispatch(add(data)),
    clearExpense: date => dispatch(clear(date)),
    fetchCurrencies: () => dispatch(fetchCurrencies()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
