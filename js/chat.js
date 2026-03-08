// AI Chat Module - Client-side OpenRouter
(function() {
    'use strict';

    const API_KEY = "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";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";
    
    const sivaContext = `You are the AI Digital Twin of Sivachandar (Siva) Bagavathiappan. Respond in a professional, highly articulate, authoritative yet approachable executive tone (like an experienced VP or Senior Director). Keep answers concise and strictly relevant to his resume. 
Background:
- 25 years of IT/Ecommerce application development experience.
- Roles: Director of Product and Technology (International) at American Eagle Outfitters (July 2024-Present). Sr. Director of Application Development at FreshDirect (2007-2024). Consultant at Bahwan CyberTek/Covansys (2005-2007). Module Leader at Wipro (2001-2005).
- Education: B.Tech Automobile Engineering (Anna University), PG Diploma in Business Admin (Symbiosis).
- Skills: Java, .Net, NextJS, React, NodeJS, Kubernetes, Kafka, MongoDB, GCP, AWS, Azure, Shopify, Bloomreach, Manhattan WMS.
- Achievements: Scaled FreshDirect's business by 43%. Managed $5M budgets and teams of 50+. Won Webby Awards for Best User Experience. Delivered critical outbreak management systems for NY DOH.`;

    let conversationHistory = [
        { role: 'system', content: sivaContext }
    ];

    // Modal Functions
    window.openChatModal = function() {
        const modal = document.getElementById('ai-modal');
        const modalContent = document.getElementById('ai-modal-content');
        if (!modal || !modalContent) return;

        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95', 'translate-y-4');
        
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    };

    window.closeChatModal = function() {
        const modal = document.getElementById('ai-modal');
        const modalContent = document.getElementById('ai-modal-content');
        if (!modal || !modalContent) return;

        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95', 'translate-y-4');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }, 400);
    };

    // Message Rendering
    function appendMessage(role, text) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const isUser = role === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-md ${isUser ? 'bg-brand-accent text-white font-medium' : 'bg-brand-ink text-brand-accent'}`;
        avatar.innerHTML = isUser ? 'You' : '<i class="fas fa-robot"></i>';

        const bubble = document.createElement('div');
        bubble.className = `p-5 rounded-2xl shadow-sm text-[15px] font-light leading-relaxed max-w-[85%] ${isUser ? 'bg-brand-ink text-white rounded-tr-sm' : 'bg-white border border-black/5 text-brand-ink rounded-tl-sm'}`;
        bubble.innerHTML = text;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = 'flex gap-4';
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-brand-ink text-brand-accent flex items-center justify-center flex-shrink-0 text-xs shadow-md">
                <i class="fas fa-robot"></i>
            </div>
            <div class="bg-white p-5 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 text-brand-ink max-w-[85%] flex items-center">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    // API Call
    async function sendMessage(message) {
        conversationHistory.push({ role: 'user', content: message });

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Sivachandar Resume'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        
        if (text) {
            conversationHistory.push({ role: 'assistant', content: text });
        }
        
        return text;
    }

    // Handle Form Submit
    window.handleChatSubmit = async function(e) {
        e.preventDefault();
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        chatInput.value = '';
        const typingId = appendTypingIndicator();

        try {
            const responseText = await sendMessage(message);
            document.getElementById(typingId)?.remove();
            
            if (responseText) {
                const formattedText = responseText.replace(/\n/g, '<br>');
                appendMessage('model', formattedText);
            } else {
                appendMessage('model', '<span class="text-red-500">No response received.</span>');
            }
        } catch (error) {
            document.getElementById(typingId)?.remove();
            appendMessage('model', '<span class="text-red-500">AI temporarily unavailable. Please try again.</span>');
            console.error(error);
        }
    };

    // Job Fit Evaluation
    window.evaluateFit = async function() {
        const jdInput = document.getElementById('jd-input')?.value.trim();
        const btn = document.getElementById('evaluate-btn');
        const resultBox = document.getElementById('evaluation-result');
        const resultContent = document.getElementById('evaluation-content');

        if (!jdInput || !btn || !resultBox || !resultContent) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        
        resultBox.classList.remove('hidden');
        resultContent.innerHTML = '<div class="typing-indicator my-2"><span></span><span></span><span></span></div>';

        const promptText = `Analyze the following Job Description against Sivachandar Bagavathiappan's profile. Write a concise, 3-paragraph executive summary explaining why he is a strong fit. Use an objective, highly professional tone. Highlight specific matching skills. Format the output with clear HTML paragraphs (<p>). Do not use markdown backticks.\n\nJob Description: ${jdInput}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Sivachandar Resume'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-001',
                    messages: [
                        { role: 'system', content: sivaContext },
                        { role: 'user', content: promptText }
                    ]
                })
            });

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            resultContent.innerHTML = text || '<p>Analysis complete, but no text was generated.</p>';
        } catch (error) {
            resultContent.innerHTML = '<p class="text-red-500">Error generating analysis. Please try again.</p>';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-magic text-brand-accent group-hover:rotate-12 transition-transform"></i> Generate Alignment Brief';
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    };

    // Initialize chat form listener
    document.addEventListener('DOMContentLoaded', () => {
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', window.handleChatSubmit);
        }
    });
})();
