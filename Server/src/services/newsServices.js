const { News } = require('../models/News');
const { Article } = require('../models/Article');
const { Category } = require('../models/Category');
const { Comment } = require('../models/Comment');

const newsServices = {
  // GET ALL NEWS
  getAllNews: async () => {
    try {
      const news = await News.find()
        .populate('reporter category')
        .populate({
          path: 'comment',
          populate: {
            path: 'user',
            select: 'full_name avatar',
          },
        });
      return news;
    } catch (err) {
      throw err;
    }
  },

  // POST ALL NEWS
  postAllNews: async (searchKey, startDate, endDate, categoryIds, authorId) => {
    try {
      let searchFilter = {};
      let dateFilter = {};
      let categoryFilter = {};
      let authorFilter = {};

      // Lọc theo từ khóa
      if (searchKey && searchKey.trim() !== '') {
        const regex = new RegExp(searchKey, 'i');

        searchFilter.$or = [
          { title: { $regex: regex, $options: 'i' } },
          { describe: { $regex: regex, $options: 'i' } },
        ];
      }

      // Lọc theo ngày tham đăng
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Lọc theo nhiều thể loại
      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        categoryFilter.category = { $in: categoryIds };
      }

      // Lọc theo tác giả
      if (authorId) {
        authorFilter.reporter = authorId;
      }

      const news = await News.find({
        ...searchFilter,
        ...dateFilter,
        ...categoryFilter,
        ...authorFilter,
      })
        .populate('reporter')
        .populate('category')
        .populate({
          path: 'comment',
          populate: {
            path: 'user',
            select: 'full_name email avatar',
          },
        });

      return news;
    } catch (err) {
      throw err;
    }
  },

  // GET NEW BY ID
  getNewsById: async (newsId, clientIp) => {
    try {
      const news = await News.findById(newsId).populate('reporter category');

      if (!news) {
        throw new Error('Không tìm thấy tin tức');
      }

      // Lọc bỏ các IP đã hết hạn (quá 1 giờ)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      news.viewedIPs = (news.viewedIPs || []).filter(
        (item) => item.viewedAt > oneHourAgo
      );

      // Kiểm tra IP hiện tại đã xem chưa
      const hasViewed = news.viewedIPs.some((item) => item.ip === clientIp);

      if (!hasViewed) {
        news.views += 1;
        news.viewedIPs.push({ ip: clientIp, viewedAt: new Date() });
        await news.save();
      }

      return news;
    } catch (err) {
      throw err;
    }
  },

  // LIKE AND UNLIKE NEWS
  likeOrUnlikeNews: async (newsId, userId) => {
    try {
      const news = await News.findById(newsId);
      if (!news) throw new Error('Không tìm thấy tin tức');

      const hasLiked = news.likedUsers.includes(userId);

      if (hasLiked) {
        news.likedUsers.pull(userId);
        news.like = news.likedUsers.length;
        await news.save();
        return { message: 'Unliked', liked: false, totalLikes: news.like };
      } else {
        news.likedUsers.push(userId);
        news.like = news.likedUsers.length;
        await news.save();
        return { message: 'Liked', liked: true, totalLikes: news.like };
      }
    } catch (err) {
      throw err;
    }
  },

  // SEARCH NEWS
  searchNews: async (q = '', time = '') => {
    try {
      const query = {};

      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { describe: { $regex: q, $options: 'i' } },
        ];
      }

      if (time) {
        const now = new Date();
        let timeLimit;

        switch (time) {
          case '1d':
            timeLimit = new Date(now.setDate(now.getDate() - 1));
            break;
          case '1w':
            timeLimit = new Date(now.setDate(now.getDate() - 7));
            break;
          case '1m':
            timeLimit = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case '1y':
            timeLimit = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            throw new Error('Không hợp lệ');
        }

        if (timeLimit) {
          query.createdAt = { $gte: timeLimit };
        }
      }

      const results = await News.find(query).populate('category');

      return results;
    } catch (err) {
      throw err;
    }
  },

  // GET NEWS BY ID FOR REPORTER
  postNewsForReporter: async (
    reporterId,
    searchKey,
    startDate,
    endDate,
    categoryIds
  ) => {
    try {
      let searchFilter = {};
      let dateFilter = {};
      let categoryFilter = {};

      // Lọc theo từ khóa
      if (searchKey && searchKey.trim() !== '') {
        const regex = new RegExp(searchKey, 'i');

        searchFilter.$or = [
          { title: { $regex: regex } },
          { describe: { $regex: regex } },
        ];
      }

      // Lọc theo ngày tham đăng
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Lọc theo nhiều thể loại
      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        categoryFilter.category = { $in: categoryIds };
      }

      const news = await News.find({
        reporter: reporterId,
        ...searchFilter,
        ...dateFilter,
        ...categoryFilter,
      })
        .populate('reporter')
        .populate('category')
        .populate({
          path: 'comment',
          populate: {
            path: 'user',
            select: 'full_name email avatar',
          },
        });

      return news;
    } catch (err) {
      throw err;
    }
  },

  // DELETE NEWS
  deleteNews: async (newsId) => {
    try {
      const news = await News.findById(newsId);
      if (!news) {
        throw new Error('Không tìm thấy tin tức');
      }

      if (news.article) {
        const article = await Article.findById(news.article);
        if (article && article.category) {
          await Category.findByIdAndUpdate(article.category, {
            $pull: { articles: article._id },
          });
        }
        await Article.findByIdAndDelete(news.article);
      }

      if (news.comment && news.comment.length > 0) {
        await Comment.deleteMany({ _id: { $in: news.comment } });
      }
      if (news.category) {
        await Category.findByIdAndUpdate(news.category, {
          $pull: { news: news._id },
        });
      }

      await News.findByIdAndDelete(newsId);

      return { message: 'Xóa tin tức thành công' };
    } catch (err) {
      throw err;
    }
  },
};
module.exports = newsServices;
