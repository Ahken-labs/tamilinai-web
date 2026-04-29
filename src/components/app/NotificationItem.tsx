interface NotificationItemProps {
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  onClick?: () => void;
}

// TODO: implement full NotificationItem with icon based on type
export default function NotificationItem({ title, message, createdAt, read, onClick }: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-4 px-4 py-3 rounded-xl transition-colors duration-150
        ${read ? "bg-white" : "bg-[#B31B38]/5"}
        hover:bg-[#F5F5F5]`}
    >
      <div className="w-2 h-2 rounded-full bg-[#B31B38] mt-2 shrink-0 opacity-0 data-[unread=true]:opacity-100" data-unread={!read} />
      <div className="flex-1 min-w-0">
        <p className="font-poppins font-semibold text-sm text-[#222222]">{title}</p>
        <p className="font-poppins text-sm text-[#555555] truncate">{message}</p>
        <p className="font-poppins text-xs text-[#888888] mt-1">{createdAt}</p>
      </div>
    </button>
  );
}
