import authorizedAxiosInstance from "~/utils/authorizedAxios";
const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_API_URL;

// AUTH API
export const loginAPI = async (user) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/auth/login`, user);
};

export const handleRegisterAPI = async (user) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/auth/register`,
    user
  );
};

export const resetPasswordAPI = async ({ email, password, otp }) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/auth/forgot_pass`, {
    email,
    password,
    otp,
  });
};

export const sendOtpAPI = async (email) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/auth/send_otp/register`,
    { email }
  );
};

export const sendOtpForgotPasswordAPI = async (email) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/auth/send_otp/forgot_pass`,
    { email }
  );
};

export const loginWithGoogleAPI = async (tokenGoogle) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/auth/google`, {
    tokenGoogle,
  });
};

export const loginWithFacebookAPI = async (tokenFacebook) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/auth/facebook`, {
    tokenFacebook,
  });
};

export const handleLogoutAPI = async () => {
  return await authorizedAxiosInstance.delete(`${API_URL}/api/auth/logout`);
};

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_URL}/api/auth/refresh`, {
    refreshToken,
  });
};

// USER API
export const getAllUsers = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/users`);
};

export const getAllEditors = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/users/get/editors`);
};

export const getAllReporters = async () => {
  return await authorizedAxiosInstance.get(
    `${API_URL}/api/users/get/reporters`
  );
};

export const getSaveNewsAPI = async (id) => {
  return await authorizedAxiosInstance.get(
    `${API_URL}/api/users/${id}/saved-news`
  );
};

export const createComment = async (payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/comments/send`,
    payload
  );
};

export const deleteComment = async (id) => {
  return await authorizedAxiosInstance.delete(
    `${API_URL}/api/comments/del/${id}`
  );
};

export const approveComment = async (id) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/comments/approve/${id}`
  );
};

export const searchUsers = async (params) => {
  return await authorizedAxiosInstance.get(
    `${API_URL}/api/users/get/search-user`,
    {
      params,
    }
  );
};

export const updateRoleUser = async (id, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/users/role/${id}`,
    payload
  );
};

export const getAllCommentByNews = async (id) => {
  return await authorizedAxiosInstance.get(
    `${API_URL}/api/comments/news/${id}`
  );
};

export const getAllComment = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/comments/`);
};

export const banUserAPI = async (userId, payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/users/ban-user/${userId}`,
    payload
  );
};

export const unbanUserAPI = async (userId) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/users/unban/${userId}`
  );
};

export const saveNewsAPI = async (userId, newsId) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/users/${userId}/toggle_save/${newsId}`
  );
};

export const updateUserAPI = async (userId, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/users/put/nor/${userId}`,
    payload
  );
};

export const updatePasswordUserAPI = async (userId, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/users/put/pass/${userId}`,
    payload
  );
};

export const updateEmailUserAPI = async (userId, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/users/put/email/${userId}`,
    payload
  );
};

export const getAllUsersWithoutAuth = async (
  _id,
  roles = [],
  startDate = "",
  endDate = "",
  searchKey = "",
  status = ""
) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/users/without_auth`,
    {
      _id,
      roles,
      startDate,
      endDate,
      searchKey,
      status,
    }
  );
};

// DELETE USER
export const deleteUser = async (id) => {
  return await authorizedAxiosInstance.delete(`${API_URL}/api/users/del/${id}`);
};

// ARTICLE API
export const postArticleAPI = async (payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/article/post`,
    payload
  );
};

export const changeStatusArticleAPI = async (id, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/article/change_status/${id}`,
    payload
  );
};

export const deleteArticleAPI = async (id) => {
  return await authorizedAxiosInstance.delete(
    `${API_URL}/api/article/del/${id}`
  );
};

export const getArticleAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/article`);
};

export const putArticleAPI = async (id, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/article/put/${id}`,
    payload
  );
};

export const getArticleByIdAPI = async (
  role,
  userId,
  searchKey = "",
  startDate = "",
  endDate = "",
  status = "",
  authorId = ""
) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/article/get/by_role`,
    { role, userId, searchKey, startDate, endDate, status, authorId }
  );
};

// NEWS API
export const getNewsAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/news`);
};

export const postNewsAPI = async (
  searchKey = "",
  startDate = "",
  endDate = "",
  categoryIds = [],
  authorId = ""
) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/news/post`, {
    searchKey,
    startDate,
    endDate,
    categoryIds,
    authorId,
  });
};

export const postNewsForReporter = async (
  id,
  searchKey = "",
  startDate = "",
  endDate = "",
  categoryIds = []
) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/news/post/${id}`, {
    searchKey,
    startDate,
    endDate,
    categoryIds,
  });
};

export const deleteNewsAPI = async (id) => {
  return await authorizedAxiosInstance.delete(`${API_URL}/api/news/${id}`);
};

export const likeOrUnlikeNewsAPI = async (id) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/news/${id}/like`);
};

export const getNewsByIdAPI = async (id) => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/news/${id}`);
};

export const getSearchNewsAPI = async (params) => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/news/get/search`, {
    params,
  });
};

// CATEGORY API
export const deleteCategoryAPI = async (id) => {
  return await authorizedAxiosInstance.delete(`${API_URL}/api/category/${id}`);
};

export const getCategoryAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/category`);
};

export const postCategoriesAPI = async (
  searchKey = "",
  startDate = "",
  endDate = ""
) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/category/post`, {
    searchKey,
    startDate,
    endDate,
  });
};

export const getCategoryByIdAPI = async (id) => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/category/${id}`);
};

export const addCategoryAPI = async (payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/category/new`,
    payload
  );
};

export const updateCategoryAPI = async (id, payload) => {
  return await authorizedAxiosInstance.put(
    `${API_URL}/api/category/${id}`,
    payload
  );
};

// STATUS API
export const getAllStatusAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/status`);
};

// RECOMMEND API
export const getRecommendAPI = async () => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/recommend`);
};

export const addRecommendAPI = async (payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/recommend/post`,
    payload
  );
};

export const deleteRecommendAPI = async (id) => {
  return await authorizedAxiosInstance.delete(`${API_URL}/api/recommend/${id}`);
};

export const addRecommendToCategoryAPI = async (id) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/recommend/category/${id}`
  );
};

// NOTIFICATION
export const getNotificationAPI = async (id) => {
  return await authorizedAxiosInstance.get(`${API_URL}/api/notification/${id}`);
};

// UPLOAD IMAGE
export const imageUploadAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/upload/image_upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// CHATBOT GEMINI
export const chatBotGeminiAPI = async (payload) => {
  return await authorizedAxiosInstance.post(`${API_URL}/api/gemini/chat`, {
    question: payload,
  });
};

// CHECK CONTENT ARTICLE
export const checkContentArticleAPI = async (payload) => {
  return await authorizedAxiosInstance.post(
    `${API_URL}/api/article/check_content`,
    payload
  );
};
