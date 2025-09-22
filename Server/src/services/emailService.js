const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_GOOGLE_APP,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendVerificationEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"VietNews - Tin Tức 24h" <no-reply@vietnews.vn>`,
    to: email,
    subject: 'Xác thực tài khoản VietNews của bạn',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background-color: #d32f2f; padding: 20px 24px;">
            <h1 style="color: #fff; margin: 0;">VietNews - Tin Tức 24h</h1>
          </div>

          <div style="padding: 24px;">
            <h2 style="color: #d32f2f;">Xin chào quý độc giả,</h2>
            <p>Cảm ơn bạn đã quan tâm và đăng ký tài khoản trên <strong>VietNews - Tin Tức 24h</strong> – nơi cập nhật những thông tin nóng hổi, chính xác và đáng tin cậy nhất 24/7.</p>

            <p>Chúng tôi cần xác minh rằng bạn chính là chủ sở hữu địa chỉ email này. Vui lòng sử dụng mã xác thực bên dưới để hoàn tất quá trình đăng ký:</p>

            <div style="background-color: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <span style="font-size: 24px; color: #1976d2; font-weight: bold;">${otp}</span>
              <p style="margin-top: 8px; color: #555;">(Có hiệu lực trong vòng 5 phút)</p>
            </div>

            <p style="margin-top: 32px;">Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này. Trong trường hợp có bất kỳ thắc mắc nào, bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi:</p>

            <ul style="margin-top: 16px; color: #444;">
              <li>Email: <a href="mailto:support@vietnews.vn" style="color: #1976d2;">support@vietnews.vn</a></li>
              <li>Hotline: 0961 7538 37</li>
              <li>Website: <a href="https://vietnews-client.vercel.app/" style="color: #1976d2;">vietnews-client.vercel.app/</a></li>
            </ul>

            <p style="margin-top: 32px;">Cảm ơn bạn đã tin tưởng và đồng hành cùng VietNews.</p>
            <p>Trân trọng,<br><strong>Đội ngũ VietNews</strong></p>
          </div>

          <div style="background-color: #eee; text-align: center; font-size: 13px; color: #666; padding: 16px;">
            © 2025 VietNews. Tất cả các quyền được bảo lưu.<br>
            226 Đường Quang Trung, Phường Quang Trung, TP. Thái Nguyên
          </div>
        </div>
      </div>
    `,
  });
};

const sendForgotPasswordEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"VietNews - Tin Tức 24h" <no-reply@vietnews.vn>`,
    to: email,
    subject: 'Mã xác thực đặt lại mật khẩu tài khoản VietNews',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background-color: #d32f2f; padding: 20px 24px;">
            <h1 style="color: #fff; margin: 0;">VietNews - Tin Tức 24h</h1>
          </div>

          <div style="padding: 24px;">
            <h2 style="color: #d32f2f;">Yêu cầu đặt lại mật khẩu</h2>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ tài khoản liên kết với địa chỉ email: <strong>${email}</strong>.</p>

            <p>Để tiếp tục, vui lòng sử dụng mã OTP bên dưới để xác nhận yêu cầu đặt lại mật khẩu:</p>

            <div style="background-color: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <span style="font-size: 24px; color: #1976d2; font-weight: bold;">${otp}</span>
              <p style="margin-top: 8px; color: #555;">(Mã có hiệu lực trong vòng 5 phút)</p>
            </div>

            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi để được hỗ trợ kịp thời.</p>

            <ul style="margin-top: 16px; color: #444;">
              <li>Email: <a href="mailto:support@vietnews.vn" style="color: #1976d2;">support@vietnews.vn</a></li>
              <li>Hotline: 0961753837</li>
              <li>Website: <a href="https://vietnews-client.vercel.app/" style="color: #1976d2;">vietnews-client.vercel.app/</a></li>
            </ul>

            <p style="margin-top: 32px;">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của VietNews.</p>
            <p>Trân trọng,<br><strong>Đội ngũ VietNews</strong></p>
          </div>

          <div style="background-color: #eee; text-align: center; font-size: 13px; color: #666; padding: 16px;">
            © 2025 VietNews. Tất cả các quyền được bảo lưu.<br>
            226 Đường Quang Trung, Phường Quang Trung, TP. Thái Nguyên
          </div>
        </div>
      </div>
    `,
  });
};

const sendUpdateEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"VietNews - Tin Tức 24h" <no-reply@vietnews.vn>`,
    to: email,
    subject: 'Mã xác thực đặt lại email tài khoản VietNews',
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #d32f2f; padding: 20px 24px;">
          <h1 style="color: #fff; margin: 0;">VietNews - Tin Tức 24h</h1>
        </div>

        <div style="padding: 24px;">
          <h2 style="color: #d32f2f;">Xác nhận địa chỉ email</h2>
          <p>Bạn đang đổi địa chỉ email liên kết với VietNews. Để hoàn tất, vui lòng sử dụng mã xác nhận bên dưới:</p>

          <div style="background-color: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 24px; color: #1976d2; font-weight: bold;">${otp}</span>
            <p style="margin-top: 8px; color: #555;">(Mã xác nhận có hiệu lực trong vòng 5 phút)</p>
          </div>

          <p>Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi để được hỗ trợ sớm nhất.</p>

          <ul style="margin-top: 16px; color: #444;">
            <li>Email: <a href="mailto:support@vietnews.vn" style="color: #1976d2;">support@vietnews.vn</a></li>
            <li>Hotline: 0961753837</li>
            <li>Website: <a href="https://vietnews-client.vercel.app/" style="color: #1976d2;">vietnews-client.vercel.app/</a></li>
          </ul>

          <p style="margin-top: 32px;">Cảm ơn bạn đã lựa chọn VietNews.</p>
          <p>Trân trọng,<br><strong>Đội ngũ VietNews</strong></p>
        </div>

        <div style="background-color: #eee; text-align: center; font-size: 13px; color: #666; padding: 16px;">
          © 2025 VietNews. Tất cả các quyền được bảo lưu.<br>
          226 Đường Quang Trung, Phường Quang Trung, TP. Thái Nguyên
        </div>
      </div>
    </div>
  `,
  });
};

const sendBanNotification = async (to, fullName, banUntil, reason) => {
  await transporter.sendMail({
    from: '"VietNews Support" <your_email@gmail.com>',
    to,
    subject: 'Tài khoản của bạn đã bị khóa tạm thời',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
          <div style="background-color: #d32f2f; padding: 20px 24px;">
            <h1 style="color: #fff; margin: 0;">VietNews - Tin Tức 24h</h1>
          </div>

          <div style="padding: 24px;">
            <h2 style="color: #d32f2f;">Tài khoản đã bị khóa tạm thời</h2>
            <p>Xin chào <strong>${fullName}</strong>,</p>

            <p>Tài khoản của bạn đã bị <strong>tạm khóa</strong> đến ngày <strong style="color: #1976d2;">${banUntil}</strong>.</p>

            <div style="background-color: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
              <p style="font-size: 18px; color: #d32f2f; font-weight: bold; margin: 0;">Lý do khóa tài khoản:</p>
              <p style="margin-top: 8px; color: #555;">${reason}</p>
            </div>

            <p>Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để được xem xét và hỗ trợ thêm.</p>

            <ul style="margin-top: 16px; color: #444;">
              <li>Email: <a href="mailto:support@vietnews.vn" style="color: #1976d2;">support@vietnews.vn</a></li>
              <li>Hotline: 0961753837</li>
              <li>Website: <a href="https://vietnews-client.vercel.app/" style="color: #1976d2;">vietnews-client.vercel.app/</a></li>
            </ul>

            <p style="margin-top: 32px;">Cảm ơn bạn đã đồng hành cùng VietNews.</p>
            <p>Trân trọng,<br><strong>Đội ngũ VietNews</strong></p>
          </div>

          <div style="background-color: #eee; text-align: center; font-size: 13px; color: #666; padding: 16px;">
            © 2025 VietNews. Tất cả các quyền được bảo lưu.<br>
            226 Đường Quang Trung, Phường Quang Trung, TP. Thái Nguyên
          </div>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendUpdateEmail,
  sendBanNotification,
};
