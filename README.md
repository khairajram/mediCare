# MediCare: Smart Pet Clinic & Medical Ecosystem

MediCare is a high-fidelity, responsive Next.js 15 web application designed for **Shri Karni Pet Care Center**. It provides a unified digital experience connecting pet owners (parents) and veterinary administrators, facilitating medical logging, medicine orders, grooming appointments, support requests, and real-time inventory management.

---

## 🚀 Key Features

### 🐶 Pet Parent Portal (Client View)
1. **Complete Pet Bios**: Create and manage multiple pet profiles detailing age, breed, gender, and medical notes.
2. **Vaccination Timelines**: Track completed and upcoming vaccinations in a visual, structured timeline.
3. **Medicine Store & Refills**: Add prescription medicines to a cart, input delivery details, and place Cash on Delivery (COD) orders.
4. **Simulated GPS Telemetry**: Lock coordinates during checkout to send precise delivery navigation pins to the clinic.
5. **Consultation & Grooming Scheduler**: Book consulting slots with vet doctors or professional styling treatments (Bathing, Haircuts, Full Packages).
6. **Support Ticket Desk**: File tickets for dosage inquiries or appointment rescheduling, with direct admin reply views.
7. **Service Feedbacks**: Submit 1-to-5 star ratings and reviews to help improve clinic standards.

### 💼 Admin Operations Hub (Admin View)
1. **Centralized Command Panel**: Display analytics counters for pending orders, low-stock medicines, and active support tickets.
2. **Order Dispatch HUD**: Manage deliveries with controls to set states (`PENDING` ➔ `PACKING` ➔ `SHIPPED` ➔ `DELIVERED`). Coordinates lock link directly to Google Maps navigation.
3. **Real-time Inventory**: Monitor stock quantities. Decrement items automatically upon delivery, and trigger flashing low-stock alert badges when counts fall below thresholds.
4. **Appointment Management**: Review, approve, reject, or complete consultation and grooming slots.
5. **Support Ticket Desk**: Review, reply to, and resolve client support queries.
6. **System Audit Logs**: Track automated administrative logs (e.g. stock level warnings, new registrations, and orders).

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Framer Motion
* **Database & ORM**: PostgreSQL (AWS Neon Cloud), Prisma ORM
* **Security & Authentication**: JSON Web Tokens (JWT) stored in secure, HttpOnly cookies, Edge-compatible `jose` library for verification
* **Routing**: Next.js Edge Middleware for route protection
* **SEO**: `next-sitemap` for automated search engine index files generation

---

## 📂 Project Structure

```
├── app/                      # Next.js App Router root
│   ├── (user)/               # Client-facing pages
│   │   ├── home/             # User dashboard, orders, appointments, support, feedback
│   │   ├── login/            # Pet Parent login page
│   │   └── signup/           # Pet Parent registration page
│   ├── admin/                # Admin-facing pages
│   │   ├── dashboard/        # Admin control panel, inventory, scheduling, tickets, logs
│   │   └── login/            # Administrative login page
│   ├── api/                  # REST API Route handlers
│   │   ├── (auth)/           # Authenticated route APIs (users, orders, medicines, logs)
│   │   ├── logout/           # Session destruction API
│   │   └── me/               # Session profile API
│   ├── globals.css           # Glassmorphic themes & styling
│   └── layout.tsx            # Root theme and global layout
├── components/               # Reusable UI widgets & dashboards
│   ├── header/               # Navigation header (Client/Admin menus & theme toggles)
│   ├── sideBarAdmin/         # Admin navigation drawer
│   └── ui/                   # Shared UI primitives (shadcn base)
├── prisma/                   # DB migrations & schemas
│   ├── schema.prisma         # Database models & relationships
│   └── seed.js               # Production-ready seed script
└── middleware.ts             # JWT Auth route guard middleware
```

---

## ⚙️ Local Development Setup

### Prerequisites
* Node.js (v18.x or higher)
* npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/khairajram/mediCare.git
cd mediCare
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"
JWT_SECRET="your_jwt_signature_secret_key"
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"
PORT=3000
```

### 4. Database Setup & Seeding
Sync your PostgreSQL database schema and run the seed script to create default administrator accounts and seed the initial medicine catalog:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Production Builds & Deployments

### 1. Build the App
Compile the project to verify type safety and packaging:
```bash
npm run build
```

### 2. Deploying on Vercel
Deploy your Next.js application by linking your GitHub repository to Vercel:
1. Create a project on Vercel.
2. In **Project Settings ➔ Environment Variables**, add your `DATABASE_URL` and `JWT_SECRET`.
3. Vercel will automatically fetch pushes to the `main` branch, build, and deploy.
