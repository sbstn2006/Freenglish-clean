"use client";

interface Props {
    onClick: () => void;
}


export default function ChatButton({ onClick }: Props) {

    return (
        <button
            onClick={() => {
                console.log("botón presionado");
                onClick();
            }}
            className="
            fixed
            bottom-6
            right-6
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-full
            w-16
            h-16
            shadow-lg
            text-3xl
            z-50
            "
        >
            💬
        </button>
    );
}