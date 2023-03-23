import express from 'express';
import AnimeController from '../controller/Anime.js';

const router = express.Router();

router.get('/', AnimeController.getAnimes);

router.post('/',AnimeController.addAnime);

router.get('/genre', AnimeController.getAnimeByGenre);

router.get('/:id', AnimeController.getAnimesById);

router.delete('/:id',AnimeController.deleteAnimeById);

router.put('/:id',AnimeController.patchAnimeById);

router.get('/:id/:episodeSlug', AnimeController.getAnimeEpisodes);

router.delete('/:titleslug/:slug',AnimeController.deleteEpisodeBySlug);


export default router;