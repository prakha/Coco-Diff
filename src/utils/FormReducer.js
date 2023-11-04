
export const FormReducer =  (state, action) => {
  if(action.type === 'reset'){
    return action.value
  }

  if(action.type === 'merge'){
    return Object.assign({},state, action.value)
  }


  return Object.assign({}, state, 
    {
      [action.type]: action.value,
    });
};
