import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {Channel, MessageResponse, StreamChat} from 'stream-chat'
import {FC, useEffect, useState} from "react";
import userName from "../utilities/userName";
import {API_KEY} from "../config/key";
import {useRouter} from "next/router";
import {Avatar} from "../components/Avatar";
import {MessageBox} from "../components/MessageBox";
import {ChatBox} from "../components/ChatBox";

const ChannelBox: FC<{
    leftEle: JSX.Element,
    rightEle: JSX.Element | null
}> = (props) => {
    return <div style={{display: 'flex', height: '400px', boxShadow: '0px 0px 5px #ccc'}}>
        <div style={{width: '100px', overflowY: 'auto', padding: '16px'}}>
            {props.leftEle}
        </div>
        <div style={{flexGrow: 1, overflowY: 'auto', backgroundColor: '#f3f3f38c'}}>
            {props.rightEle}
        </div>
    </div>
}
const Home: NextPage = () => {
    const router = useRouter()
    //auth information
    const [username, setUsername] = useState<string>('')
    const [userInfo, setUserInfo] = useState<{
        id: string,
        name: string,
        online: boolean,
        role: 'user' | 'admin',
        image: string
    } | null>(null)
    const [chatClient, setChatClient] = useState<StreamChat | null>(null)

    //频道信息
    const [curChannel, setCurChannel] = useState<Channel | null>(null)


    const [channel, setChannel] = useState<Array<Channel>>([])
    const [channelList, setChannelList] = useState<Array<Channel>>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [messageList, setMessageList] = useState<Array<MessageResponse>>([])

    //authorization && chatclient && user connection
    useEffect(() => {
        const username = localStorage.getItem('username')
        const token = localStorage.getItem('token')
        if (!username || !token) {
            //to login page
            router.push('/login')
        } else {
            //set username
            setUsername(username)
            //init channel
            const chatClient = initChatClient()
            if (chatClient) {
                //set to state
                setChatClient(chatClient)
                //connect to user
                chatClient.connectUser({
                    id: username,
                    name: username,
                    image: 'https://i.pinimg.com/originals/a4/4a/f3/a44af3bb5f074e3cdb4be8a56232c996.jpg'
                }, token).then(res => {
                    //记录用户信息
                    setUserInfo((res as any).me)
                }, err => {
                    console.log(err)
                })
            }
        }
    })
    //获取频道
    useEffect(() => {
        if (chatClient && username) {
            chatClient.queryChannels({
                type: 'messaging',
                members: {$in: [username]}
            }).then(res => {
                if (res && res.length) {
                    debugger
                    setChannelList(res)
                }
            })
        }
    }, [chatClient, username])
    const initChatClient = () => {
        let chatClient: StreamChat | null = null
        try {
            chatClient = StreamChat.getInstance(API_KEY, {
                timeout: 6000,
            })
        } catch (e) {
            console.error(e)
            chatClient = null
        }
        return chatClient
    }
    //获取用户列表
    //获取频道下的消息
    useEffect(() => {
        if (curChannel) {
            setMessageList(curChannel.state.messages as any)
            curChannel.watch()
            curChannel.on(event => {
                console.log(event)
                if (event.type === 'message.new') {
                    setMessageList(_prev => _prev.concat(event.message as any))
                }
            });
        }
    }, [curChannel])
    // useEffect(() => {
    //     if (isLogin) {
    //         fetch('/api/userList', {
    //             method: 'get'
    //         }).then(res => res.json()).then(res => {
    //             if (res) {
    //                 setUsernames(res);
    //             }
    //         })
    //     }
    // }, [isLogin, loginUsername])

    //创建频道并邀请一个人
    const createChannel = (myName: string, otherName: string) => {
        if (chatClient) {
            const channel = chatClient.channel('messaging', {
                members: [myName, otherName],
            })
            // const channel = chatClient.channel('messaging', `${myName}-${otherName}`, {
            //     name: `${myName}-${otherName}`
            // })
            channel.create().then(res => {
                // setChannel(channel)
                // setChannelList(_prev => [{
                //     name: `${myName}-${otherName}`,
                //     channel: channel
                // }].concat(_prev))
            });
        }
    }
    return (
        <div style={{margin: '30px'}}>
            <div>
                <h3>{userInfo?.name}</h3>
                <Avatar src={userInfo?.image || ''}/>
            </div>
            <ChannelBox
                leftEle={<div>
                    {channelList.map((channel, indx) => {
                        return <div style={{cursor: 'pointer', lineHeight: '30px'}}
                                    onClick={() => setCurChannel(channel)} key={channel?.cid}>{`频道${indx + 1}`}</div>
                    })}
                </div>}
                rightEle={curChannel ? <div style={{position: 'relative'}}>
                    {/* usernames in this channel */}
                    <div style={{
                        lineHeight: '30px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: '#ccc',
                        textAlign: 'center'
                    }}>
                        {Object.keys(curChannel.state.members).join(',')}
                        {
                            // curChannel.state.messages
                        }
                    </div>
                    <MessageBox messageList={messageList.map((item: any) => {
                        return {
                            nickname: item.user.name,
                            avatarSrc: item.user.image,
                            isMyMessage: item.user.id === userInfo?.id,
                            messageContent: item.text
                        }
                    })}/>
                    {/*  聊天区域  */}
                    <ChatBox onEnter={(newVal) => {
                        curChannel?.sendMessage({
                            text: newVal
                        })
                    }}/>
                </div> : null}
            />
        </div>
    )
}

export default Home
