import { htmlToText } from 'html-to-text';
import axios from 'axios';
import he from 'he';

import { Article } from '../models/Article.js';
import { Status } from '../models/Status.js';
import { News } from '../models/News.js';
import { Category } from '../models/Category.js';

const articleServices = {
  // GET ALL ARTICLES
  getAllArticles: async () => {
    try {
      const articles = await Article.find().populate(
        'reporter status',
        'email full_name role status_name'
      );
      return articles;
    } catch (err) {
      throw err;
    }
  },

  // GET ARTICLE BY ID
  getArticleById: async (id) => {
    try {
      const article = await Article.findById(id);
      return article;
    } catch (err) {
      throw err;
    }
  },

  // GET ARTICLE BY ROLE
  getArticleByRole: async (
    role,
    userId,
    searchKey,
    startDate,
    endDate,
    status,
    authorId
  ) => {
    try {
      let query = {};

      if (role === 'reporter') {
        query = { reporter: userId };
      } else if (role === 'editor') {
        const codes = ['Chờ chỉnh sửa', 'Đang chỉnh sửa', 'Chờ phê duyệt'];
        const statuses = await Status.find({ status_name: { $in: codes } });
        query = {
          editor: userId,
          status: { $in: statuses.map((s) => s._id) },
        };
      } else if (role === 'admin') {
        const codes = ['Chờ phê duyệt', 'Đang phê duyệt', 'Đã đăng tải'];
        const statuses = await Status.find({ status_name: { $in: codes } });
        query = { status: { $in: statuses.map((s) => s._id) } };
      }

      // Lọc theo từ khóa (tiêu đề hoặc nội dung)
      if (searchKey && searchKey.trim() !== '') {
        query.$or = [
          { title: { $regex: searchKey, $options: 'i' } },
          { describe: { $regex: searchKey, $options: 'i' } },
        ];
      }

      // Lọc theo ngày đăng
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Lọc theo trạng thái nếu có và khác "Tất cả"
      if (status && status.trim() !== '' && status !== 'Tất cả') {
        const statusObj = await Status.findOne({
          status_name: status.trim(),
        });
        if (statusObj) {
          // Nếu đã có điều kiện status sẵn do role thì cần kiểm tra
          if (Array.isArray(query.status?.$in)) {
            query.status = {
              $in: query.status.$in.filter(
                (id) => id.toString() === statusObj._id.toString()
              ),
            };
          } else {
            query.status = statusObj._id;
          }
        } else {
          return [];
        }
      }

      // Lọc theo tác giả
      if (authorId) {
        query.reporter = authorId;
      }

      const articles = await Article.find(query)
        .populate('status')
        .populate('category', 'category_name')
        .populate('reporter', 'email full_name')
        .populate('editor', 'email full_name')
        .populate('admin', 'email full_name');

      return articles;
    } catch (err) {
      throw err;
    }
  },

  // ADD ARTICLE
  addArticle: async (data) => {
    try {
      const {
        title,
        content,
        note,
        category,
        reporter,
        describe,
        editor,
        image,
        source,
      } = data;
      const status = await Status.findOne({ status_name: 'Đang chờ' });
      const newArticle = new Article({
        title: title,
        describe: describe,
        content: content,
        note: note,
        image: image,
        editor: editor,
        status: status,
        category: category,
        reporter: reporter,
        source: source,
      });

      await newArticle.save();

      await Category.findByIdAndUpdate(category, {
        $push: { articles: newArticle._id },
      });

      return newArticle;
    } catch (err) {
      throw err;
    }
  },

  // DELETE ARTICLE
  deleteArticle: async (articleId) => {
    try {
      const article = await Article.findById(articleId).populate('status');
      if (!article) {
        throw new Error('Không tìm thấy bài viết nào để xóa');
      }

      if (article.status.status_name === 'Đã đăng tải') {
        const news = await News.findOneAndDelete({ article: article._id });
        if (news) {
          await Category.findByIdAndUpdate(article.category, {
            $pull: { news: news._id },
          });
        }
      }

      await Category.findByIdAndUpdate(article.category, {
        $pull: { articles: article._id },
      });

      await Article.findByIdAndDelete(articleId);

      return 'Xóa bài viết thành công';
    } catch (err) {
      throw err;
    }
  },

  // CHANGE STATUS ARTICLE
  changeStatusArticle: async (articleId, statusName) => {
    try {
      const status = await Status.findOne({ status_name: statusName });
      if (!status) throw new Error('Trạng thái không tồn tại.');
      const article = await Article.findByIdAndUpdate(
        articleId,
        { status: status._id },
        { new: true }
      ).populate('status');

      if (statusName === 'Đã đăng tải') {
        let news = await News.findOne({ article: article._id });

        if (!news) {
          news = new News({
            title: article.title,
            describe: article.describe,
            content: article.content,
            reporter: article.reporter,
            source: article.source,
            publishedAt: new Date(),
            article: article._id,
            category: article.category,
            image: article.image,
            like: 0,
            view: 0,
            commentCount: 0,
            comment: [],
          });
          await news.save();

          await Category.findByIdAndUpdate(article.category, {
            $addToSet: { news: news._id },
          });
        }
      }

      return article;
    } catch (err) {
      throw err;
    }
  },

  // UPDATE ARTICLE
  updateArticle: async (articleId, data) => {
    try {
      const {
        title,
        content,
        note,
        category,
        reporter,
        describe,
        editor,
        image,
        source,
      } = data;

      const oldArticle = await Article.findById(articleId);

      if (!oldArticle) {
        throw new Error('Không tìm thấy bài viết nào để cập nhật');
      }

      const oldCategoryId = oldArticle.category?.toString();
      const newCategoryId = category;

      const article = await Article.findByIdAndUpdate(
        articleId,
        {
          $set: {
            title,
            content,
            note,
            category,
            image,
            describe,
            reporter,
            editor,
            source,
          },
        },
        { new: true }
      );

      if (oldCategoryId !== newCategoryId) {
        if (oldCategoryId) {
          await Category.findByIdAndUpdate(oldCategoryId, {
            $pull: { articles: articleId },
          });
        }

        if (newCategoryId) {
          await Category.findByIdAndUpdate(newCategoryId, {
            $addToSet: { articles: articleId },
          });
        }
      }

      const news = await News.findOne({ article: articleId });
      if (news) {
        news.title = title;
        news.describe = describe;
        news.content = content;
        news.source = source;
        news.image = image;
        news.category = category;
        news.reporter = reporter;
        await news.save();
      }

      return article;
    } catch (err) {
      throw err;
    }
  },

  // CHECK CONTENT ARTICLE
  checkContentArticle: async (content) => {
    try {
      if (!content) {
        throw new Error('Thiếu nội dung bài viết');
      }

      // Convert HTML to plain text
      const plainText = htmlToText(content, {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true,
      });

      // Decode HTML entities (ví dụ &agrave; → à)
      const decodedText = he
        .decode(plainText)
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\[?https?:\/\/[^\]\s]+]?/gi, '')
        .trim();

      const response = await axios.post(`${process.env.AI_URL}/api/predict`, {
        text: decodedText,
      });

      // results
      const toxicSentences = response.data.results.filter(
        (item) => item.label === 1
      );

      return {
        toxicSentences,
        totalToxic: toxicSentences.length,
        isToxic: toxicSentences.length > 0,
      };
    } catch (err) {
      throw err;
    }
  },
};

export default articleServices;
