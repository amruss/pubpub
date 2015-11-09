/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD_PUB_EDIT = 'editor/LOAD_PUB_EDIT';
export const LOAD_PUB_EDIT_SUCCESS = 'editor/LOAD_PUB_EDIT_SUCCESS';
export const LOAD_PUB_EDIT_FAIL = 'editor/LOAD_PUB_EDIT_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPubEdit(slug) {
	return {
		types: [LOAD_PUB_EDIT, LOAD_PUB_EDIT_SUCCESS, LOAD_PUB_EDIT_FAIL],
		promise: (client) => client.get('/getSamplePubEdit', {params: {slug: slug}}) 
	};
}
