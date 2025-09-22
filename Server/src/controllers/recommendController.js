import recommendServices from '../services/recommendServices.js';

const recommendController = {
  // GET ALL RECOMMEND
  getAllRecommend: async (req, res) => {
    try {
      const recommend = await recommendServices.getAllRecommend();

      res.status(200).json(recommend);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   ADD RECOMMEND
  addRecommend: async (req, res) => {
    try {
      const { name, description, editor } = req.body;
      const recommend = await recommendServices.addRecommend(
        name,
        description,
        editor
      );

      res.status(200).json({ recommend });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   ADD RECOMMEND TO CATEGORY
  addRecommendToCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const newCategory = await recommendServices.addRecommendToCategory(id);

      return res.status(200).json({
        message: 'Duyệt đề xuất và thêm danh mục thành công',
        newCategory,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   DELETE RECOMMEND
  deleteRecommend: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await recommendServices.deleteRecommend(id);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default recommendController;
