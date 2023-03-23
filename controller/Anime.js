import AnimeModel from '../models/Anime.js';

const getAnimes = (req, res) =>{
    AnimeModel.find()
     .then((data) => res.status(200).json(data))
     .catch(() => res.status(400).json({ message: "Bad Request"}));
};

const addAnime = async (req, res) => {
  try {
      const { body } = req;
      const anime = await AnimeModel.create(body);
      if (!anime) {
          throw new Error("El anime no pudo ser creado!");
      };
      res.status(200).json("El anime ha sido creado exitosamente!");
  } catch (error) {
      res.status(500).json(error);
  };
};

const getAnimesById = (req, res) => {
  AnimeModel.findOne({ _id: req.params.id })
    .then((anime) => {
        anime.views += 1;
        anime.save();
        res.status(200).json(anime);
    })
    .catch(() => res.status(400).json({ message: "Bad Request"}));
}


const deleteAnimeById = async (req,res) => {
  try {
    const {id} = req.params;
    
    const animeDelte= await AnimeModel.findByIdAndDelete(id);

    if(!animeDelte){
      throw new Error("El anime no pudo ser eliminado!");
    }
    res.status(200).json("El anime ha sido eliminado exitosamente!");
  } catch {
    res.status(500).json(error);
  };
};

const patchAnimeById = (req, res) => {
  const {id} = req.params;

  AnimeModel.findByIdAndUpdate(id, req.body)
  .then(() => res.status(200).json('editado crack uwu'))
  .catch(() => res.status(400).json({ message: "Bad Request"}));
}

const getAnimeEpisodes = async (req, res) => {
  try {
    const { params: { id, episodeSlug } } = req;

    const anime = await AnimeModel.findOne({ _id: id });
    if (!anime) {
        throw new Error("The anime wasn't found!");
    };

    const episode = anime.episodes.find(episode => episode.slug === episodeSlug);
    if (!episode) {
        throw new Error("The episode wasn't found!");
    };
    const currentEpIndex = anime.episodes.findIndex(ep => ep.slug === episodeSlug);
    const nextEpIndex = currentEpIndex + 1;
    
    let next;
    if (nextEpIndex < anime.episodes.length) {
      next = anime.episodes[nextEpIndex];
    } else {
      next = { title: "", slug: "" };
    }

    const currentEpIndexs = anime.episodes.findIndex(ep => ep.slug === episodeSlug);
    const prevEpIndex = currentEpIndexs - 1;
    
    let prev;
    if (prevEpIndex >= 0) {
      prev = anime.episodes[prevEpIndex];
    } else {
      prev = { title: "", slug: "" };
    }
    
   
    const episodes = anime.episodes.filter(episode => episode.slug !== episodeSlug);
    res.status(200).json({
        posterImage: anime.posterImage,
        englishTitle: anime.englishTitle,
        japaneseTitle: anime.japaneseTitle,
        titleslug: anime.titleslug,
        fileId: anime.fileId,
        episode: [episode],
        episodes,
        prev: [prev],
        next: [next],
    });
  } catch (error) {
      res.status(500).json({ error });
  };
}

const deleteEpisodeBySlug = async (req, res) => {
  try {
    const { titleslug, slug } = req.params;

    const anime = await AnimeModel.findOne({ titleslug });
    if (!anime) {
      throw new Error("El anime no existe!");
    }

    const episode = anime.episodes.find((ep) => ep.slug === slug);
    if (!episode) {
      throw new Error("El episodio no existe!");
    }

    anime.episodes.pull(episode);

    await anime.save();

    res.status(200).json("El episodio ha sido eliminado exitosamente!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnimeByGenre = async (req, res) => {
  const genre = req.query.genre; // obtiene el genero de la URL
  try {
    const animes = await AnimeModel.find({ genres: genre }); // busca todos los animes que contienen el genero
    res.json(animes); // devuelve los animes encontrados con ese genero
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
}

const AnimesExports = {
  getAnimes,
  addAnime,
  getAnimesById,
  deleteAnimeById,
  patchAnimeById,
  getAnimeEpisodes,
  deleteEpisodeBySlug,
  getAnimeByGenre
}

export default AnimesExports;