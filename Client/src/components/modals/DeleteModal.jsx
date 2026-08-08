import GlobalModal from "./GlobalModal";
import { AlertTriangle } from "lucide-react";

const DeleteModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <GlobalModal open={open} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="size-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-primary-950">{title || "Are you sure?"}</h3>
        <p className="text-sm text-gray-500">{message || "This action cannot be undone."}</p>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onClose} className="flex-1 items-center gap-2 px-4 py-2 bg-white text-primary text-sm font-semibold rounded-xl border border-primary/40 hover:text-white hover:bg-primary active:scale-95 transition-all duration-150">Cancel</button>
          <button onClick={onConfirm} className="flex-1 items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-150">Delete</button>
        </div>
      </div>
    </GlobalModal>
  );
}

export default DeleteModal;
