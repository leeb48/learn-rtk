import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/App'

import store from './app/store'
import { Provider } from 'react-redux'

const render = () => {
  const App = require('./app/App').default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render)
}
