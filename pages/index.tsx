import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Channel, StreamChat} from 'stream-chat'
import {useEffect, useState} from "react";
import userName from "../utilities/userName";
import {API_KEY} from "../config/key";

const client = StreamChat.getInstance("vft9yetrruh8")

const Home: NextPage = () => {
    //username state
    const [username, setUsername] = useState<string>('')

    //当前登陆用户名
    const [loginUsername, setLoginUsername] = useState<string>('')
    //chat client
    const [chatClient, setChatClient] = useState<StreamChat | null>(null)
    const [userToken, setUserToken] = useState<string>('')
    //用户初始化状态
    const [isLogin, setIsLogin] = useState<boolean>(false)
    //用户名列表
    const [usernames, setUsernames] = useState<Array<string>>([])
    const [channelList, setChannelList] = useState<Array<{
        name: string,
        channel: Channel
    }>>([])
    //聊天
    const [channel, setChannel] = useState<Channel | null>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [messageList, setMessageList] = useState<Array<{
        username: string,
        content: string
    }>>([])


    const userInitialization = (userName: string, userToken: string) => {
        //连接用户
        const chatClient = StreamChat.getInstance(API_KEY, {
            timeout: 6000,
        })
        setChatClient(chatClient)
        chatClient.connectUser({
            id: userName,
            name: userName,
            image: 'https://i.pinimg.com/originals/a4/4a/f3/a44af3bb5f074e3cdb4be8a56232c996.jpg'
        }, userToken).then(res => {
            console.log(res);
            setIsLogin(true)
            //查询频道
            chatClient && chatClient.queryChannels({
                type: 'messaging',
                members: {$in: [userName]}
            }).then(res => {
                if(res && res.length){
                    //获取一个临时的channelid `!members-c-lScK8ryM2u9fupIZqnERp5jnDHqpvCJPlun5fOI3c`
                    setChannel(res.find(item => item.id === '!members-c-lScK8ryM2u9fupIZqnERp5jnDHqpvCJPlun5fOI3c') as any)
                }
            })
        })
    }

    //获取用户列表
    useEffect(() => {
        if (isLogin) {
            fetch('/api/userList', {
                method: 'get'
            }).then(res => res.json()).then(res => {
                if (res) {
                    setUsernames(res);
                }
            })
        }
    }, [isLogin, loginUsername])

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
                setChannel(channel)
                // setChannelList(_prev => [{
                //     name: `${myName}-${otherName}`,
                //     channel: channel
                // }].concat(_prev))
            });
        }
    }
    //监听channel的消息
    useEffect(() => {
        if (!channel) return
        channel.watch()
        channel.on(event => {
            console.log(event)
            if (event.type === 'message.new') {
                setMessageList(_prev => _prev.concat([{
                    username: (event?.user?.name) as any,
                    content: (event?.message?.text) as any
                }]))
            }
        });
    }, [channel])
    return (
        <div style={{margin: '30px'}}>
            {/* login form */}
            <h3>登陆表单：</h3>
            <div>
                <label>
                    用户名：
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                </label>
                <button onClick={() => {
                    fetch('/api/login', {
                        method: 'post',
                        body: JSON.stringify({
                            username
                        })
                    }).then(res => res.json()).then(res => {
                        if (res) {
                            //记录用户名
                            setLoginUsername(username)
                            //记录token
                            setUserToken(res.token)
                            //连接用户
                            userInitialization(username, res.token)
                        }
                    })
                }}>登陆
                </button>
            </div>
            {/* 用户列表 section */}
            {
                isLogin && <>
                    <h3>用户列表（点击开始私信）：</h3>
                    <div>
                        {
                            usernames.map(username => {
                                return <div style={{
                                    color: '#0a8de4',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    marginBottom: '6px'
                                }} key={username} onClick={() => {
                                    createChannel(loginUsername, username);
                                }}>{username}</div>
                            })
                        }
                    </div>
                </>
            }
            {/*  聊天区域  */}
            <h3>聊天区域：</h3>
            {
                channel && <div>
                    <ul>
                        {messageList.map((message,idx) => {
                            return <li key={idx}>{message.username}:{message.content}</li>
                        })}
                    </ul>
                    <textarea
                        value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter' && channel) {
                            channel.sendMessage({
                                text: inputValue
                            })
                        }
                    }} cols={30} rows={10}/>
                </div>
            }

        </div>
    )
}

export default Home
