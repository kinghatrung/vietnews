import commentServices from '../services/commentServices.js';

const commentController = {
  // GET ALL COMMENT BY STATUS
  getPendingComments: async (req, res) => {
    try {
      const comments = await commentServices.getPendingComments();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy bình luận chưa duyệt' });
    }
  },

  // DELETE COMMENT
  deleteCommentPending: async (req, res) => {
    try {
      await commentServices.deleteCommentPending(req.params.id);

      res.status(200).json({ message: 'Xóa comment thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi' });
    }
  },

  createComment: async (req, res) => {
    try {
      const { content, newsId, userId } = req.body;

      const comment = await commentServices.createComment({
        content,
        newsId,
        userId,
      });

      res.status(200).json({ message: 'Bình luận đang chờ duyệt', comment });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi gửi bình luận' });
    }
  },

  // APPROVE COMMENT
  approveComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = commentServices.approveComment(commentId);

      res.json({ message: 'Bình luận đã được duyệt', comment });
    } catch (err) {
      res.status(500).json({ error: 'Lỗi duyệt bình luận' });
    }
  },

  // GET COMMENT BY NEWS
  getCommentByNews: async (req, res) => {
    try {
      const newsId = req.params.newsId;
      const comments = await commentServices.getCommentByNews(newsId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi lấy danh sách bình luận' });
    }
  },
};

export default commentController;
