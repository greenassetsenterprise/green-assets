import React, { useState } from "react";
import sendFeedbackToGoogleSheet from "../api/sendFeedbackToGoogleSheet";

const FeedbackTool: React.FC = () => {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFeedback = async (isHelpful: boolean) => {
    setFeedbackGiven(isHelpful);
    setShowFeedbackOptions(false); // Hide the question and buttons immediately
    setEmojiVisible(true);
    
    const feedbackValue = isHelpful ? 1 : 0;
    const feedbackLabel = isHelpful ? 'thumbs up' : 'thumbs down';

    // Send feedback to Google Sheets
    setError(null);

    try {
      await sendFeedbackToGoogleSheet(feedbackValue, feedbackLabel);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="text-center mt-10">
      {error && <p className="text-red-500">{error}</p>}
      {showFeedbackOptions && !feedbackGiven && (
        <>
          <h1 className="text-xl font-semibold mb-4">Did you find the tool helpful?</h1>
          <div className="flex justify-center space-x-4">
            <button
              className="flex items-center justify-center text-green-500 p-2 rounded-full transition"
              onClick={() => handleFeedback(true)}
            >
              👍
            </button>
            <button
              className="flex items-center justify-center text-red-500 p-2 rounded-full transition"
              onClick={() => handleFeedback(false)}
            >
              👎
            </button>
          </div>
        </>
      )}
      {emojiVisible && (
        <div className="mt-4">
          <span
            className="emoji text-3xl transition-opacity duration-500 ease-in-out"
            style={{ opacity: emojiVisible ? 1 : 0 }}
          >
            {feedbackGiven ? '🎉' : '😔'}
          </span>
          <div className={`thank-you mt-2 transition-opacity duration-500 ease-in-out ${emojiVisible ? "opacity-100" : "opacity-0"}`}>
            Thank You!
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTool;
