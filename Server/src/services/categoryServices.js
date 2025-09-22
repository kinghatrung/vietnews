import { Category } from '../models/Category.js';
import { Article } from '../models/Article.js';
import { News } from '../models/News.js';

const categoryServices = {
  // ADD CATEGORY
  addCategory: async ({ category_name, description }) => {
    try {
      const newCategory = new Category({
        category_name: category_name,
        description: description,
      });
      await newCategory.save();

      return 'Thêm danh mục thành công';
    } catch (err) {
      throw err;
    }
  },

  // GET ALL CATEGORIES
  getAllCategories: async () => {
    try {
      const categories = await Category.find().populate('news');

      return categories;
    } catch (err) {
      throw err;
    }
  },

  // POST ALL CATEGORIES
  postAllCategories: async (searchKey, startDate, endDate) => {
    try {
      let searchFilter = {};
      let dateFilter = {};

      // Lọc theo từ khóa
      if (searchKey && searchKey.trim() !== '') {
        const regex = new RegExp(searchKey, 'i');

        searchFilter.$or = [
          { category_name: { $regex: regex } },
          { description: { $regex: regex } },
        ];
      }

      // Lọc theo ngày tham đăng
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const categories = await Category.find({
        ...searchFilter,
        ...dateFilter,
      });

      return categories;
    } catch (err) {
      throw err;
    }
  },

  // GET CATEGORY BY ID
  getCategoryById: async (id) => {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }

      return category;
    } catch (err) {
      throw err;
    }
  },

  //  UPDATE CATEGORY
  updateCategory: async (id, category_name, description) => {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        {
          category_name: category_name,
          description: description,
        },
        { new: true }
      );
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }

      await Article.updateMany(
        { category: id },
        { $set: { category_name: category_name } }
      );

      await News.updateMany(
        { category: id },
        { $set: { category_name: category_name } }
      );

      return category;
    } catch (err) {
      throw err;
    }
  },

  // DELETE CATEGORY
  deleteCategory: async (id) => {
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }
      await Article.updateMany({ category: id }, { $pull: { category: id } });

      await News.updateMany({ category: id }, { $pull: { category: id } });

      return { message: 'Xóa danh mục thành công' };
    } catch (err) {
      throw err;
    }
  },
};

export default categoryServices;
