const initialState = {prevResults: []};

function updatePreviousResults(state = initialState, action) {
    let nextState = undefined;
    switch (action.type) {
        case 'ADD_RESULTS':
            nextState = {
                ...state,
                prevResults: action.value
            };
            return nextState;
        case 'REMOVE_RESULTS':
            nextState = {
                ...state,
                prevResults: undefined
            };
            return nextState;
        default:
            return state
    }
}

export default updatePreviousResults;