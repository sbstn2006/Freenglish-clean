"use client";

console.log("ChatbotWidget cargado");

import { useState } from "react";
import ChatButton from "./ChatButton";
import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/types/Chat";
import { sendMessage } from "@/lib/chatbot";


export default function ChatbotWidget() {


    const [open, setOpen] = useState(false);

    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "bot",
            text: "Hola 👋 Soy Freenglish AI. ¿Qué quieres aprender hoy?"
        }
    ]);

    const [loading, setLoading] = useState(false);



    async function handleSend() {

        if(!input.trim()) return;


        const userMessage: ChatMessage = {
            id: Date.now(),
            sender:"user",
            text:input
        };


        setMessages(prev => [
            ...prev,
            userMessage
        ]);


        setInput("");
        setLoading(true);



        try {

            const response = await sendMessage(input);


            const botMessage: ChatMessage = {
                id: Date.now(),
                sender:"bot",
                text:response.message
            };


            setMessages(prev => [
                ...prev,
                botMessage
            ]);


        } catch {

            setMessages(prev => [
                ...prev,
                {
                    id:Date.now(),
                    sender:"bot",
                    text:"Lo siento, ocurrió un error."
                }
            ]);

        }


        setLoading(false);

    }



    return (

        <>

        {
            open && (

            <div
            className="
            fixed
            bottom-24
            right-6
            w-96
            h-[500px]
            bg-white
            rounded-xl
            shadow-2xl
            border
            flex
            flex-col
            z-50
            "
            >


                <div className="
                bg-blue-600
                text-white
                p-4
                rounded-t-xl
                ">
                    🤖 Freenglish AI
                </div>


                <div className="
                flex-1
                overflow-y-auto
                p-4
                ">

                    {
                        messages.map(message=>(
                            <MessageBubble
                            key={message.id}
                            message={message}
                            />
                        ))
                    }


                    {
                        loading &&
                        <p>
                        🤖 Escribiendo...
                        </p>
                    }


                </div>



                <div className="
                p-3
                flex
                gap-2
                ">

                    <input
                    value={input}
                    onChange={
                        e=>setInput(e.target.value)
                    }
                    onKeyDown={
                        e=>{
                            if(e.key==="Enter")
                                handleSend()
                        }
                    }
                    className="
                    border
                    rounded
                    p-2
                    flex-1
                    "
                    placeholder="Pregunta algo..."
                    />


                    <button
                    onClick={handleSend}
                    className="
                    bg-blue-600
                    text-white
                    px-4
                    rounded
                    "
                    >
                    Enviar
                    </button>


                </div>


            </div>

            )
        }


        <ChatButton
        onClick={()=>setOpen(!open)}
        />


        </>

    );
}