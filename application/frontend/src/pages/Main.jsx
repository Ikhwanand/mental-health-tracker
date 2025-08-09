import MentalHealthIllustraction from "../assets/carousel-image.jpg";
import { FaLock, FaChartLine, FaFileExport } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featureVariants = {
  initial: { opacity: 0, y: 40 },
  animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2 } }),
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 8,
    transition: { type: "spring", stiffness: 300 },
  },
  tap: { scale: 0.95 },
};

const Main = ({ page, setPage }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 py-12 md:py-20 gap-10">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-6 leading-tight">
            Take Charge of Your{" "}
            <span className="text-blue-500">Mental Wellness</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Track your mood, habits, and mental health journey with ease.
            Visualize your progress, reflect on your history, and get
            personalized insights—all in one secure place.
          </p>
          <Link
            to={"/tracker"}
            className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 font-semibold transition"
            onClick={() => setPage("tracker")}
          >
            Get Started
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={MentalHealthIllustraction}
            alt="Mental Health Illustration"
            className="rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white/80 py-12 px-6 md:px-20 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-10">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaLock className="mx-auto mb-4 text-5xl text-teal-600" />,
              title: "Secure Authentication",
              desc: "Your data is private and protected with secure login and registration.",
            },
            {
              icon: (
                <FaChartLine className="mx-auto mb-4 text-5xl text-blue-500" />
              ),
              title: "Daily Tracking",
              desc: "Log your mood, habits, and notes daily to monitor your mental health trends.",
            },
            {
              icon: (
                <FaFileExport className="mx-auto mb-4 text-5xl text-yellow-500" />
              ),
              title: "Export Data",
              desc: "Easily export your history for sharing with professionals or personal backup.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-teal-50 rounded-lg p-6 shadow hover:shadow-lg transition"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              variants={featureVariants}
              whileHover={{ scale: 1.04 }}
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-6">
          About This App
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto">
          Calmora is designed to empower individuals to take control of their
          mental wellness journey. By providing a simple, secure, and insightful
          platform, we aim to help users build healthy habits, recognize
          patterns, and seek support when needed.
        </p>
      </section>
    </div>
  );
};

export default Main;
