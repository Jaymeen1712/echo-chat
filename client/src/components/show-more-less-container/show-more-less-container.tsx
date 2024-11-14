import { useEffect, useState } from "react";

const ShowMoreLessContainer = () => {
  const prefixText = "From";
  const suffixText = "To";
  const initialDisplayLimit = 1030 // Adjust this to any small number to test
  const contentFrom = 
    "Maintaining a healthy work-life balance is essential for both mental and physical well-being. To start, setting clear boundaries between work and personal time can be beneficial. Avoid checking emails or engaging in work tasks outside of office hours. Time management is also crucial; using tools like planners or digital calendars helps prioritize tasks efficiently. It’s essential to take breaks throughout the day to avoid burnout, so consider taking short walks or meditation breaks to recharge. Fostering hobbies outside work, like reading or sports, allows for mental relaxation and a sense of accomplishment outside professional achievements. Another vital aspect is open communication—inform family members and colleagues about your availability and the importance of boundaries. Lastly, prioritize sleep and self-care routines, as they’re the foundation of a balanced life. By consciously applying these practices, you can create a fulfilling work-life harmony that leads to greater satisfaction and productivity.";
  const contentTo = 
    "Recycling plays a crucial role in preserving the environment and conserving natural resources. By recycling materials such as plastic, paper, glass, and metal, we reduce the demand for raw resources and lower energy consumption. For example, recycling aluminum saves up to 95% of the energy required to produce it from raw materials. This simple practice also reduces landfill waste, which decreases pollution and protects ecosystems from harmful substances. Recycling has social benefits, too—it creates job opportunities in recycling and manufacturing sectors. Additionally, recycling helps combat climate change by reducing greenhouse gas emissions. Small actions, like using reusable bags or composting food waste, contribute to a larger impact over time. Teaching children and communities the importance of recycling fosters a culture of environmental responsibility. By incorporating recycling into our daily routines, we can create a healthier, cleaner planet for future generations.";

  const [isExpanded, setIsExpanded] = useState(false);
  const [displayContent, setDisplayContent] = useState<React.ReactNode>(<></>);

  const toggleContentDisplay = () => {
    setIsExpanded((prev) => !prev);
  };

  const prefixLength = prefixText.length;
  const suffixLength = suffixText.length;
  const fromContentLength = contentFrom.length;
  const toContentLength = contentTo.length;

  useEffect(() => {
    if (isExpanded) {
      // Display full content when expanded
      setDisplayContent(
        <div>
          <span className="px-1 text-xl font-bold italic text-red-400">
            {prefixText}
          </span>
          <span>{contentFrom}</span>
          <span className="px-1 text-xl font-bold italic text-red-400">
            {suffixText}
          </span>
          <span>{contentTo}</span>
        </div>
      );
    } else {
      // Calculate available characters for truncated display
      const availableCharacters = initialDisplayLimit;

      let prefix, fromText, suffix, toText;

      if (availableCharacters <= prefixLength) {
        // Case 1: Only part of prefixText fits
        prefix = prefixText.slice(0, availableCharacters);
      } else if (availableCharacters <= prefixLength + fromContentLength) {
        // Case 2: Full prefixText and part of contentFrom fit
        prefix = prefixText;
        fromText = contentFrom.slice(0, availableCharacters - prefixLength);
      } else if (availableCharacters <= prefixLength + fromContentLength + suffixLength) {
        // Case 3: Full prefixText, full contentFrom, and part of suffixText fit
        prefix = prefixText;
        fromText = contentFrom;
        suffix = suffixText.slice(0, availableCharacters - prefixLength - fromContentLength);
      } else {
        // Case 4: Full prefixText, full contentFrom, full suffixText, and part of contentTo fit
        prefix = prefixText;
        fromText = contentFrom;
        suffix = suffixText;
        toText = contentTo.slice(0, availableCharacters - prefixLength - fromContentLength - suffixLength);
      }

      setDisplayContent(
        <div>
          {prefix && (
            <span className="px-1 text-xl font-bold italic text-red-400">
              {prefix}
            </span>
          )}
          {fromText && <span>{fromText}</span>}
          {suffix && (
            <span className="px-1 text-xl font-bold italic text-red-400">
              {suffix}
            </span>
          )}
          {toText && <span>{toText}</span>}
        </div>
      );
    }
  }, [isExpanded]);

  return (
    <div className="flex justify-center">
      <div className="w-[480px] bg-black p-4 text-white">
        {displayContent}
        <button
          onClick={toggleContentDisplay}
          className="mt-2 bg-white text-black p-2 rounded"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
};

export default ShowMoreLessContainer;
