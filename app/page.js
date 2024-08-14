'use client';
import { Box, Stack, TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Darker brown color for the "Send" button and user input
    },
    secondary: {
      main: '#FF8C00', // Darker orange color for the chatbot replies
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // More modern and readable font
  },
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I’m your Personal ChatBot. How can I assist you today?',
    }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Update UI with user's message
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    setMessage('');

    try {
      // Send message to the API
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message }]
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // Parse the response as JSON
      const data = await response.json();

      // Update UI with assistant's response
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = data.content;
        return newMessages;
      });

    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, something went wrong.' }
      ]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#F5F5F5" /* Light gray background */
      >
        <Stack
          direction="column"
          width="600px"
          height="700px"
          border="1px solid #E0E0E0" /* Light border */
          p={2}
          spacing={2}
          borderRadius={8} /* Slightly rounded corners */
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)" /* Subtle shadow for depth */
          bgcolor="white" /* White background for the chat container */
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                display='flex'
                justifyContent={
                  msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={msg.role === 'assistant' ? 'secondary.main' : 'primary.main'}
                  color="white"
                  p={2} /* Slightly reduced padding */
                  borderRadius={16}
                  maxWidth="70%" /* Limit message bubble width */
                  boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)" /* Subtle shadow for message bubbles */
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Type a message..."
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white' }} /* White background for input */
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{ minWidth: '100px', fontWeight: 'bold' }} /* Consistent button size and bold text */
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
