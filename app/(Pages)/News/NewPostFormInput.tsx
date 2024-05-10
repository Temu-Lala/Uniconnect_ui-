import { useState } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const NewPostFormInput = ({ reference }) => {
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (e) => {
    let emoji = e.native;
    setText(text + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <dialog ref={reference} className="modal">
      <div className="modal-box">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Type your post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" onClick={toggleEmojiPicker} className="btn">
          {showPicker ? 'Hide Emojis' : 'Show Emojis'}
        </button>
        {showPicker && (
          <Picker onSelect={addEmoji} style={{ position: 'absolute', bottom: '20px', right: '20px' }} />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="btn">Close</button>
      </form>
    </dialog>
  );
};

export default NewPostFormInput;
