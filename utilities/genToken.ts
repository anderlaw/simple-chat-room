import genServerClient from "./genServerClient";
export default (userId: string):string => {
    const serverSideClient = genServerClient()
    return serverSideClient.createToken(userId)
}