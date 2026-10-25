import { useState } from 'react'
import { FileArchive, FileText } from 'lucide-react'
import type { FileItem, Member, PhotoItem } from '../../types/chat'

interface GroupInfoPanelProps {
  teamName?: string
  teamInitial?: string
  membersCount: number
  files: FileItem[]
  photos: PhotoItem[]
  members: Member[]
  onDownloadFile?: (fileName: string) => void
  onMemberClick?: (member: Member) => void
}

export default function GroupInfoPanel({
  teamName = '#Designers',
  teamInitial = 'D',
  membersCount,
  files,
  photos,
  members,
  onDownloadFile,
  onMemberClick,
}: GroupInfoPanelProps) {
  const [showAllFiles, setShowAllFiles] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [showAllMembers, setShowAllMembers] = useState(false)

  const displayedFiles = showAllFiles ? files : files.slice(0, 4)
  const displayedPhotos = showAllPhotos ? [...photos, ...photos] : photos.slice(0, 3)
  const displayedMembers = showAllMembers ? members : members.slice(0, 3)

  return (
    <aside
      className="flex w-full sm:w-[250px] shrink-0 flex-col border-l border-[#EDEDED] bg-white overflow-y-auto"
      aria-label="Group details"
    >
      {/* Group Header Profile */}
      <div className="flex flex-col items-center justify-center border-b border-[#F0F0F0] px-4 py-6 text-center">
        {/* Large circular teal "D" avatar */}
        <span className="grid h-16 w-16 place-items-center rounded-full bg-chat-teal-avatar text-[24px] font-semibold text-chat-teal-text shadow-2xs">
          {teamInitial}
        </span>
        <h2 className="mt-3 text-[15px] font-semibold text-[#222222]">{teamName}</h2>
        <p className="mt-0.5 text-[11px] text-[#8A8A8A]">Members ({membersCount})</p>
      </div>

      {/* FILES Section */}
      <section className="border-b border-[#F0F0F0] p-4">
        <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#8A8A8A]">
          <span>FILES</span>
          <button
            type="button"
            onClick={() => setShowAllFiles(!showAllFiles)}
            className="text-[11px] font-medium text-chat-primary hover:underline"
          >
            {showAllFiles ? 'Show Less' : 'View All'}
          </button>
        </div>

        <div className="space-y-2">
          {displayedFiles.map((file) => {
            const isPdf = file.type === 'pdf'
            const isPsd = file.type === 'psd'
            const isFig = file.type === 'fig'
            const Icon = file.type === 'zip' ? FileArchive : FileText

            return (
              <button
                key={file.id}
                type="button"
                onClick={() => onDownloadFile?.(file.name)}
                className="group flex w-full items-center gap-2.5 rounded-lg p-1 text-left transition-colors hover:bg-[#F9F9F9]"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                    isPdf
                      ? 'bg-red-50 text-red-500'
                      : isPsd
                      ? 'bg-blue-50 text-blue-500'
                      : isFig
                      ? 'bg-purple-50 text-purple-500'
                      : 'bg-amber-50 text-amber-500'
                  }`}
                >
                  <Icon size={14} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-[#333] group-hover:text-chat-primary">
                    {file.name}
                  </p>
                  <p className="text-[9.5px] text-[#8A8A8A]">{file.size}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* PHOTOS Section */}
      <section className="border-b border-[#F0F0F0] p-4">
        <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#8A8A8A]">
          <span>PHOTOS</span>
          <button
            type="button"
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="text-[11px] font-medium text-chat-primary hover:underline"
          >
            {showAllPhotos ? 'Show Less' : 'View All'}
          </button>
        </div>

        {/* 3 rounded thumbnails */}
        <div className="grid grid-cols-3 gap-2">
          {displayedPhotos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="flex h-12 flex-col overflow-hidden rounded-lg border border-black/5 shadow-2xs transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: photo.bg }}
              title={photo.title}
            >
              <div className="h-2 w-full" style={{ backgroundColor: photo.accent }} />
              <div className="flex flex-1 flex-col gap-1 p-1">
                <div className="h-1 w-4 rounded-full bg-white/60" />
                <div className="flex-1 rounded-xs bg-white/40" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEMBERS Section */}
      <section className="p-4">
        <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold tracking-wider text-[#8A8A8A]">
          <span>MEMBERS</span>
          <button
            type="button"
            onClick={() => setShowAllMembers(!showAllMembers)}
            className="text-[11px] font-medium text-chat-primary hover:underline"
          >
            {showAllMembers ? 'Show Less' : 'View All'}
          </button>
        </div>

        {/* Member list */}
        <div className="space-y-2.5">
          {displayedMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => onMemberClick?.(member)}
              className="group flex w-full items-center gap-2.5 rounded-lg p-1 text-left transition-colors hover:bg-[#F9F9F9]"
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-[#3E3B37]"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-[#222222] group-hover:text-chat-primary">
                  {member.name}
                </p>
                <p className="truncate text-[9.5px] text-[#8A8A8A]">
                  {member.role}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

