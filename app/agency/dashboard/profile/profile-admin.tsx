"use client"

import type React from "react"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Eye, Facebook, Twitter, Instagram } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

import { profileData, accountData, teamMembers, commentData, companyInformation } from "@/data/admin-profile"

export default function ProfilePage() {
  const [showComments, setShowComments] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [color, setColor] = useState("#0F9D58")
  const [tempColor, setTempColor] = useState("#0F9D58")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=40&width=40"
  }

  const handlePostComment = () => {
    console.log("Posted comment:", commentText)
    setCommentText("")
  }

  return (
    <div className="min-h-screen ">
      {/* Profile Header */}
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
                src={profileData.avatarUrl || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
                onError={handleImageError}
              />
            </div>
            <div>
              <h1 className="font-medium text-lg text-gray-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {profileData.name}
              </h1>
              <p className="text-base text-gray-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {profileData.email}
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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <p className="text-sm text-gray-600 mb-6">{profileData.bio}</p>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Full Name:</span>
                <span className="text-sm text-gray-600 col-span-2">{profileData.fullName}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Mobile:</span>
                <span className="text-sm text-gray-600 col-span-2">{profileData.mobile}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-gray-600 col-span-2">{profileData.email}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm text-gray-600 col-span-2">{profileData.location}</span>
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Username:</span>
                <span className="text-sm text-gray-600 col-span-2 flex items-center">
                  {accountData.username}
                  <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-teal-500 rounded-full">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Password:</span>
                <div className="flex items-center col-span-2">
                  <span className="text-sm text-gray-600 mr-2">
                    {showPassword ? "password123" : accountData.password}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#0F3F2F] hover:text-[#0F3F2F]/80"
                  >
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

              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Last logged in:</span>
                <span className="text-sm text-gray-600 col-span-2">{accountData.lastLoggedIn}</span>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/background/Icon.svg"
                alt="Team icon"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="font-semibold text-sm">TEAM</span>
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
                  </div>
                  <Button
                    variant="default"
                    className="bg-emerald-500 text-white rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 hover:bg-emerald-600"
                    onClick={() => setShowComments(true)}
                    
                  >
                    <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add comment</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 col-span-1 md:col-span-2 xl:col-span-3">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Company name:</span>
                <span className="text-sm text-gray-600">{companyInformation.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">GST registration:</span>
                <span className="text-sm text-gray-600">{companyInformation.gstRegistration}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">GST No.:</span>
                <span className="text-sm text-gray-600">{companyInformation.gstNo}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Owner name:</span>
                <span className="text-sm text-gray-600">{companyInformation.ownerName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Mobile:</span>
                <span className="text-sm text-gray-600">{companyInformation.mobile}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-gray-600">{companyInformation.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Website:</span>
                <span className="text-sm text-gray-600">{companyInformation.website}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Logo:</span>
                <div className="flex items-center">
                  <div className="h-8 w-34 mr-2">
                    <Image
                      src={companyInformation.logo || "/placeholder.svg"}
                      alt={`${companyInformation.name} Logo`}
                      width={300}
                      height={58}
                      className="object-contain"
                      onError={handleImageError}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Landing page skin:</span>
                <div className="mt-1 relative">
                  <div
                    className="w-8 h-8 rounded cursor-pointer border"
                    style={{ backgroundColor: color }}
                    data-testid="color-picker-button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />

                  {showColorPicker && (
                    <div
                      className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setShowColorPicker(false)
                          setTempColor(color)
                        }
                      }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-lg max-w-xs w-full p-4 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="font-medium mb-3">Choose Landing Page Color</h3>

                        <div className="w-full h-16 rounded mb-4" style={{ backgroundColor: tempColor }} />

                        <div className="mb-4">
                          <HexColorPicker color={tempColor} onChange={setTempColor} className="w-full" />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="text-sm w-10">RGB</div>
                          <Input
                            value={tempColor}
                            onChange={(e) => setTempColor(e.target.value)}
                            className="h-12 border border-gray-300 focus:border-gray-400 focus:ring-0 focus:bg-white text-xs"
                          />
                          <div className="text-xs">100%</div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowColorPicker(false)
                              setTempColor(color)
                            }}
                            className="h-10 border border-gray-300 focus:ring-0 font-poppins"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setColor(tempColor)
                              setShowColorPicker(false)
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 h-10 focus:ring-0 font-poppins text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Country:</span>
                <span className="text-sm text-gray-600">{companyInformation.country}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Business license / Registration certificate:</span>
                <button className="text-[#0F3F2F]">
                  <div className="w-5 h-5">
                    <Image
                      src="/avatar/line-md_file-download-filled (1).png"
                      alt="Notes"
                      width={20}
                      height={20}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Year of registration:</span>
                <span className="text-sm text-gray-600">{companyInformation.yearOfRegistration}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">PAN No.:</span>
                <span className="text-sm text-gray-600">{companyInformation.panNo}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">PAN Type:</span>
                <span className="text-sm text-gray-600">{companyInformation.panType}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Headquarters:</span>
                <span className="text-sm text-gray-600">{companyInformation.headquarters}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium">Years of operation:</span>
                <span className="text-sm text-gray-600">{companyInformation.yearsOfOperation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Team Member Details</DialogTitle>
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
                <p className="text-xs text-gray-500">{commentData.timestamp}</p>
              </div>
            </div>

            {/* New Comment Input */}
            <div className="mt-4 space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                rows={3}
                placeholder="Add a note about this team member..."
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowComments(false)} variant="outline" className="text-sm">
                  Cancel
                </Button>
                <Button onClick={handlePostComment} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
                  comment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}