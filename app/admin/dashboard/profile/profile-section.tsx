"use client"

import type React from "react"
import Image from 'next/image';                                                  
                                                                                                
import { useState,useEffect } from "react"
import { Eye, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dailog" 
import { accountData, teamMembers, commentData } from "@/data/profile"                                            

export default function ProfilePage() {
  const [showComments, setShowComments] = useState(false) 
  const [showPassword, setShowPassword] = useState(false)
  const [commentText, setCommentText] = useState("")


   //  New dynamic profile state
 const [profileData, setProfileData] = useState<{    
  name: string | null;
  email: string | null;
  bio?: string | null;
  mobile?: string | null;
} | null>(null);


  // Function to handle image errors and provide fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=40&width=40"
  }

  const handlePostComment = () => {
    console.log("Posted comment:", commentText)
    setCommentText("")
  }

   //  New dynamic fetch effect
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/auth/admin-profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch profile"); 
      }
    };

    fetchProfile();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-6 flex items-center justify-between relative h-[100px] rounded-[15px] border border-white/70 overflow-hidden shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 w-full h-full opacity-100 overflow-hidden">
          <Image
            src="/background/Rectangle 41.png"
            alt="Background"
            fill
            className="object-cover"
            quality={80}
            priority={false}
          />
        </div>
        
        <div className="absolute inset-0 backdrop-blur-[12px] bg-white/40"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/60 backdrop-blur-sm relative">
            <Image
              src={ "/placeholder.svg"}
              alt="Profile"
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </div>
          <div>
            <h1 className="font-medium text-lg text-gray-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              {profileData?.name || "Loading..."}
            </h1>
            <p className="text-base text-gray-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              {profileData?.email || "Loading..."}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="rounded-full bg-white/80 text-sm px-5 py-2 h-10 border-white/60 relative z-10 hover:bg-white backdrop-blur-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        >
          <span className="font-medium">OVERVIEW</span>
        </Button>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto p-4 mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Profile Information</h2>
          <p className="text-sm text-gray-600 mb-6">{profileData?.bio || "Loading"}</p>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Full Name:</span>
              <span className="text-sm text-gray-600 col-span-2"> {profileData?.name || "Loading..."}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Mobile:</span>
              <span className="text-sm text-gray-600 col-span-2">{profileData?.mobile || "Loading..."}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-gray-600 col-span-2"> {profileData?.email || "Loading..."}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm text-gray-600 col-span-2">{accountData.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Social Media:</span>
              <div className="flex gap-2 col-span-2">
                <button className="text-teal-500 hover:text-teal-600">
                  <Facebook size={16} />
                </button>
                <button className="text-teal-500 hover:text-teal-600">
                  <Twitter size={16} />
                </button>
                <button className="text-teal-500 hover:text-teal-600">
                  <Instagram size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Account Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Username:</span>
              <span className="text-sm text-gray-600 col-span-2">{accountData.username}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Password:</span>
              <div className="flex items-center col-span-2">
                <span className="text-sm text-gray-600 mr-2">{showPassword ? accountData.password : "••••••••"}</span>
                <button onClick={() => setShowPassword(!showPassword)} className="text-teal-500 hover:text-teal-600">
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Role:</span>
              <span className="text-sm text-gray-600 col-span-2">{accountData.role}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm text-gray-600 col-span-2">{accountData.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Account Status:</span>
              <span className="text-sm text-gray-600 col-span-2">{accountData.status}</span>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/background/Icon.svg"
              alt="Team icon"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <h2 className="text-lg font-bold">TEAM</h2>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full overflow-hidden ${member.avatarColor}`}>
                    <Image
                      src={member.avatarUrl || "/placeholder.svg"}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">Last logged in at {member.lastLoggedIn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5">
                      <Image
                        src="/background/Apple Notes Application (1).png"
                        alt="Notes"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="h-6 text-xs text-teal-500 hover:text-teal-600 hover:bg-transparent"
                      onClick={() => {
                        setShowComments(true)
                      }}
                    >
                      DETAILS
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Comments</DialogTitle>
          <div className="border rounded-lg p-4 mt-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={commentData.authorAvatar || "/placeholder.svg"}
                  alt={commentData.author}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover" 
                  onError={handleImageError}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{commentData.author}</p>
              </div>
            </div>

            {/* New Comment Input */}
            <div className="mt-4 space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 rounded-md text-sm focus:ring-2 focus:ring-light-green focus:outline-none bg-transparent"
                rows={3}
                placeholder="Write your comment here..."
              />
              <div className="flex justify-center gap-2">
                <Button onClick={handlePostComment} className="bg-light-green hover:bg-light-green text-white">
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}