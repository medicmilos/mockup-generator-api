import { useEffect, useState } from "react";

// TypeScript interface to define the structure of the incoming message
interface MessageData {
  message: string;
  timestamp: string;
}

// Custom hook to handle postMessage
const usePostMessage = () => {
  const [data, setData] = useState<MessageData | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify that the message is coming from a trusted origin
      if (event.origin !== "null") {
        console.warn("Untrusted origin:", event.origin);
        return;
      }

      // Check if the data has the expected format
      if (
        event.data &&
        event.data.siteKey &&
        event.data.designUrl &&
        event.data.anyOtherProp
      ) {
        setData(event.data);
      }
    };

    // Add event listener for message events
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return data;
};

export default usePostMessage;
