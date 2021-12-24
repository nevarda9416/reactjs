import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as TodoAction from '../actions';
import TodoList from '../components/TodoList'
import {getVisibleTodos} from "../selectors";

const mapStateToProp = state => ({
    filteredTodos: getVisibleTodos(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoAction, dispatch)
});

const VisibleTodoList = connect(
    mapStateToProp,
    mapDispatchToProps
)(TodoList);

export default VisibleTodoList
