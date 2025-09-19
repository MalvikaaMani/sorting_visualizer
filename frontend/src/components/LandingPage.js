import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // Typing animation state
 const phrases = [
  "Learn Merge Sort ✨",
  "Master Quick Sort ⚡",
  "Understand Heap Sort 🏔️",
  "Practice Insertion Sort 🧩",
  "Discover Bubble Sort 🫧",
  "Explore Selection Sort 🎯",
  "Visualize Algorithms 🚀"
];
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    const typingEffect = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
        typingSpeed = 1500; // Pause before deleting
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, typingSpeed);

    return () => clearTimeout(typingEffect);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="landing-container">
      {/* Floating Emojis */}
      <div className="floating">✨</div>
      <div className="floating">🚀</div>
      <div className="floating">🎉</div>
      <div className="floating">📊</div>
      <div className="floating">💡</div>

      {/* Main Content */}
      <h1 className="title">✨ Welcome to Sorting Visualizer ✨</h1>
      <p className="subtitle">
        {text}
        <span className="cursor">|</span>
      </p>

      <div className="btn-group">
        <button onClick={() => navigate("/auth?mode=login")}>Login</button>
        <button onClick={() => navigate("/auth?mode=signup")}>Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;
