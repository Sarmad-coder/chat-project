import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { toast } from 'react-toastify';
import { host, allUsersRoute } from "../utils/APIRoutes";
import axios from "axios";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupMember, setgroupMember] = useState([]);
  const [group, setgroup] = useState([]);
  const sIndex=contacts.length
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  useEffect(async () => {
    let response
    try {
      response = await axios.get(host + "/group/getAll");
      // Handle the response data or perform any necessary operations
      console.log(response.data.data);
      setgroup(response.data.data)
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Central Controlling</h3>
          </div>
          <div className="contacts">

            <div>
              <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="tw-bg-blue-500 tw-hover:bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-full">
                Create Group +
              </button>
            </div>
            {contacts.map((contact, index) => {
              // setSIndex(index)
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
            {group.map((data, index) => {
              index=index+sIndex
              return (
                <div
                  key={data._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => changeCurrentChat(index, data)}
                >
                  <div className="avatar">
                    {/* <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    /> */}
                  </div>
                  <div className="username">
                    {data.group.map((contact) => {
                      return <h3>{contact.username}</h3>
                    })}

                  </div>
                </div>
              );
            })}

          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>




          {/* Model  */}

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Add Members To Create Group</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                  <div className="contacts">
                    {contacts.map((contact, index) => {
                      return (
                        <div
                          key={contact._id}
                          className={"contact selected"}
                          onClick={() => {
                            let box = document.getElementsByClassName("checkbox")
                            if (box[index].checked) {

                              box[index].checked = false
                            } else {
                              box[index].checked = true
                            }
                          }}
                        >

                          <input id="select" className="checkbox" value={contact._id} type="checkbox" />
                          <div className="avatar">
                            <img
                              src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                              alt=""
                            />
                          </div>
                          <div className="username">
                            <h3 className="!tw-text-slate-950">{contact.username}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>


                </div>
                <div class="modal-footer">
                  <button type="button" class="tw-bg-gray-500 tw-hover:bg-gray-700 btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary tw-bg-blue-500 tw-hover:bg-blue-700" data-bs-dismiss="modal" onClick={async () => {
                    let box = document.getElementsByClassName("checkbox")
                    Array.from(box).forEach(element => {
                      if (element.checked) {
                        groupMember.push(element.value)
                      }
                    });
                    setgroupMember(groupMember)
                    console.log(groupMember)
                    if (groupMember.length > 1) {
                      try {
                        let response = await axios.post(host + "/group/create", { "group": groupMember });
                        // Handle the response data or perform any necessary operations
                        console.log(response.data);
                        setgroupMember([])
                        toast.success("Group is created successfully")
                      } catch (error) {
                        console.log(error);
                      }

                    } else {
                      toast.error("select more then one member")
                    }
                  }}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
