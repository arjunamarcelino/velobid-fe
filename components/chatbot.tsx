"use client";

import { useEffect } from "react";
import "../styles/globals.css";

export default function N8nChat() {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "module";
        script.innerHTML = `
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
            createChat({
                webhookUrl: '${process.env.NEXT_PUBLIC_WEBHOOK_URL}',
                webhookConfig: {
                method: "POST",
                headers: {},
            },
            target: "#n8n-chat",
            mode: "window",
            chatInputKey: "chatInput",
            chatSessionKey: "sessionId",
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: "en",
            initialMessages: [
                "Hi there! 👋 I’m VeloBot, your personal guide to decentralized auctions.",
                "With VeloBid, you can experience transparent, secure, and user-first blockchain auctions — reimagined for the next generation. How can I assist you today?",
            ],
            i18n: {
                en: {
                title: "Hi there! 👋",
                subtitle: "Start a chat. We're here to help you 24/7.",
                footer: "",
                getStarted: "New Conversation",
                inputPlaceholder: "Type your question..",
                closeButtonTooltip: "Close",
                },
            },
            });
    `;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Inject CSS
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return null;
}