import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";


export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  let [file, setFile] = useState()
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);





  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (currentChat.group) {
      socket.current.emit("send-msg", {
        to: currentChat,
        from: data._id,
        msg,
        file: file
      });
    } else {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
        file: file
      });
    }
    console.log(file)
    if (currentChat.group) {
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat,
        message: msg,
        file: file
      });
    }else{
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
        file: file
      });
    }
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, file: file });
    setMessages(msgs);
    setFile("")
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">

                  {message.file ? <div>
                    <p>A file has been send click below to download</p>
                    <button
                      class="tw-px-10 tw-py-4 tw-bg-blue-500 tw-rounded-full tw-drop-shadow-lg tw-text-xl tw-text-white tw-duration-300 hover:bg-blue-700"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = message.file;
                        link.download = 'filename'; // Set the desired file name here
                        link.target = '_blank'; // Open the file in a new tab/window
                        link.click();
                      }}
                    >
                      <i class="fa-solid fa-download mr-3"></i>
                      Download
                    </button>
                  </div> : null}
                  {/* <button onClick={() => {
                    window.location.href = message.file
                  }}>click here to download file</button> */}
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="tw-flex tw-bg-[#080420]">
        <input onChange={(e) => {
          // console.log(e.target.files)

          const file = e.target.files[0];

          const reader = new FileReader();
          reader.onload = function (e) {
            const base64Data = e.target.result;
            console.log(base64Data);
            setFile(base64Data)
          };
          reader.readAsDataURL(file);
          // console.log(file)
        }} type="file" name="file" id="file" className="tw-hidden" />
        <label htmlFor="file" className="tw-flex tw-items-center tw-cursor-pointer">

          <div className="tw-flex tw-items-center">
            <svg width="44px" height="44px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#6692ea" stroke="#6692ea"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M13 18.999a.974.974 0 0 0 .196.563l-1.79 1.81a5.5 5.5 0 1 1-7.778-7.78L15.185 2.159a4 4 0 0 1 5.63 5.685L10.259 18.276a2.5 2.5 0 0 1-3.526-3.545l8-7.999.706.707-8 8a1.5 1.5 0 0 0 2.116 2.126L20.111 7.132a3 3 0 1 0-4.223-4.263L4.332 14.304a4.5 4.5 0 1 0 6.364 6.364L13 18.338zM19 14h-1v4h-4v.999h4V23h1v-4.001h4V18h-4z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>
          </div>
        </label>

        <ChatInput handleSendMsg={handleSendMsg} />

      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
