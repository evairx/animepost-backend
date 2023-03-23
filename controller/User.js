import UserModel from '../models/User.js';
import Role from "../models/Role.js";
import bycript from 'bcryptjs';

const addUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);

        let roles = req.body.roles || ["user"]; // Si no se proporciona un array de roles, se establece el rol predeterminado de "user"
        const foundRoles = await Role.find({ name: { $in: roles } });

        user.roles = foundRoles.map((role) => role._id);

        const encryptedPassword = await user.encryptPassword(req.body.password);
        user.password = encryptedPassword;

        await user.save();

        res.status(200).json("El usuario se creó correctamente");
    } catch (error) {
        res.status(500).json(error);
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const user = await UserModel.findOne({ email });
  
    // Si el usuario no existe
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
  
    // Validar la contraseña
    const isValidPassword = await bycript.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
  
    // Si las credenciales son válidas, establecer la sesión del usuario
    req.session.user = user;
  
    // Redirigir al usuario a la ruta "/account"
    return res.status(200).json(req.session.user);
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} de ${monthNames[monthIndex]} ${year}`;
};

const Account = async (req, res) => {
  // Verificar si el usuario está autenticado
  if (!req.session.user) {
    return res.status(401).json({ code: "content.error.invalid_auth", context: [] });
  }

  // Si el usuario está autenticado, devolver la información básica del usuario en la respuesta
  const user = req.session.user;
  const {username, email, roles, yearsOld, createdAt } = user;

  // Formatear la fecha de creación en el formato "dd de MMM de yyyy"
  const formattedCreatedAt = formatDate(createdAt);

  res.json({username, email ,roles, yearsOld, member: formattedCreatedAt });
};

const Queque = async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ code: "content.error.invalid_auth", context: [] });
  }


  res.json({message: "tu lista de animes :3" });
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada exitosamente" });
  });
};

const UserExport = {
    addUser,
    signIn,
    Account,
    logout,
    Queque,
}

export default UserExport;