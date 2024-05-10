import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface EmojiObject {
    emoji: string; // You might need to adjust this based on the actual structure
    name?: string; // Include other properties as needed
  }
  
  function EmojiPickerExample() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiObject | null>(null);
  
    const handleEmojiSelect = (emoji: EmojiObject) => {
      setSelectedEmoji(emoji);
    };
  
    return (
      <div>
        <h1>Selected Emoji: {selectedEmoji ? selectedEmoji.emoji : "None"}</h1>
        <EmojiPicker
          onEmojiClick={handleEmojiSelect}
          // rows={4}
          // perRow={8}
          // emojiSize={32}
          // pickerStyle={{ position: "absolute", bottom: "20px", right: "20px" }}
        />
      </div>
    );
  }
  
  export default EmojiPickerExample;
  