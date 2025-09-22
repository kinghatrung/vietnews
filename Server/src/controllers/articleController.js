import articleService from '../services/articleServices.js';

const articleController = {
  // GET ALL ARTICLES
  getAllArticles: async (req, res) => {
    try {
      const articles = await articleService.getAllArticles();
      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ARTICLE BY ID
  getArticleById: async (req, res) => {
    try {
      const article = await articleService.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json('Không tìm thấy bài viết nào');
      }
      res.status(200).json(article);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ARTICLE BY ROLE
  getArticleByRole: async (req, res) => {
    try {
      const { role, userId, searchKey, startDate, endDate, status, authorId } =
        req.body;
      const articles = await articleService.getArticleByRole(
        role,
        userId,
        searchKey,
        startDate,
        endDate,
        status,
        authorId
      );

      res.status(200).json(articles);
    } catch (err) {
      res.status(500).json({ err: 'Lỗi server' });
    }
  },

  //   ADD ARTICLE
  addArticle: async (req, res) => {
    try {
      const newArticle = await articleService.addArticle(req.body);
      res.status(200).json({ message: 'Thêm bài viết thành công', newArticle });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   DELETE ARTICLE
  deleteArticle: async (req, res) => {
    try {
      await articleService.deleteArticle(req.params.id);

      res.status(200).json('Xóa bài viết thành công');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // CHANGE STATUS ARTICLE
  changeStatusArticle: async (req, res) => {
    try {
      const { status_name } = req.body;
      const article = await articleService.changeStatusArticle(
        req.params.id,
        status_name
      );
      res.status(200).json({ article });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // UPDATE ARTICLE
  updateArticle: async (req, res) => {
    try {
      const updatedArticle = await articleService.updateArticle(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedArticle);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // CHECK CONTENT ARTICLE
  checkContentArticle: async (req, res) => {
    try {
      const { content } = req.body;
      const result = await articleService.checkContentArticle(content);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

export default articleController;
