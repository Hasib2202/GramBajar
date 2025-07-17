

---

```markdown
# 🛒 GramBajar

**GramBajar** is a full-stack e-commerce platform revolutionizing the grocery supply chain by connecting farmers directly with consumers. Built with **Next.js**, **Express.js**, and **MongoDB**, the platform emphasizes speed, transparency, and simplicity.

---

## 🚀 Tech Stack

| Frontend       | Backend        | Database        | Tools / Services        |
|----------------|----------------|-----------------|-------------------------|
| Next.js 14     | Express.js     | MongoDB Atlas   | Cloudinary (Image Upload) |
| Tailwind CSS + ShadCN | Node.js         | Mongoose        | JWT (Auth), Recharts (Analytics) |
| React Hook Form | Nodemailer     |                 | Vercel (Hosting)         |

---

## 🔑 Features

### 👥 Authentication & Authorization
- JWT-based secure login & registration
- Google OAuth integration
- Role-based access (Admin / Consumer)
- Password reset with email (via Nodemailer)

### 👤 User Management
- Admin: Full user CRUD + Block/Unblock users
- Consumer: Profile update + Avatar upload
- Centralized theme management (light/dark mode)

### 🛍️ Product Catalog
- Admin: Create/Edit/Delete products & categories
- Consumers: Filter, sort, and search by category, price, date
- Pagination for product listing

### 🛒 Shopping Cart
- Live cart updates for guests & logged-in users
- Cart persistence in DB for authenticated users
- Quantity control with subtotal calculations

### 💳 Orders & Payment (Mock)
- Create orders from cart
- Simulated payment processing (Success/Fail flow)
- Order status tracking (Pending → Paid → Completed)

### 📦 Order Management
- Admin: View all orders, update statuses in bulk
- User: View past orders with details
- Review & rating system for products

### 📊 Admin Dashboard
- Realtime sales analytics via Recharts
- Sales reports by product & date
- User and order summaries

---

## 📅 7-Day Development Timeline

| Day | Focus Areas |
|-----|-------------|
| 1   | Core setup, JWT auth, Google OAuth |
| 2   | User profiles, role-based access |
| 3   | Product catalog, search & filters |
| 4   | Cart system & DB syncing |
| 5   | Checkout, orders, mock payment |
| 6   | Order history, reviews, admin tools |
| 7   | Final testing, responsiveness, deployment |

---

## 📁 Project Structure

```

├── backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── styles/

````

---

## 🧪 Testing

- Client-side tested for responsiveness across devices
- JWT & role middleware protected routes tested manually
- Basic error handling and validation included using middleware

---

## 🧑‍💻 Developer

**Md. Mostofa Hasib**  
- 🌐 [mostofahasib.dev](https://mostofahasib.dev)  
- 💼 [LinkedIn](https://www.linkedin.com/in/md-mostofa-hasib-5b4027184/)  
- 🐙 [GitHub](https://github.com/mostofa-hasib)  
- 📧 mostofahasib.dev@gmail.com

---

## 🌐 Live Demo (Vercel)

Coming soon...

---

## 🛠️ Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` folders:

**Backend `.env`:**

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

**Frontend `.env.local`:**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📦 Deployment

* Frontend deployed via **Vercel**
* Backend: (Optional) Serverless via Vercel/Render, or host on VPS
* Database: **MongoDB Atlas**

---

## 📌 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Empowering local farmers. Delivering fresh groceries. Built with ❤️ by Mostofa Hasib.

```

---

Let me know if you'd like:
- a `CONTRIBUTING.md` file,
- an `API.md` file with documentation of endpoints,
- badge integrations (build, license, deploy),
- or markdown with visual logos and status indicators.
```
