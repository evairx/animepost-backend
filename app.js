const express = require('express');
const AnimeRoutes = require('./routes/anime.routes');
const AnimeModel = require("./models/Anime")
const CarrouselRoutes = require('./routes/carrousel.routes');
const cors = require('cors');
const slugify = require('slugify');

require('./db/dbConnect');

const PORT = 4000;

const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.redirect('https://animepost.net/');
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

app.use('/v1', AnimeRoutes);
app.use('/carrousel', CarrouselRoutes)

app.listen(PORT, function() {
    console.log(`Open: http://localhost:${PORT}`)
})