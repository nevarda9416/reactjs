import {SET_VISIBILITY_FILTER} from "../constants/ActionTypes";
import {SHOW_ALL} from '../constants/TodoFilters';

const visibilityFilter = (state = SHOW_ALL, action) => {
    if (action.type === SET_VISIBILITY_FILTER) {
        return action.filter;
    } else {
        return state
    }
};
export default visibilityFilter
