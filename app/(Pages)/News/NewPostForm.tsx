import { useState } from "react";
import Avater from "@/app/Components/Avater/Avater";
import { RefObject } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { HiOutlineEmojiHappy } from "react-icons/hi";

interface NewPostFormProps {
  reference: RefObject<HTMLDialogElement>;
}

interface Emoji {
    native: string;
  }

const NewPostForm: React.FC<NewPostFormProps> = ({ reference }) => {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const addEmoji = (emoji: Emoji) => {
    setText(text + emoji.native);
    setShowPicker(!showPicker);
  };

  const toggleEmojiPicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <dialog ref={reference} className="modal items-start mt-28">
      <div className="modal-box p-4 min-h-96 max-w-[40rem] flex flex-col gap-2">
        <div className="card group hover:bg-base-300 p-4 flex flex-row gap-4 w-fit">
          <Avater
            profilePhoto="/images/universities/dbu.jpg"
            name={undefined}
            onClick={undefined}
          />
          <div className="user">
            <h2 className="font-bold">Debre Berhan University</h2>
            <select className="group-hover:bg-base-300 select w-full max-w-xs focus:outline-none focus:border-none p-0 pb-2 h-8 min-h-2 -mt-1">
              <option selected className="py-1">
                Post to anyone
              </option>
              <option className="py-1">Post to universities</option>
              <option className="py-1">Post to colleges</option>
              <option className="py-1">Post to department</option>
              <option className="py-1">Post to lectures</option>
            </select>
          </div>
        </div>
        {/* inputs for new post */}
        <div className="flex flex-col">
          <textarea
            className="textarea resize-none border-none focus:outline-none focus:border-none text-base"
            placeholder="What do you want to post?"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="flex">
            <button type="button" onClick={toggleEmojiPicker} className="btn btn-ghost">
              {/* {showPicker ? "Hide Emojis" : "Show Emojis"} */}
              <HiOutlineEmojiHappy className="text-2xl" />
            </button>
            {showPicker && (
              <Picker
                set="twitter"
                data={data}
                onSelect={addEmoji}
                style={{ position: "absolute", bottom: "20px", right: "20px" }}
              />
            )}
          </div>
        </div>
      </div>
      {/* <div className="modal-backdrop"></div> */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default NewPostForm;
