import { deleteUser } from "../user/delete.user.js";

export const deleteUseradmin = async (req, res) => {
  try {
    
        if (!identifier) {
          throw new Error('Se requiere un identificador para eliminar el usuario');
        }
          if (!isNaN(identifier)) {
             user = await User.findOne({ ID: Number(identifier) });
           }
       
        const user = await User.findOne({
          $or:  [
            { email: identifier },
            { username: identifier }
          ]
        });
    
        if (!user) {
          throw new Error('Usuario no encontrado');
        }


   
    if (!req.user.role=='admin') {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta acción'
      });
    }


    const result = await deleteUser(id);
    
    res.json({
      success: true,
      message: result.message,
      data: result.deletedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};