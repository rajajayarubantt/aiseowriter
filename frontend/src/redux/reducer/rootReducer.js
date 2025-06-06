import { combineReducers } from 'redux';
import userReducer from './userReducer'
import errorReducerHelper from './errorReducerHelper'
import errorReducer from './errorReducer'


export default combineReducers({
    user: userReducer,
    error: errorReducer,
    errorHelper: errorReducerHelper
});