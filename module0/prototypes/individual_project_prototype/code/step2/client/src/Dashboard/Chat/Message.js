import React, { useState, useEffect } from "react";
import { GrUser } from "react-icons/gr";
import { FcMindMap } from "react-icons/fc";

// Displays the text one character at a time (typing effect).
// `count` is the number of characters shown so far. Whenever it changes, the effect
// schedules the next update, until the whole text is displayed.
const SlowText = ({ speed, text }) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= text.length) return; // everything is shown: stop

    const timer = setTimeout(() => setCount(count + 1), speed);
    return () => clearTimeout(timer); // clean up when the component goes away
  }, [count, speed, text]);

  return <span>{text.slice(0, count)}</span>;
};

// Different icons for an AI generated message and a user's question.
const Message = ({ content, aiMessage, animate }) => {
  return (
    <div
      className="message_container"
      style={{ background: aiMessage ? "rgb(247, 247, 248)" : "white" }}
    >
      <div className="message_avatar_container">
        {aiMessage ? <FcMindMap /> : <GrUser />}
      </div>
      <p className="message_text">
        {animate ? <SlowText speed={20} text={content} /> : content}
      </p>
    </div>
  );
};

export default Message;
