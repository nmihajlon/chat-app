import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const { messages, sendMessage } = useChatStore();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      console.log(imagePreview);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
    reader.readAsDataURL(file);

  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;
    
    try{
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })

      setText("");
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
    catch(err: any){
      console.error("Failed to send message: ", err)
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview || "/avatar.png"}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            className="border border-primary px-3 py-2 
            focus:outline-0 w-full 
            rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={16}></Send>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
