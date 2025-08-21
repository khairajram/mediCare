"use client";

import { motion } from "framer-motion";
import {
  PawPrint,
  Pill,
  Bell,
  Stethoscope,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative flex flex-col items-center justify-center w-full overflow-hidden">
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl animate-pulse top-[-100px] left-[-150px]" />
        <div className="absolute w-[600px] h-[600px] bg-indigo-400/30 rounded-full blur-3xl animate-pulse bottom-[-200px] right-[-150px]" />
      </div>


      <section className="w-full py-24 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white relative ">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center md:text-left"
          >
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
              🐾 Pet Health Made Simple
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Smart Health for Your Pets
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl">
              Track medicines, reminders, and pet health records — all in one
              simple app.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
              >
                Get Started
              </a>
              <a
                href="/admin/login"
                className="bg-indigo-800 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-900"
              >
                Admin login
              </a>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-64 h-96 bg-white rounded-3xl shadow-lg flex items-center justify-center text-gray-400">
              App Mockup
            </div>
          </motion.div>
        </div>
      </section>


      <div className="w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-16 text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            fill="currentColor"
            d="M321.39,56.39c58-10.79,114-30.15,172-41.94,82-16.65,168-17.54,250,0C823.39,31.18,891,57.39,963,72c94,19.75,186,18.69,277,1.86V120H0V68.57A600.21,600.21,0,0,0,321.39,56.39Z"
          ></path>
        </svg>
      </div>


      <section className="w-full py-20 px-6 bg-gray-50 text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: (
                <PawPrint className="w-12 h-12 text-blue-600 mb-4" />
              ),
              title: "Pet Profiles",
              desc: "Create detailed profiles for each pet.",
            },
            {
              icon: <Pill className="w-12 h-12 text-green-600 mb-4" />,
              title: "Medicine Tracking",
              desc: "Manage prescriptions & dosages.",
            },
            {
              icon: <Bell className="w-12 h-12 text-yellow-500 mb-4" />,
              title: "Smart Reminders",
              desc: "Never miss a dose again.",
            },
            {
              icon: (
                <Stethoscope className="w-12 h-12 text-purple-600 mb-4" />
              ),
              title: "Vet Dashboard",
              desc: "Vets can manage multiple pets.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16 text-white"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            fill="currentColor"
            d="M321.39,56.39c58-10.79,114-30.15,172-41.94,82-16.65,168-17.54,250,0C823.39,31.18,891,57.39,963,72c94,19.75,186,18.69,277,1.86V120H0V68.57A600.21,600.21,0,0,0,321.39,56.39Z"
          ></path>
        </svg>
      </div>


      <section className="w-full py-20 px-6 bg-white text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              step: "1",
              title: "Add Pet",
              desc: "Create a profile with age, breed, and health info.",
            },
            {
              step: "2",
              title: "Track Medicines",
              desc: "Log prescriptions and dosages easily.",
            },
            {
              step: "3",
              title: "Get Reminders",
              desc: "Receive alerts when it’s time to give medicine.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
              viewport={{ once: true }}
              className="p-6 border rounded-2xl shadow-md hover:shadow-xl"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      <section
        id="download"
        className="w-full py-20 px-6 bg-gray-50 text-gray-800 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">App Preview</h2>
        <p className="mb-8">Here’s how MediCare looks on mobile.</p>
        <div className="mx-auto w-64 h-128 bg-white rounded-3xl shadow-lg flex items-center justify-center text-gray-400">
          App Screenshot Placeholder
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <a href="#" className="bg-black text-white px-6 py-3 rounded-xl">
            App Store
          </a>
          <a href="#" className="bg-black text-white px-6 py-3 rounded-xl">
            Google Play
          </a>
        </div>
      </section>
      

      <section className="w-full py-20 px-6 bg-white text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Pet Parents Say
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Sarah & Bella 🐶",
              text: "MediCare helps me stay on top of Bella’s medicine schedule. No more missed doses!",
            },
            {
              name: "Raj & Simba 🐱",
              text: "Simple and effective. I can manage multiple pets in one place.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 border rounded-2xl shadow-md"
            >
              <p className="italic mb-4">“{t.text}”</p>
              <h4 className="font-semibold">– {t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-20 px-6 bg-gray-50 text-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">FAQs</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: "Is MediCare free?",
              a: "Yes! MediCare is free for pet parents. A premium version for vets is coming soon.",
            },
            {
              q: "Can I manage multiple pets?",
              a: "Absolutely. You can add as many pets as you like.",
            },
            {
              q: "Do I get medicine reminders?",
              a: "Yes, you’ll receive notifications so you never miss a dose.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-4 border rounded-xl shadow-sm bg-white"
            >
              <h4 className="font-semibold mb-2">{f.q}</h4>
              <p>{f.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="w-full py-20 px-6 bg-white text-center text-gray-800">
        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-6">
          Have questions or feedback? We’d love to hear from you.
        </p>
        <a
          href="mailto:contact@medicare.com"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <Mail className="w-5 h-5" /> shreekarnimedical01@gmail.com
        </a>
      </section>


      <footer className="w-full py-6 bg-gray-900 text-gray-400 text-center">
        <div className="flex gap-6 justify-center mb-4">
          <a target="_blank" href="https://www.instagram.com/shri.karni.pet.care.center?igsh=MWZqd2gxbDZtc2NmNQ==">
            <Instagram />
          </a>
        </div>
        <p>© {new Date().getFullYear()} MediCare. All rights reserved.</p>
      </footer>
    </main>
  );
}
