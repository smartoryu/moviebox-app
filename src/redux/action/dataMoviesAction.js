import STORE_API from "../actionType";

export const storeAPI = payload => {
  return {
    type: STORE_API,
    payload
  };
};
