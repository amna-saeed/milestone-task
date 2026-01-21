"# amna" 
"# 📝 Sticky Notes Application"
A full-stack Sticky Notes application built with React, Node.js, Express, and MySQL, featuring secure authentication, email-based password recovery, and user-specific data isolation.

🚀 Features
🔐 Authentication & Authorization
_.User Sign Up & Login
_.JWT-based authentication
_.Email token generation for:
_.Forgot Password
_.Update / Reset Password
_.Secure password handling

👤 User Management
_.Multiple users supported
_.Each user can only see their own notes
_.Notes are not shared across accounts

🗒 Notes Functionality
_.Add new notes
_.Edit existing notes
_.Delete notes
_.User-specific note storage

📧 Email Integration
_.Password reset token sent via email
_.Secure token verification before password update

🛠 Tech Stack
1.Frontend
_.React.js
_.JavaScript
_.Tilwind Css
_.Axios
2.Backend
_.Node.js
_.Express.js
_.JWT Authentication
_.MySQL
_.Nodemailer
3.Tools
_.Postman (API testing)
_.Git & GitHub

🔑 Security
_.Passwords stored securely
_.Token-based authentication
_.Protected routes
_.Authorization middleware

⚙️ Setup Instructions
1.Backend
_.cd server
_.npm install
_.npm start
Frontend
_.cd client
_.npm install
_.npm start

📌 Key Highlights
_.Full authentication flow (login, signup, forgot password)
_.Secure email-based password reset
_.User-specific notes handling
_.Clean and maintainable code structure
_.Scalable architecture
