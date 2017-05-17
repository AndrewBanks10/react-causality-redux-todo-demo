import CausalityRedux from 'causality-redux'

//
// Partition definition. causality-redux uses this definition to automatically generate the changers and reducers. 
//
export const TODO_STATE = "TODO_STATE";
const todoState = {
    partitionName: TODO_STATE,
    // Shape of this partition.
    defaultState: {todos:[], nextIndex:"", text:"", filter:"SHOW_ALL"},
    // These are called to change the state of some values in this partition.
    changerDefinitions:{
        //
        // adds an array item to arrayName:'todos'. When this changer is called it argument is of the nature arrayArgShape:{text:'String', completed:'Boolean'}.
        // In particular, addTodo({text :'some text', completed: false})  is a sample call. 
        // Also when the object is added to the array, a key/value is created in the object with id:String automatically added so that any entry can be found.
        // keyIndexerName:'nextIndex' must be in the defaultState as a string and is used to generated a unique index id for each array insertion. So, after
        // one assertion nextIndex == '1';
        //
        'addTodo': { operation: CausalityRedux.operations.STATE_ARRAY_ADD, arrayName:'todos', keyName:'id', keyIndexerName:'nextIndex', arrayArgShape:{text:'String', completed:'Boolean'} }, 
        
        // 
        // CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, allows changing an array entry with an object merge. The argument to toggleTodo has the shape
        // arrayArgShape:{completed:'Boolean'}. The name of the key to search for to find the entry is keyName: 'id'. Finally, the first argument to
        // toggleTodo is the id to search for and the second is the object to merge with that array entry.
        'toggleTodo': { operation: CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, arrayName:'todos', keyName: 'id', arrayArgShape:{completed:'Boolean'} },

        // The current todo text being accumulated by the UI.
        'textChange': { arguments: ['text'] }, 

        // The current filter selected by the UI.
        'filterChange': { arguments: ['filter'] }, 
    }
}

CausalityRedux.addPartitions(todoState);