import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch
// declares that the 'action' is a specifically a thunk function
/**
 <return value, 
 state type for getState,
 extra arugment(for customization),
 action types accepted by dispatch>
 */
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store
