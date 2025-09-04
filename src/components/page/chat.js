"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendHorizontal,
  Loader2,
  Plus,
  User,
  Bot,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast, Toaster } from "react-hot-toast";
import Sbtelogo from "../assets/images/sbtelogo.png";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Avatar,
  Divider,
  useMediaQuery,
} from "@mui/material";

const API_URL = "https://sbtechatbotapi.anantdrishti.com";

const Question = ({ text, handleQuickSend }) => (
  <Button
    variant="contained"
    onClick={() => handleQuickSend(text)}
    sx={{
      background: "linear-gradient(to right, #14b8a6, #10b981)",
      color: "white",
      textTransform: "none",
      borderRadius: 50,
      px: 2,
      py: 1,
      fontSize: "0.75rem",
      fontWeight: 500,
      "&:hover": {
        background: "linear-gradient(to right, #0d9488, #059669)",
      },
    }}
  >
    {text}
  </Button>
);

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [matchedQuestion, setMatchedQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const matchedQuestionTimeoutRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const getSuggestedQuestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/question/suggest/3`);
        setSuggestedQuestions(response.data.questions.map((q) => q.question));
      } catch (error) {
        toast.error("Failed to fetch suggested questions");
      }
    };
    getSuggestedQuestions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (userInput.trim()) {
      clearTimeout(matchedQuestionTimeoutRef.current);
      matchedQuestionTimeoutRef.current = setTimeout(() => {
        fetchMatchedQuestion(userInput);
      }, 500);
    } else {
      setMatchedQuestion("");
    }
    return () => clearTimeout(matchedQuestionTimeoutRef.current);
  }, [userInput]);

  const fetchMatchedQuestion = async (input) => {
    try {
      const response = await axios.post(`${API_URL}/question/suggest/match`, {
        input,
      });
      setMatchedQuestion(response.data.matchedQuestion || "");
    } catch (error) {
      setMatchedQuestion("");
    }
  };

  const handleSend = async (text = "", sender = "user") => {
    if ((isSending && sender === "user") || (!text.trim() && sender === "user"))
      return;

    setUserInput("");
    setMatchedQuestion("");
    setMessages((prev) => [...prev, { type: sender, message: text }]);

    if (sender === "user") {
      setIsSending(true);
      try {
        const response = await axios.post(`${API_URL}/response`, {
          question: text,
          isFirst: isFirst,
        });
        const answer = response?.data?.answer || "Something went wrong";
        setMessages((prev) => [...prev, { type: "bot", message: answer }]);
        setIsFirst(false);
      } catch (error) {
        toast.error("Sorry, something went wrong!");
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            message: "Sorry, something went wrong!",
            isError: true,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    }
  };

  const newChat = () => {
    setMessages([]);
    setUserInput("");
    setIsFirst(true);
    setMatchedQuestion("");
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* 
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1500,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to right, #14b8a6, #10b981)",
            color: "white",
            fontWeight: "bold",
            px: 2,
            py: 0.5,
            fontSize: "0.75rem",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "inline-block",
            marginBottom: "6px",
            letterSpacing: "0.5px",
            // textTransform: "uppercase",
          }}
        >
          Chat with us
        </Box>
        <IconButton
          sx={{
            background: "linear-gradient(to right, #14b8a6, #10b981)",
            color: "white",
            width: 56,
            height: 56,
            "&:hover": {
              background: "linear-gradient(to right, #0d9488, #059669)",
            },
          }}
        >
          <Bot size={28} />
        </IconButton>
      </motion.div> */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            background: "#10b981",
            color: "white",
            fontWeight: "bold",
            px: 1.5,
            py: 0.5,
            fontSize: "0.75rem",
            borderRadius: "8px",
            marginBottom: "6px",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
            // textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Chat with us
        </Box>

        <IconButton
          sx={{
            background: "linear-gradient(to right, #14b8a6, #10b981)",
            color: "white",
            width: 56,
            height: 56,
            "&:hover": {
              background: "linear-gradient(to right, #0d9488, #059669)",
            },
          }}
        >
          <Bot size={28} />
        </IconButton>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: 90,
              right: 24,
              width: isSmallScreen ? "70%" : 400,
              marginRight: isSmallScreen ? 30 : 40,
              maxHeight: 600,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1500,
            }}
          >
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar src={Sbtelogo} sx={{ width: 36, height: 36 }} />
              <Typography variant="h6" color="teal">
                SBTE AI Chatbot
              </Typography>
              <IconButton
                onClick={newChat}
                sx={{ backgroundColor: "teal", color: "white" }}
              >
                <Plus size={18} />
              </IconButton>
            </Box>
            <Divider />
            <Box ref={messagesContainerRef} flex={1} overflow="auto" p={2}>
              {messages.length === 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <Bot size={48} color="#14b8a6" />
                  {suggestedQuestions.map((q, i) => (
                    <Question key={i} text={q} handleQuickSend={handleSend} />
                  ))}
                </Box>
              )}
              <AnimatePresence>
                {messages.map((message, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      justifyContent:
                        message.type === "user" ? "flex-end" : "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        maxWidth: "85%",
                        flexDirection:
                          message.type === "user" ? "row-reverse" : "row",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            message.type === "user" ? "#14b8a6" : "#06b6d4",
                          width: 36,
                          height: 36,
                        }}
                      >
                        {message.type === "user" ? (
                          <User size={18} color="white" />
                        ) : (
                          <Bot size={18} color="white" />
                        )}
                      </Avatar>
                      <Paper
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor:
                            message.type === "user" ? "#14b8a6" : "#f3f4f6",
                          color: message.type === "user" ? "white" : "#111827",
                          fontSize: 14,
                        }}
                      >
                        {message.type === "bot" ? (
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {message.message}
                          </Markdown>
                        ) : (
                          message.message
                        )}
                      </Paper>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isSending && (
                <Box mt={2}>
                  <Loader2 className="animate-spin" color="#14b8a6" />
                </Box>
              )}
            </Box>
            <Divider />
            <Box p={2}>
              {matchedQuestion && (
                <Box mb={1}>
                  <Question
                    text={matchedQuestion}
                    handleQuickSend={handleSend}
                  />
                </Box>
              )}
              <Box display="flex" gap={1}>
                <InputBase
                  fullWidth
                  placeholder="Ask something..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(userInput)}
                  inputRef={inputRef}
                  sx={{
                    px: 2,
                    py: 1,
                    border: "1px solid #ccc",
                    borderRadius: 50,
                    fontSize: 14,
                    flex: 1,
                  }}
                />
                <IconButton
                  onClick={() => handleSend(userInput)}
                  disabled={isSending}
                  sx={{
                    backgroundColor: isSending ? "#e5e7eb" : "#14b8a6",
                    color: "white",
                    borderRadius: 50,
                  }}
                >
                  <SendHorizontal size={18} />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                color="textSecondary"
                align="center"
                mt={1}
              >
                *SBTE AI Chatbot may make mistakes.
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
