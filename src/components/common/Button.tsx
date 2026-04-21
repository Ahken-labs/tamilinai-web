"use client";

type ButtonProps = {
    text: string;
    onPress?: () => void;
    className?: string;
    type?: "button" | "submit";
};

export default function Button({
    text,
    onPress,
    className = "",
    type = "button",
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onPress}
            className={`
        inline-flex items-center justify-center select-none cursor-pointer
        font-semibold text-white
        transition-all duration-150
        active:scale-[0.98]
        py-3
        px-10
        rounded-full
        text-[14px] md:text-[16px]
        bg-[#B31B38] 
        hover:bg-[#8E162D]   /* darker on hover */
        active:bg-[#6F1023]  /* even darker on click */

        ${className}
      `}
        >
            {text}
        </button>
    );
}