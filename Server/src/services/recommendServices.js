const { Status } = require('../models/Status');
const { Recommend } = require('../models/Recommend');
const { Notification } = require('../models/Notification');
const { Category } = require('../models/Category');

const recommendServices = {
  // GET ALL RECOMMEND
  getAllRecommend: async () => {
    try {
      const recommend = await Recommend.find()
        .populate({
          path: 'editor',
          select: 'full_name',
        })
        .populate('status');

      return recommend;
    } catch (err) {
      throw err;
    }
  },

  //   ADD RECOMMEND
  addRecommend: async (name, description, editor) => {
    try {
      const status = await Status.findOne({ status_name: 'Chờ duyệt' });
      if (!status) {
        return res
          .status(400)
          .json({ message: "Trạng thái 'Chờ duyệt' chưa tồn tại" });
      }

      const newRecommend = new Recommend({
        name: name,
        description: description,
        editor: editor,
        status: status._id,
      });

      await newRecommend.save();

      return newRecommend;
    } catch (err) {
      throw err;
    }
  },

  //   ADD RECOMMEND TO CATEGORY
  addRecommendToCategory: async (recommendId) => {
    try {
      const recommend = await Recommend.findById(recommendId);
      if (!recommend) {
        return res.status(404).json({ message: 'Không tìm thấy đề xuất' });
      }

      const waitingStatus = await Status.findOne({
        status_name: 'Chờ duyệt',
      });

      if (!waitingStatus) {
        throw new Error("Trạng thái 'Chờ duyệt' chưa tồn tại");
      }
      if (!recommend.status.equals(waitingStatus._id)) {
        throw new Error('Đề xuất không ở trạng thái chờ duyệt');
      }

      const newCategory = new Category({
        category_name: recommend.name,
        description: recommend.description,
      });

      await newCategory.save();
      await recommend.deleteOne();

      await Notification.create({
        recipient: recommend.editor,
        message: `Đề xuất danh mục "${recommend.name}" của bạn đã được duyệt.`,
      });

      return newCategory;
    } catch (err) {
      throw err;
    }
  },

  //   DELETE RECOMMEND
  deleteRecommend: async (recommendId) => {
    try {
      const recommend = await Recommend.findById(recommendId);

      if (!recommend) {
        return res.status(404).json({ message: 'Recommend not found' });
      }

      await Notification.create({
        recipient: recommend.editor,
        message: `Đề xuất danh mục "${recommend.name}" của bạn đã bị từ chối.`,
      });

      await Recommend.findByIdAndDelete(recommendId);

      return { message: 'Recommend đã được xóa' };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = recommendServices;
