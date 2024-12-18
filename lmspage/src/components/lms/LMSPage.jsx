import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Toggle } from '../ui/toggle';


const dummyData = [
  {
    id: 1,
    videoUrl: "https://www.youtube.com/embed/dummyVideo1?rel=0&controls=1&showinfo=0",
    assessment: {
      type: "multiple-choice",
      question: "What is React?",
      options: [
        { text: "A library for building user interfaces", correct: true },
        { text: "A database", correct: false },
        { text: "An operating system", correct: false },
      ],
    },
  },
  {
    id: 2,
    videoUrl: "https://www.youtube.com/embed/dummyVideo2?rel=0&controls=1&showinfo=0",
    assessment: {
      type: "short-answer",
      question: "Explain the Virtual DOM in a few sentences.",
    },
  },
];

const LMSPage = () => {
  const [currentTask, setCurrentTask] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [responses, setResponses] = useState({});
  const assessmentRefs = useRef([]);

  const handleVideoEnd = () => {
    if (assessmentRefs.current[currentTask]) {
      assessmentRefs.current[currentTask].scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResponse = (id, response) => {
    setResponses({ ...responses, [id]: response });
  };

  const handleNextTask = () => {
    if (currentTask < dummyData.length - 1) {
      setCurrentTask((prev) => prev + 1);
    }
  };

  const renderAssessment = (assessment, id) => {
    if (assessment.type === "multiple-choice") {
      return (
        <div>
          <p>{assessment.question}</p>
          {assessment.options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`question-${id}`}
                onChange={() => handleResponse(id, option.correct)}
              />
              {option.text}
            </label>
          ))}
        </div>
      );
    } else if (assessment.type === "short-answer") {
      return (
        <div>
          <p>{assessment.question}</p>
          <Input
            type="text"
            onChange={(e) => handleResponse(id, e.target.value)}
          />
        </div>
      );
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="p-4">
        <Toggle onClick={() => setDarkMode(!darkMode)}>Dark Mode</Toggle>
      </div>
      <div className="flex flex-col items-center gap-8">
        {dummyData.map((task, index) => (
          <Card key={task.id} className="w-full max-w-3xl">
            <iframe
              width="100%"
              height="400"
              src={task.videoUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              onLoad={() => {
                if (index === currentTask) {
                  const iframe = document.querySelector(`iframe[src='${task.videoUrl}']`);
                  iframe.contentWindow.postMessage(JSON.stringify({ event: "play" }), "*");
                }
              }}
              onEnded={handleVideoEnd}
            ></iframe>
            <div ref={(el) => (assessmentRefs.current[index] = el)}>
              {index === currentTask && renderAssessment(task.assessment, task.id)}
            </div>
          </Card>
        ))}
        <Button
          onClick={handleNextTask}
          disabled={!responses[currentTask] || currentTask >= dummyData.length - 1}
        >
          Next Task
        </Button>
      </div>
    </div>
  );
};

export default LMSPage;
