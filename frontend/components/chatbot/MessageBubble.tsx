import { ChatMessage } from "@/types/Chat";


export default function MessageBubble({
    message
}: {
    message: ChatMessage
}) {

    const user = message.sender === "user";


    return (

        <div
            className={`
            flex
            ${user ? "justify-end" : "justify-start"}
            mb-3
            `}
        >

            <div
                className={`
                max-w-[80%]
                px-4
                py-3
                rounded-xl
                ${
                    user
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }
                `}
            >

                {!user && "🤖 "}

                {message.text}

            </div>

        </div>

    );
}