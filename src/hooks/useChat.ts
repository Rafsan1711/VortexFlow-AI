import { useState, useEffect, useCallback } from 'react';
import { ref, push, set, update, remove, onValue, get, serverTimestamp, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { Chat, Message } from '../types';
import { sendMessage as geminiSendMessage, countTokens, generateTitle } from '../lib/gemini';

export const useChat = () => {
  const { user, setChats, activeChatId, setActiveChatId, settings, addToast, chatSettings, setConnectionState, isOnline } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  // Listen for chats
  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    const chatsRef = query(ref(db, `chats/${user.uid}`), orderByChild('updatedAt'));
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatList: Chat[] = Object.values(data);
        // Sort by updatedAt desc
        chatList.sort((a, b) => b.updatedAt - a.updatedAt);
        setChats(chatList);
      } else {
        setChats([]);
      }
    });

    return () => unsubscribe();
  }, [user, setChats]);

  const createNewChat = useCallback(async (title: string = 'New Chat') => {
    if (!user) return '';
    setConnectionState(isOnline, true);

    try {
      const newChatRef = push(ref(db, `chats/${user.uid}`));
      const chatId = newChatRef.key;
      
      if (!chatId) throw new Error('Failed to generate chat ID');

      const newChat: Chat = {
        id: chatId,
        title,
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        model: settings.model,
        messageCount: 0,
        pinned: false
      };

      await set(newChatRef, newChat);
      setActiveChatId(chatId);
      return chatId;
    } catch (error) {
      console.error('Error creating chat:', error);
      addToast({ type: 'error', message: 'Failed to create new chat' });
      return '';
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, settings, setActiveChatId, addToast, setConnectionState, isOnline]);

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      await update(ref(db, `chats/${user.uid}/${chatId}`), {
        title,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating chat title:', error);
      addToast({ type: 'error', message: 'Failed to update chat title' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, setConnectionState, isOnline]);

  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      await remove(ref(db, `chats/${user.uid}/${chatId}`));
      await remove(ref(db, `messages/${user.uid}/${chatId}`));
      await remove(ref(db, `feedback/${user.uid}/${chatId}`));
      
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      addToast({ type: 'success', message: 'Chat deleted' });
    } catch (error) {
      console.error('Error deleting chat:', error);
      addToast({ type: 'error', message: 'Failed to delete chat' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, activeChatId, setActiveChatId, addToast, setConnectionState, isOnline]);

  const pinChat = useCallback(async (chatId: string, isPinned: boolean) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      await update(ref(db, `chats/${user.uid}/${chatId}`), {
        pinned: isPinned,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error pinning chat:', error);
      addToast({ type: 'error', message: 'Failed to pin chat' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, setConnectionState, isOnline]);

  const duplicateChat = useCallback(async (chatId: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      const chatRef = ref(db, `chats/${user.uid}/${chatId}`);
      const chatSnapshot = await get(chatRef);
      if (!chatSnapshot.exists()) return;
      
      const chatData = chatSnapshot.val() as Chat;
      
      const messagesRef = ref(db, `messages/${user.uid}/${chatId}`);
      const messagesSnapshot = await get(messagesRef);
      const messagesData = messagesSnapshot.val() || {};

      const newChatId = await createNewChat(`${chatData.title} (Copy)`);
      if (!newChatId) return;

      if (Object.keys(messagesData).length > 0) {
        await set(ref(db, `messages/${user.uid}/${newChatId}`), messagesData);
        await update(ref(db, `chats/${user.uid}/${newChatId}`), {
          messageCount: Object.keys(messagesData).length,
          model: chatData.model || settings.model
        });
      }
      
      addToast({ type: 'success', message: 'Chat duplicated' });
      return newChatId;
    } catch (error) {
      console.error('Error duplicating chat:', error);
      addToast({ type: 'error', message: 'Failed to duplicate chat' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, createNewChat, settings.model, addToast, setConnectionState, isOnline]);

  const submitFeedback = useCallback(async (chatId: string, msgId: string, type: 'like' | 'dislike', comment?: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      await set(ref(db, `feedback/${user.uid}/${chatId}/${msgId}`), {
        type,
        timestamp: serverTimestamp(),
        ...(comment && { comment })
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      addToast({ type: 'error', message: 'Failed to submit feedback' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, setConnectionState, isOnline]);

  const _runAI = async (chatId: string, messages: Message[]) => {
    if (!user) return;
    setStreaming(true);
    setConnectionState(isOnline, true);
    try {
      const messagesRef = ref(db, `messages/${user.uid}/${chatId}`);
      const aiMessageRef = push(messagesRef);
      const aiMessageId = aiMessageRef.key;
      
      if (!aiMessageId) throw new Error('Failed to generate AI message ID');

      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        tokens: 0
      };

      await set(aiMessageRef, aiMessage);

      let fullContent = '';
      const currentSettings = chatSettings[chatId] || settings;
      const stream = geminiSendMessage(messages, currentSettings);

      for await (const chunk of stream) {
        fullContent += chunk;
        await update(aiMessageRef, { content: fullContent });
      }

      await update(aiMessageRef, {
        content: fullContent,
        tokens: await countTokens(fullContent)
      });

      // Auto-title generation if this is the first AI response (2 messages total)
      if (messages.length === 1) { // 1 user message passed to AI
        try {
          const generatedTitle = await generateTitle(messages[0].content, currentSettings);
          if (generatedTitle) {
            await updateChatTitle(chatId, generatedTitle);
          }
        } catch (e) {
          console.error("Failed to generate title", e);
        }
      }

    } catch (error) {
      console.error('Error in AI run:', error);
      addToast({ type: 'error', message: 'Failed to get AI response' });
    } finally {
      setStreaming(false);
      setConnectionState(isOnline, false);
    }
  };

  const sendMessage = useCallback(async (chatId: string, content: string, imageUrl?: string | null) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      const messagesRef = ref(db, `messages/${user.uid}/${chatId}`);
      const newMessageRef = push(messagesRef);
      const messageId = newMessageRef.key;
      
      if (!messageId) throw new Error('Failed to generate message ID');

      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content,
        timestamp: Date.now(),
        tokens: await countTokens(content),
        ...(imageUrl && { imageUrl })
      };

      await set(newMessageRef, userMessage);

      // Get history
      const snapshot = await get(messagesRef);
      const messages: Message[] = [];
      snapshot.forEach((child) => { messages.push(child.val()); });
      messages.sort((a, b) => a.timestamp - b.timestamp);

      await update(ref(db, `chats/${user.uid}/${chatId}`), {
        updatedAt: serverTimestamp(),
        messageCount: messages.length + 1
      });

      await _runAI(chatId, messages);

    } catch (error) {
      console.error('Error sending message:', error);
      addToast({ type: 'error', message: 'Failed to send message' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, chatSettings, settings, updateChatTitle, setConnectionState, isOnline]);

  const editMessage = useCallback(async (chatId: string, msgId: string, newContent: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      const messagesRef = ref(db, `messages/${user.uid}/${chatId}`);
      const snapshot = await get(messagesRef);
      const messages: Message[] = [];
      snapshot.forEach((child) => { messages.push(child.val()); });
      messages.sort((a, b) => a.timestamp - b.timestamp);

      const msgIndex = messages.findIndex(m => m.id === msgId);
      if (msgIndex === -1) return;

      // Delete all subsequent messages
      const messagesToDelete = messages.slice(msgIndex + 1);
      for (const msg of messagesToDelete) {
        await remove(ref(db, `messages/${user.uid}/${chatId}/${msg.id}`));
      }

      // Update the edited message
      await update(ref(db, `messages/${user.uid}/${chatId}/${msgId}`), {
        content: newContent,
        edited: true,
        tokens: await countTokens(newContent)
      });

      // Re-run AI with truncated history
      const truncatedHistory = messages.slice(0, msgIndex);
      const updatedMessage = { ...messages[msgIndex], content: newContent, edited: true };
      
      await update(ref(db, `chats/${user.uid}/${chatId}`), {
        updatedAt: serverTimestamp(),
        messageCount: truncatedHistory.length + 2
      });

      await _runAI(chatId, [...truncatedHistory, updatedMessage]);

    } catch (error) {
      console.error('Error editing message:', error);
      addToast({ type: 'error', message: 'Failed to edit message' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, chatSettings, settings, setConnectionState, isOnline]);

  const regenerateMessage = useCallback(async (chatId: string) => {
    if (!user) return;
    setConnectionState(isOnline, true);
    try {
      const messagesRef = ref(db, `messages/${user.uid}/${chatId}`);
      const snapshot = await get(messagesRef);
      const messages: Message[] = [];
      snapshot.forEach((child) => { messages.push(child.val()); });
      messages.sort((a, b) => a.timestamp - b.timestamp);

      if (messages.length === 0) return;

      const lastMsg = messages[messages.length - 1];
      let historyToRun = messages;

      if (lastMsg.role === 'assistant') {
        // Delete last AI message
        await remove(ref(db, `messages/${user.uid}/${chatId}/${lastMsg.id}`));
        historyToRun = messages.slice(0, -1);
      }

      if (historyToRun.length === 0) return;

      await _runAI(chatId, historyToRun);

    } catch (error) {
      console.error('Error regenerating message:', error);
      addToast({ type: 'error', message: 'Failed to regenerate message' });
    } finally {
      setConnectionState(isOnline, false);
    }
  }, [user, addToast, chatSettings, settings, setConnectionState, isOnline]);

  return {
    createNewChat,
    updateChatTitle,
    deleteChat,
    pinChat,
    duplicateChat,
    sendMessage,
    editMessage,
    regenerateMessage,
    submitFeedback,
    loading,
    streaming
  };
};
