const { News } = require('../models/News');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { htmlToText } = require('html-to-text');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelAI = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const geminiController = {
  chatBotGemini: async (question) => {
    try {
      // Xử lý lời chào
      const greetingIntentPrompt = `
      Bạn là Chatbot AI thông minh của website đọc tin tức VietNews. Người dùng vừa nhập câu sau:
  
      "Câu: ${question}"
  
      Hãy kiểm tra xem người dùng có đang chào hỏi chatbot không.
  
      Nếu đúng là lời chào, hãy chỉ trả về đúng chuỗi "greeting".
  
      Nếu không phải lời chào, chỉ trả về chuỗi "not_greeting".
  
      KHÔNG giải thích gì thêm.
      `;

      const greetingCheck = await modelAI.generateContent(greetingIntentPrompt);
      const greetingType = greetingCheck.response.text().trim();

      if (greetingType === 'greeting') {
        return {
          reply:
            'Xin chào! Tôi là Chatbot VietNews – Tôi có thể giúp bạn tìm kiếm hoặc tóm tắt tin tức. Bạn muốn tìm kiếm tin tức và tóm tắt tin tức nào ?',
          relatedNews: [],
        };
      }

      // Xử lý về tin tức có lượt views và lượt like
      const classifyPrompt = `
      Bạn là một trợ lý AI thông minh của VietNews. Người dùng vừa hỏi:
  
      "${question}"
  
      Hãy phân loại ý định của người dùng thành 5 loại (chỉ trả về 1 trong 5 chuỗi sau đây):
      - "content" nếu người dùng hỏi nội dung cụ thể của tin tức.
      - "search" nếu người dùng đang muốn tìm một loại tin tức cụ thể.
      - "other" nếu không liên quan đến tin tức hoặc tìm kiếm.
      - "highest views" nếu người dùng muốn hỏi bài viết nào có lượt xem cao nhất, hót nhất.
      - "highest likes" nếu người dùng muốn hỏi bài viết nào có lượt like cao nhất.
  
      KHÔNG giải thích gì thêm. Chỉ trả về 1 trong 5 chuỗi:
      "content", "search", "other", "highest views", "highest likes"
      `;

      const classifyRes = await modelAI.generateContent(classifyPrompt);
      const userIntent = classifyRes.response.text().trim();

      // Lấy bài viết có lượt view cao nhất
      if (userIntent === 'highest views') {
        const topNews = await News.find({})
          .sort({ views: -1, like: -1 }) // Ưu tiên bài nhiều view, sau đó đến like
          .limit(1);

        if (!topNews.length) {
          return { message: 'Không có bài viết nào nổi bật.' };
        }

        const news = topNews[0];
        return {
          reply: `Đây là bài viết nổi bật nhất hiện tại:
          Tiêu đề: ${news.title}
          Mô tả: ${news.describe}
          Lượt xem: ${news.views}
          Lượt like: ${news.like}`,
          relatedNews: [
            {
              title: news.title,
              describe: news.describe,
              url: `${process.env.BASE_URL}/news/${news._id}`,
              routePath: `/news/${news._id}`,
            },
          ],
        };
      }

      // Lấy bài viết có lượt likes cao nhất
      if (userIntent === 'highest likes') {
        const topNews = await News.find({})
          .sort({ like: -1, views: -1 }) // Ưu tiên bài nhiều likes, sau đó đến views
          .limit(1);

        if (!topNews.length) {
          return { message: 'Không có bài viết nào nổi bật.' };
        }

        const news = topNews[0];
        return {
          reply: `Đây là bài viết nổi bật nhất hiện tại:\n\nTiêu đề: ${news.title}\n\nMô tả: ${news.describe}\n\nLượt xem: ${news.views}, Lượt like: ${news.like}`,
          relatedNews: [
            {
              title: news.title,
              describe: news.describe,
              url: `${process.env.BASE_URL}/news/${news._id}`,
              routePath: `/news/${news._id}`,
            },
          ],
        };
      }

      // Xử lý từ khóa để tìm kiếm hoặc đưa ra nội dung
      const extractKeywordPrompt = `
      Bạn là Chatbot AI thông minh của website đọc tin tức VietNews. Người dùng vừa nhập câu hỏi sau:

      "Câu: ${question}"

      Hãy trích xuất các từ khóa chính (dưới dạng mảng JSON) để tìm kiếm tin tức. 
      Chỉ trả về mảng từ khóa
      KHÔNG bao quanh mảng bằng markdown và các kiểu khác. Chỉ trả về mảng JSON đơn giản có dạng như sau:
      ["...", "..."]
      KHÔNG giải thích gì thêm.`;

      const keywordResult = await modelAI.generateContent(extractKeywordPrompt);
      const keywordText = keywordResult.response.text().trim();
      const cleanedText = keywordText
        .replace(/```json\s*/i, '')
        .replace(/```$/, '')
        .trim();

      let keywords;
      try {
        keywords = JSON.parse(cleanedText);
      } catch (err) {
        return {
          message: 'Không thể trích xuất từ khóa từ câu hỏi người dùng.',
        };
      }

      if (!Array.isArray(keywords) || keywords.length === 0) {
        return { message: 'Không có từ khóa nào được trích xuất.' };
      }

      // Tìm theo từ kháo trong db
      const keywordRegexArray = keywords.flatMap((kw) => [
        { title: { $regex: kw, $options: 'i' } },
      ]);

      const matchedNews = await News.find({ $or: keywordRegexArray });

      if (matchedNews.length === 0) {
        return { message: 'Không tìm thấy tin tức liên quan.' };
      }

      // Tổng hợp nội dung
      const combinedContent = matchedNews
        .map(
          (news) =>
            `Tiêu đề: ${news.title}
            Mô tả: ${news.describe}
            Link: ${process.env.BASE_URL}/news/${news._id}
            Lượt xem: ${news.views}
            Lượt like: ${news.like}
            Nội dung:
            ${htmlToText(news.content || '', {
              wordwrap: 130,
              ignoreImage: true,
              ignoreHref: true,
            })}`
        )
        .join('\n-------------------------\n');

      const finalPrompt = `Bạn là một trợ lý AI thông minh. Dưới đây là nội dung bài viết:\n"${combinedContent}"\n\n, Khi người dùng nhập: "${question}", 
        bạn hãy phân loại ý kiến của người dùng thành 3 loại ("content", "other", "search"):
        - Loại 1 là "content" (Nội dung tin tức): Người dùng đang hỏi về nội dung tin tức
        - Loại 2 là "other" (Không liên quan đến tin tức): Người dùng đang hỏi về một vấn đề khác không liên quan đến nội dung hoặc tìm kiếm tin tức
        - Loại 3 là "search" (Tìm kiếm tin tức): Người dùng đang tìm kiếm về một tin tức cụ thể
        Dựa trên loạt ý kiến của người dùng, 
        - Nếu là loại 1 thì hãy trả lời câu hỏi của người dùng dựa trên nội dung tin tức một cách ngắn gọn và dễ hiểu.
        - Nếu là loại 2 thì hãy trả lời "Không thuộc phạm vì của tôi" và có thể đưa ra những câu "Tôi có thể giúp gì cho bạn, Tìm kiếm tin tức hay tóm tắt một tin tức nào đó?".
        - Nếu là loại 3 hãy chọn đúng các tin tức liên quan nhất và đưa ra câu "Đây là tin tức bạn tìm".
        
        Chỉ trả lời kết quả cho người dùng, không kèm loại bao nhiêu`;

      const finalResult = await modelAI.generateContent(finalPrompt);
      const answer = finalResult.response.text().trim();

      return {
        reply: answer,
        relatedNews: matchedNews.map((news) => ({
          title: news.title,
          describe: news.describe,
          url: `${process.env.BASE_URL}/news/${news._id}`,
          routePath: `/news/${news._id}`,
        })),
      };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = geminiController;
