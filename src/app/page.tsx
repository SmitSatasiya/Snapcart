import React from "react";
import connectDb from "../lib/db";
import User from "../model/user.model";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import EditRoleMobile from "./componentes/EditRoleMobile";
import Nav from "./componentes/Nav";
import UserDashboard from "./componentes/UserDashboard";
import AdminDashboard from "./componentes/AdminDashboard";
import DeliveryBoy from "./componentes/DeliveryBoy";

async function Home() {
  await connectDb();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      <Nav user={plainUser} />
      {user.role == "user" ? (
        <UserDashboard />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
}

export default Home;
