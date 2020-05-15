import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT } from "../action/auth";
const initialState = {
  token: "",
  userId: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case LOGIN:
    // case SIGNUP:
    case AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
      };
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
