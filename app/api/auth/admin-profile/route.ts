//  File: app/api/auth/admin-profile/route.ts (profile-section)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log("SESSION:", session)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.id) {
    console.log("Session user has no ID!")
     return NextResponse.json({ error: "Session user has no id" }, { status: 401 })
  }     

  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true, 
      bio: true      
    },
  });

      console.log("USER:", user)


  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 }); 
  }

  return NextResponse.json(user);
}
