import { Schema, model } from 'mongoose';
import slugify from 'slugify';

function generateRandomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'G';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const AnimeSchema = new Schema({
	_id: {
		type: String,
		default: generateRandomId,
	},
    title: {
        type: String,
        required: true,
    },
    titleslug: {
        type: String
    },
    japaneseTitle: {
        type: String,
        required: false
    },
    poster: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    studio: [
        {
            type: String,
            required: false
        }
    ],
    language: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    genres: [
        {
            type: String,
            required: false,
        }
    ],
    synopsis: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    timer: {
        type: String,
        required: false
    },
    fileId: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    episodes: [
        {
            poster: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            synopsis: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            episodesNum: {
                type: Number
            },
            slug:{
                type: String
            },
            duration: {
                type: String,
                required: true
            }
        }
    ] 
}, { timestamps: true });
  
AnimeSchema.pre("save", function(next) {
    const isModified = this.isModified("title");
    if (isModified) {
        this.titleslug = slugify(this.title, {remove: /[%\<>#',.!?:]/gi, lower: true });
    };
    next();
});

AnimeSchema.pre("save", function(next) {
    this.episodes.forEach((episode) => {
      episode.slug = slugify(episode.title, {remove: /[%\<>#',.!?:]/gi, lower: true });
    });

    next();
  });
  
  AnimeSchema.pre('save', function(next) {
    let episodesNum = 1;
  
    this.episodes.forEach(episode => {
      if (!episode.episodesNum) {
        episode.episodesNum = episodesNum;
        episodesNum++;
      }
    });
  
    next();
  });

  AnimeSchema.pre('findByIdAndUpdate', function(next) {
    let episodesNum = 1;
  
    this.episodes.forEach(episode => {
      if (!episode.episodesNum) {
        episode.episodesNum = episodesNum;
        episodesNum++;
      }
    });
  
    next();
  });

export default model('Anime', AnimeSchema);
