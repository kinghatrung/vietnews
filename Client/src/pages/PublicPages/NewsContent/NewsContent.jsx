import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Button, Divider, Input, Form, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "~/redux/loadingSlice";
import { ArrowLeftOutlined, LikeFilled, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import {
  getNewsByIdAPI,
  getNewsAPI,
  getCategoryAPI,
  likeOrUnlikeNewsAPI,
  saveNewsAPI,
  getSaveNewsAPI,
  createComment,
  getAllCommentByNews,
} from "~/api";
import config from "~/config/";
import CategoryList from "~/components/CategoryList";
import News from "~/components/News";
import Comment from "~/components/Comment";
import { showLoginModal } from "~/redux/modalSlice";

dayjs.locale("vi");

const NewsContent = React.memo(function NewsContent() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState("");
  const [news, setNews] = useState([]);
  const [newsById, setNewsById] = useState({});
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);

  const isLoggedIn = useSelector((state) => state.modal.loginModalVisible);
  const user = useSelector((state) => {
    return state.auth.login.currentUser;
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        dispatch(startLoading());
        const [newsRes, categoryRes, newsByIdRes, commentsRes, savedNewsRes] =
          await Promise.all([
            getNewsAPI(),
            getCategoryAPI(),
            getNewsByIdAPI(id),
            getAllCommentByNews(id),
            user?._id
              ? getSaveNewsAPI(user._id)
              : Promise.resolve({ data: [] }),
          ]);
        setNews(newsRes.data);
        setCategories(categoryRes.data);
        setNewsById(newsByIdRes.data);
        setComments(commentsRes.data);
        if (user?._id) {
          const isSaved = savedNewsRes.data.some((item) => item._id === id);
          setIsSaved(isSaved);
        }
        dispatch(stopLoading());
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        dispatch(stopLoading());
      }
    };
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?._id]);

  const mostLikedNews = useMemo(() => {
    return [...news].sort((a, b) => b.like - a.like).slice(0, 2);
  }, [news]);

  const mostViewedNews = useMemo(() => {
    return [...news].sort((a, b) => b.views - a.views).slice(0, 5);
  }, [news]);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) => category.category_name === newsById.category?.category_name
    );
  }, [categories, newsById.category?.category_name]);

  const handleLikeOrUnlikeNews = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        dispatch(showLoginModal());
        return;
      }
      try {
        const res = await likeOrUnlikeNewsAPI(id);
        setNewsById((prev) => {
          const userHasLiked = prev.likedUsers.includes(user._id);

          let updatedLikedUsers;

          if (userHasLiked) {
            updatedLikedUsers = prev.likedUsers.filter(
              (uid) => uid !== user._id
            );
          } else {
            updatedLikedUsers = [...prev.likedUsers, user._id];
          }

          return {
            ...prev,
            like: res.data.totalLikes,
            likedUsers: updatedLikedUsers,
          };
        });
      } catch (err) {
        console.error("Error during search:", err);
      }
    },
    [dispatch, isLoggedIn, user]
  );

  const handleSaveOrUnsaveNews = useCallback(
    async (userId, newsId) => {
      if (!isLoggedIn) {
        dispatch(showLoginModal());
        return;
      }
      try {
        const res = await saveNewsAPI(userId, newsId);
        const { action } = res.data;
        setIsSaved(action === "saved");
      } catch (err) {
        console.error("Không thể cập nhật trạng thái", err);
      }
    },
    [dispatch, isLoggedIn]
  );

  const handleSendComment = useCallback(
    async (values) => {
      if (!isLoggedIn) {
        dispatch(showLoginModal());
        return;
      }
      try {
        dispatch(startLoading());
        const dataComment = {
          content: values.comment,
          userId: user?._id,
          newsId: id,
        };
        await createComment(dataComment);
        form.resetFields();
        message.success("Gửi bình luận xét duyệt thành công!");
        dispatch(stopLoading());
      } catch (err) {
        console.log(err);
        dispatch(stopLoading());
      }
    },
    [dispatch, isLoggedIn, user, id]
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-[50px]">
      <div className="col-span-8">
        <div className="flex justify-between mb-3">
          <Link
            to={`/genre/${newsById.category?._id}`}
            className="active-color"
          >
            {newsById.category?.category_name}
          </Link>
          <p className="text-[#757575]">
            {dayjs(newsById.createdAt).add(1, "day").format("dddd, DD/MM/YYYY")}
          </p>
        </div>
        <div className="mb-[20px]">
          <h1 className="text-[22px] md:text-[32px] font-title font-bold text-[#222]">
            {newsById.title}
          </h1>
          <br />
          <article>
            <p className="text-[18px] text-[#222]">{newsById.describe}</p>
            <br />
            <div dangerouslySetInnerHTML={{ __html: newsById.content }}></div>

            <p className="text-[18px] text-[#222] font-bold text-right mt-4 mb-[18px]">
              {newsById.reporter?.full_name}
            </p>
            <a
              href={newsById.source}
              className="text-[12px] t-[100px] text-[#222] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Nguồn tham khảo:</strong> {newsById.source}
            </a>
            <div className="border border-[#e5e5e5] p-[15px] mt-[20px]">
              {mostLikedNews.slice(0, 1).map((item) => (
                <News
                  key={item._id}
                  {...item}
                  heading={item.title}
                  small
                  title
                  noTime
                  sizeSmall
                />
              ))}
              <Divider className="!my-[13px]" />
              {mostLikedNews.slice(1, 2).map((item) => (
                <News
                  key={item._id}
                  {...item}
                  heading={item.title}
                  small
                  title
                  noTime
                  sizeSmall
                />
              ))}
            </div>
          </article>
        </div>
        <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-[20px] mb-[20px]">
          <div className="flex items-center gap-[10px]">
            <Link className="!text-[16px]" to={config.routes.home}>
              <Button className="!rounded-[3px] !py-[20px] !px-[20px] lg:!py-[12px] lg:!px-[20px] !text-[16px] !text-[#4f4f4f]">
                <ArrowLeftOutlined />
              </Button>
            </Link>
            <Button
              onClick={() => handleSaveOrUnsaveNews(user?._id, id)}
              className="!rounded-[3px] !py-[20px] !px-[20px] lg:!py-[12px] lg:!px-[20px] !text-[#4f4f4f]"
            >
              {isSaved ? "Bỏ lưu" : "Lưu"}
            </Button>
            <div className="flex gap-[10px] items-center ml-2">
              <EyeOutlined />
              {newsById.views} lượt xem
            </div>
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="flex gap-[10px] items-center">
              {newsById.like}
              <Button
                shape="circle"
                onClick={() => handleLikeOrUnlikeNews(newsById._id)}
                className="!w-[40px] !h-[40px] lg:!w-[32px] lg:!h-[32px] !flex !items-center !justify-center"
              >
                <LikeFilled
                  style={{
                    color: newsById?.likedUsers?.some((id) => id === user?._id)
                      ? "#c4302e"
                      : "#000",
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="my-[20px]">
          <h1 className="text-[20px] font-title font-bold text-[#222] mb-[16px]">
            Bình luận
          </h1>
          <Form form={form} layout="vertical" onFinish={handleSendComment}>
            <Form.Item
              layout="vertical"
              name="comment"
              rules={[{ required: true, message: "Bạn chưa nhập bình luận!" }]}
              className="!mb-[16px] !font-bold"
              placeholder="Chia sẻ ý kiến của bạn !"
            >
              <Input.TextArea
                className="!p-[14px] !rounded-none"
                type="text"
                placeholder="Hãy viết bình luận của bạn"
              />
            </Form.Item>

            <Form.Item className="!m-0">
              <Button
                type="primary"
                htmlType="submit"
                className="!rounded-[4px] !text-[15px] !bg-[#c4302e] !px-[32px] !py-[20px] !font-bold"
              >
                Gửi
              </Button>
            </Form.Item>
          </Form>
          <div className="flex flex-col gap-[18px] mt-[20px]">
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
        <div className="py-[20px]">
          {filteredCategories.map((category) => (
            <div key={category._id} className="flex flex-col">
              <CategoryList
                category={category.category_name}
                categoryId={category._id}
              />
              <div className="flex flex-col">
                {category.news
                  .filter((newsItem) => newsItem._id !== id)
                  .slice(0, 5)
                  .map((newsItem) => (
                    <News
                      {...newsItem}
                      key={newsItem._id}
                      heading={newsItem.title}
                      title
                      semiMedium
                      sizeSemiSmall
                      noTime
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative col-span-4 hidden lg:block">
        <article className="sticky top-[60px]">
          <h2 className="font-title text-[18px] mb-[10px]">Xem nhiều</h2>
          <div className="flex flex-col gap-[20px]">
            {mostViewedNews.map((itemNews) => (
              <div key={itemNews._id} className="flex flex-col">
                <News
                  {...itemNews}
                  heading={itemNews.title}
                  semiSmall
                  sizeDefault
                  noTime
                  title
                  noSubTitle
                />
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
});

export default NewsContent;
