const {Schema, model} = require('mongoose');
const slugify = require('slugify');

const AnimeSchema = new Schema({

    japaneseTitle: {
        type: String,
        required: true,
    },
    titleslug: {
        type: String
    },
    englishTitle: {
        type: String,
        required: false
    },
    posterImage: {
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
    category: {
        type: String,
        required: true,
    },
    tags: [
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
    const isModified = this.isModified("japaneseTitle");
    if (isModified) {
        this.titleslug = slugify(this.japaneseTitle, {remove: /[%\<>#',.!?:]/gi, lower: true });
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

module.exports = model('Anime', AnimeSchema);
