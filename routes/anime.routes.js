const express = require('express');
const AnimeController = require('../controller/Anime');
const router = express.Router();

router.get('/', AnimeController.getAnimes);

router.post('/',AnimeController.addAnime);

router.get('/:titleslug',AnimeController.getAnimesById);

router.delete('/:id',AnimeController.deleteAnimeById);

router.put('/:id',AnimeController.patchAnimeById);

router.get('/:animeSlug/:episodeSlug', AnimeController.getAnimeEpisodes);

router.delete('/:titleslug/:slug',AnimeController.deleteEpisodeBySlug);


module.exports = router;