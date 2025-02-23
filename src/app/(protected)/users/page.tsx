
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UsersTable from "./UsersTable";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  let data:any;

  function getToken(){
    const token = session?.user.customAppToken;
    console.log("Token: "+token);
    return token;
  }

  await fetch("http://localhost:5064/api/system-admin/list", {
    method: "GET",
    headers: { "Content-Type": "application/json","Authorization": `Bearer ${getToken()}` }
  })
    .then((res) => {
      if(res.ok){
        console.log(JSON.stringify(res))
        return res.json()
      }else{
        console.log("Hata: " +getToken()+"\n"+JSON.stringify(res.body))
      }
    })
    .then((datax) => {
      data = datax;
      console.log(JSON.stringify(datax))
      // data.appJwt vb. geldiyse ister localStorage'a kaydet
    })
    .catch((err) => console.error("Error verifying token:", err))

  return (
    <UsersTable data={data}/>
  );
}
