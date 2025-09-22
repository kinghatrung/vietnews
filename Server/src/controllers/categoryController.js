import categoryServices from '../services/categoryServices.js';

const categoryController = {
  // ADD CATEGORY
  addCategory: async (req, res) => {
    try {
      const newCategory = await categoryServices.addCategory(req.body);

      res.status(200).json({ message: 'Tạo danh mục thành công', newCategory });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL CATEGORIES
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryServices.getAllCategories();

      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST ALL CATEGORIES
  postAllCategories: async (req, res) => {
    try {
      const { searchKey, startDate, endDate } = req.body;
      const categories = await categoryServices.postAllCategories(
        searchKey,
        startDate,
        endDate
      );

      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET CATEGORY BY ID
  getCategoryById: async (req, res) => {
    try {
      const category = await categoryServices.getCategoryById(req.params.id);

      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //  UPDATE CATEGORY
  updateCategory: async (req, res) => {
    try {
      const { category_name, description } = req.body;
      const id = req.params.id;

      const updateCategory = await categoryServices.updateCategory(
        id,
        category_name,
        description
      );

      res
        .status(200)
        .json({ message: 'Danh mục cập nhập thành công', updateCategory });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE CATEGORY
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;

      await categoryServices.deleteCategory(id);

      res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
export default categoryController;
