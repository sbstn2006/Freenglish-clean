const API_URL = "http://localhost:4000/api/chatbot";

export async function sendMessage(message: string) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al comunicarse con el chatbot.");
    }

    return response.json();
}