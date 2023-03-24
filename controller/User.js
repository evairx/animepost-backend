import UserModel from '../models/User.js';
import AnimeModel from '../models/Anime.js'
import Role from "../models/Role.js";
import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken'
import config from '../config.js'

const addUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);

        let roles = req.body.roles || ["user"]; // Si no se proporciona un array de roles, se establece el rol predeterminado de "user"
        const foundRoles = await Role.find({ name: { $in: roles } });

        user.roles = foundRoles.map((role) => role.name);

        const encryptedPassword = await user.encryptPassword(req.body.password);
        user.password = encryptedPassword;

        await user.save();

        res.status(200).json({ message: "El usuario se creó correctamente"});
    } catch (error) {
        res.status(500).json(error);
    }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;

  // Demorar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Buscar al usuario por email
  const user = await UserModel.findOne({ username });

  // Si el usuario no existe
  if (!user) {
    return res.status(400).json({ message: "Credenciales inválidas" });
  }

  // Validar la contraseña
  const isValidPassword = await bycript.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Credenciales inválidas" });
  }

  // Generar el token
  const token = jwt.sign({ id: user._id, username: user.username, role: user.roles[0] }, config.secretkey, { expiresIn: '1h' });

  // Devolver el token y otros datos del usuario en la respuesta
  return res.status(200).json({ token });
}

const Account = async (req, res, next) => {
  try {
    // Obtener el token de autenticación del encabezado
    const token = req.headers.authorization.split(" ")[1];

    // Verificar el token de autenticación
    const decodedToken = jwt.verify(token, config.secretkey);
    const userId = decodedToken.id;

    // Buscar al usuario por ID
    const user = await UserModel.findById(userId);

    // Si el usuario no existe
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Si el usuario existe, devolver la información básica del usuario en la respuesta
    const { _id, username, email, roles, yearsOld, favorites, createdAt } = user;

    res.json({ _id, username, email, roles, yearsOld,favorites, createdAt});
  } catch (error) {
    res.status(401).json({ error: "access-token-invalid", description: "auth.missing" });
  }
  
  next();
};


const favorites = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    // Obtener el token
    const token = authHeader.split(' ')[1];
    
    // Decodificar el token para obtener la información que contiene
    const decodedToken = jwt.verify(token, config.secretkey);
    const userId = decodedToken.id;
    
    const { animeId } = req.params;
    
    // Buscar si el anime existe
    const anime = await AnimeModel.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    
    // Buscar si el usuario existe
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Agregar el anime a los favoritos del usuario
    user.favorites.push({ id: animeId });
    await user.save();
    
    res.status(200).json({ message: 'Anime added to favorites' });
  } catch (error) {
    res.status(401).json({ error: "access-token-invalid", description: "auth.missing" });
  }
};

async function favoritesPage(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secretkey);
    const userId = decodedToken.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const animeIds = user.favorites.map((favorite) => favorite.id);
    const animeList = [];
    for (const animeId of animeIds) {
      const anime = await AnimeModel.findById(animeId);
      if (anime) {
        animeList.push({
          titleSlug: anime.titleslug,
          title: anime.title,
          poster: anime.poster
        });
      }
    }
    return res.json(animeList);
  } catch (error) {
    res.status(401).json({ error: "access-token-invalid", description: "auth.missing" });
  }
}

const UserExport = {
    addUser,
    signIn,
    Account,
    favorites,
    favoritesPage,
}

export default UserExport;