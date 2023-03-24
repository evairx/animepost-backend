import express from 'express';
import cors from 'cors';
import slugify from 'slugify';

import AnimeRoutes from './routes/anime.routes.js'
import UserRoutes from './routes/user.routes.js';
import AnimeModel from './models/Anime.js';
import CarrouselRoutes from './routes/carrousel.routes.js';

import './db/dbConnect.js';
import './libs/initialSetup.js';


const PORT = 4000;

const app = express();

app.use(express.json());

app.use(cors({
  credentials: true
}));

app.use('/', UserRoutes)
app.use('/v1', AnimeRoutes);
app.use('/carrousel', CarrouselRoutes)


app.get('/popular', async (req, res) => {
  try {
    // Buscar los documentos de anime ordenados por el número de vistas
    const popularAnimes = await AnimeModel.find().sort({ views: 'desc' });

    // Enviar los documentos de anime como respuesta JSON
    res.json(popularAnimes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
});

app.post('/animes/:id/episodes', async (req, res) => {
    try {
      const { id } = req.params;
      const newEpisode = req.body;
  
      // Recuperar el documento completo
      const anime = await AnimeModel.findOne({ _id: id });
  
      // Determinar cuál es el último número de episodio en el arreglo "episodes"
      const lastEpisodeNum = anime.episodes.length;
  
      // Asignar el número de episodio al nuevo episodio que se está agregando
      newEpisode.episodesNum = lastEpisodeNum + 1;
  
      // Asignar el slug al nuevo episodio que se está agregando
      newEpisode.slug = slugify(newEpisode.title, {remove: /[%\<>#'!?:]/gi, lower: true });
  
      // Agregar el nuevo episodio al arreglo "episodes"
      anime.episodes.push(newEpisode);
  
      // Guardar el documento actualizado en la base de datos
      await anime.save();
  
      res.json(anime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.listen(PORT, function() {
    console.log(`Open: http://localhost:${PORT}`)
})