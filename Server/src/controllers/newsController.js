import newsServices from '../services/newsServices.js';

const newsController = {
  // GET ALL NEWS
  getAllNews: async (req, res) => {
    try {
      const news = await newsServices.getAllNews();

      res.status(200).json(news);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST ALL NEWS
  postAllNews: async (req, res) => {
    try {
      const { searchKey, startDate, endDate, categoryIds, authorId } = req.body;

      const news = await newsServices.postAllNews(
        searchKey,
        startDate,
        endDate,
        categoryIds,
        authorId
      );

      res.status(200).json(news);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET NEW BY ID
  getNewsById: async (req, res) => {
    try {
      const getClientIp = (req) => {
        return (
          req.headers['x-forwarded-for']?.split(',').shift() ||
          req.socket?.remoteAddress
        );
      };

      const clientIp = getClientIp(req);
      const newsId = req.params.id;

      const news = await newsServices.getNewsById(newsId, clientIp);

      res.status(200).json(news);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LIKE AND UNLIKE NEWS
  likeOrUnlikeNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const userId = req.jwtDecoded._id;
      const result = await newsServices.likeOrUnlikeNews(newsId, userId);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // SEARCH NEWS
  searchNews: async (req, res) => {
    try {
      const { q = '', time = '' } = req.query;
      const results = await newsServices.searchNews(q, time);

      res.status(200).json({ results });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET NEWS BY ID FOR REPORTER
  postNewsForReporter: async (req, res) => {
    try {
      const { searchKey, startDate, endDate, categoryIds } = req.body;
      const reporterId = req.params.id;

      const news = await newsServices.postNewsForReporter(
        reporterId,
        searchKey,
        startDate,
        endDate,
        categoryIds
      );

      res.status(200).json(news);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE NEWS
  deleteNews: async (req, res) => {
    try {
      const result = await newsServices.deleteNews(req.params.id);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default newsController;
