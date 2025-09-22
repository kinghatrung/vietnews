import { Comment } from '../models/Comment.js';
import { Status } from '../models/Status.js';
import { News } from '../models/News.js';

const commentServices = {
  // GET ALL COMMENT BY STATUS
  getPendingComments: async () => {
    try {
      const pendingStatus = await Status.findOne({
        status_name: 'Chờ duyệt',
      });

      if (!pendingStatus) {
        throw new Error("Trạng thái 'Chờ duyệt' không tồn tại");
      }

      const comments = await Comment.find({
        status: pendingStatus._id,
      }).populate(
        'user news',
        'full_name email createdAt address phone avatar title image describe isActive'
      );
      return comments;
    } catch (err) {
      throw err;
    }
  },

  // DELETE COMMENT
  deleteCommentPending: async (commentId) => {
    try {
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        throw new Error('Không tìm thấy comment');
      }

      // Update the commentCount in the associated News
      await News.findByIdAndUpdate(comment.news, {
        $inc: { commentCount: -1 },
      });

      return comment;
    } catch (err) {
      throw err;
    }
  },

  // CREATE COMMENT
  createComment: async ({ content, newsId, userId }) => {
    try {
      const pendingStatus = await Status.findOne({ status_name: 'Chờ duyệt' });

      const comment = await Comment.create({
        content,
        user: userId,
        news: newsId,
        status: pendingStatus._id,
      });

      return comment;
    } catch (err) {
      throw err;
    }
  },

  // APPROVE COMMENT
  approveComment: async (commentId) => {
    try {
      const approvedStatus = await Status.findOne({ status_name: 'Đã duyệt' });

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { status: approvedStatus._id },
        { new: true }
      );

      if (!comment) {
        throw new Error('Không tìm thấy bình luận');
      }

      await News.findByIdAndUpdate(comment.news, {
        $push: { comment: comment._id },
        $inc: { commentCount: 1 },
      });

      return comment;
    } catch (err) {
      throw err;
    }
  },

  // GET COMMENT BY NEWS
  getCommentByNews: async (newsId) => {
    try {
      const approvedStatus = await Status.findOne({ status_name: 'Đã duyệt' });

      if (!approvedStatus) {
        throw new Error("Không tìm thấy trạng thái 'Đã duyệt'");
      }

      const comments = await Comment.find({
        news: newsId,
        status: approvedStatus._id,
      })
        .populate('user', 'full_name avatar')
        .sort({ createdAt: -1 });

      return comments;
    } catch (err) {
      throw err;
    }
  },
};

export default commentServices;
