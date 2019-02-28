// Store/Reducers/favoriteReducer.js

const initialState = {observedBirds: []};

function updateObservedBirds(state = initialState, action) {
    let nextState = undefined;
    switch (action.type) {
        case 'ADD_OBSERVATION':
            nextState = {
                ...state,
                observedBirds: [...state.observedBirds, action.value]
            };
            return nextState;
        case 'REMOVE_OBSERVATION':
            const birdIndex = state.observedBirds.findIndex(item => item.id === action.value.id);
            if (birdIndex !== -1) {
                nextState = {
                    ...state,
                    observedBirds: state.observedBirds.filter((item, index) => index !== birdIndex)
                }
            }
            return nextState || state;
        default:
            return state
    }
}

export default updateObservedBirds;