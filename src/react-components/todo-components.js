import React from 'react'
import ReactDOM from 'react-dom'
import CausalityRedux from 'causality-redux'
import 'react-causality-redux'
import {TODO_STATE} from '../state-partitions/todo-partition.js'
import {Provider} from 'react-redux'

//
// Design the react components.
//
const Todo = ({ id, completed, text, toggleTodo }) => (
  <li
    onClick={e => toggleTodo(id, {completed: !completed})}
    style={{
      cursor: "default",
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)
//
// Bind the CausalityRedux generated changer toggleTodo to the props. This will allow this components to call
// the changer toggleTodo through the props which will update the corresponding entry in the array todos in the state partition.
// Then this component will be re-rendered with a different 'completed' entry which changes the UI to give
// a 'line-through' or nothing depending on the value.
//
 let TodoCR = CausalityRedux.connectChangersToProps(Todo, TODO_STATE, ['toggleTodo'], 'TodoCR' );

const TodoList = ({ todos, filter }) => {
    let displayItems = todos;
    if ( filter == "SHOW_ACTIVE" )
        displayItems = todos.filter(e => !e.completed);
    else if ( filter == "SHOW_COMPLETED" )
        displayItems = todos.filter(e => e.completed);
    return(
      <ul>
        {displayItems.map( ({id, completed, text}) =>
          <TodoCR
            key={id}
            id={id}
            completed={completed}
            text={text}
          />
        )}
      </ul>
    );
}
//
// Bind the TODO_STATE state values 'todos' and 'filter' to the props.
//
let TodoListCR = CausalityRedux.connectStateToProps(TodoList, TODO_STATE, ['todos', 'filter'], 'TodoListCR' );

const AddTodo = ({ addTodo, textChange, text }) => (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        let t = text.trim();
        if (!t) {
          textChange("");
          return;
        }
        // adds an entry to the 'todos' array in the state partition. 
        addTodo({text: t, completed:false});
        textChange("");
      }}>
      <input type="text"
        name="text"
        placeholder="To Do"
        required="required"                           
        value={ text }
        // change 'text' in the state partition. Causes a render since this component is bound to that state partition value.
        onChange={ (e) => textChange(e.target.value) }
      />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
)
// Bind the CausalityRedux generated changers 'addTodo' and 'textChange' to the props. Also bind the state value 'text' to the props.
let AddTodoCR = CausalityRedux.connectChangersAndStateToProps(AddTodo, TODO_STATE, ['addTodo', 'textChange'], ['text'], 'AddTodo');

const Link = ({ filterToApply, filter, filterChange, children }) => {
  if (filter == filterToApply) {
    return <span>{children}</span>
  }

  return (
    <a href="#"
       onClick={e => {
         e.preventDefault();
         filterChange(filterToApply);
       }}
    >
      {children}
    </a>
  )
}
// Bind the CausalityRedux generated changer filterChange to the props. Also bind the state value 'filter' to the props.
let FilterLink = CausalityRedux.connectChangersAndStateToProps(Link, TODO_STATE, ['filterChange'], ['filter'], 'FilterLink');

const Footer = () => (
  <p>
    Show:
    {" "}
    <FilterLink filterToApply="SHOW_ALL">
      All
    </FilterLink>
    {", "}
    <FilterLink filterToApply="SHOW_ACTIVE">
      Active
    </FilterLink>
    {", "}
    <FilterLink filterToApply="SHOW_COMPLETED">
      Completed
    </FilterLink>
  </p>
)


const App = () => (
  <div>
    <AddTodoCR />
    <TodoListCR/>
    <Footer/>
  </div>
)

ReactDOM.render(
    <Provider store={CausalityRedux.store}>
        <App/>
    </Provider>,
    document.getElementById('reactroot')
);