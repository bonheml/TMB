const initialState = {prev_results: []};

function updatePreviousResults(state = initialState, action) {
    let nextState = undefined;
    switch (action.type) {
        case 'ADD_RESULTS':
            nextState = {
                ...state,
                prev_results: action.value
            };
            return nextState;
        case 'REMOVE_RESULTS':
            nextState = {
                ...state,
                prev_results: undefined
            };
            return nextState;
        default:
            return state
    }
}

export default updatePreviousResults;