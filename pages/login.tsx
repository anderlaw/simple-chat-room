/*
1. 表单收集
2. token 写入
3. 跳转
 */

import {useEffect} from "react";
import FormData from "form-data";
import {useRouter} from "next/router";

const layoutCss = {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(/login-bg.jpeg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    paddingTop: '1px',
    textAlign:'center'
}
const loginSectionCss = {
    display:'inline-block',
    padding: '30px',
    fontSize: '16px',
    marginTop: '200px',
    borderRadius: '8px',
    backgroundColor: '#fff'
}
const formItemCss = {
    marginBottom: '14px'
}
const inputCss = {
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    height: '36px',
    fontSize: '16px',
    width:'200px'
}
const buttonCss = {
    backgroundColor: '#ccc',
    fontSize:'16px',
    height:'30px'
}
export default () => {
    const router = useRouter()
    const handleSubmit = (e: any) => {
        const formData = new FormData(e.target as HTMLFormElement)
        const values = [...(formData as any).values()]
        e.preventDefault()
        login(values[0])
    }
    const login = async (username:string) => {
        const response = await fetch('/api/login', {
            method: 'post',
            body: JSON.stringify({
                username
            })
        })
        const parsedRes =  await response.json()
        if(parsedRes){
            //记录用户名
            localStorage.setItem('username',username)
            //记录token
            localStorage.setItem('token',parsedRes.token)
            //go to index page
            router.push('/')
        }
    }
    return <div style={layoutCss}>
        {/*   login section  */}
        <form style={loginSectionCss} onSubmit={handleSubmit}>
            <div style={formItemCss}>
                <label>
                    <span>用户名：</span>
                    <input style={inputCss} name='username' type="text"/>
                </label>
            </div>
            <div style={formItemCss}>
                <label>
                    <span>用户名：</span>
                    <input style={inputCss} name='password' type="password"/>
                </label>
            </div>
            <div style={{ textAlign:'right' }}>
                <button style={buttonCss} typeof='submit'>提交</button>
            </div>
        </form>

    </div>
}