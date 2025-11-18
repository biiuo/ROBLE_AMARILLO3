import User from "../../models/user.model.js";

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
export default deleteUser;
