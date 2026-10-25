import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Archive,
  ArrowLeft,
  Bold,
  Bookmark,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Ellipsis,
  FileArchive,
  FileText,
  Image,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MailPlus,
  Paperclip,
  Printer,
  Search,
  Send,
  Smile,
  Star,
  Trash,
  Trash2,
  Underline,
  Type,
  Heart,
  Leaf,
  Utensils,
  Flag,
  X,
} from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import './MailPage.css'

type MailSection = 'Inbox' | 'Marked' | 'Drafts' | 'Sent' | 'Important' | 'Deleted'

interface MailMessage {
  id: number
  sender: string
  email: string
  subject: string
  preview: string
  time: string
  date: string
  initials: string
  color: string
  section: MailSection[]
  unread?: boolean
  important?: boolean
  bookmarked?: boolean
  attachments?: string[]
}

const initialMessages: MailMessage[] = [
  {
    id: 1, sender: 'Regina Cooper', email: 'regina_cooper@mail.com',
    subject: 'Creative Director Resume', preview: 'Hello, Regina Cooper! I am writing to introduce you to David Boyd.',
    time: '10:45', date: 'May 27, 2020 — 10:45', initials: 'RC', color: '#d8b39a',
    section: ['Inbox'], unread: true, important: true, attachments: ['Resume.pdf', 'Portfolio.zip'],
  },
  {
    id: 2, sender: 'Dustin Williamson', email: 'dustin.williamson@mail.com',
    subject: 'Meeting with friends', preview: 'Hi Regina, are we still meeting this weekend? Let me know.',
    time: '10:40', date: 'May 27, 2020 — 10:40', initials: 'DW', color: '#91b4ad',
    section: ['Inbox'], unread: true, attachments: ['Event details.pdf'],
  },
  {
    id: 3, sender: 'Jane Wilson', email: 'jane.wilson@mail.com',
    subject: 'UX Conference in New York', preview: 'I thought you might be interested in joining us at the conference.',
    time: '09:15', date: 'May 27, 2020 — 09:15', initials: 'JW', color: '#c69eac',
    section: ['Inbox'], unread: true,
  },
  {
    id: 4, sender: 'Brandon Pena', email: 'brandon.pena@mail.com',
    subject: 'Muzli’s weekly design #236', preview: 'This week’s collection of inspiration and creative stories.',
    time: '09:01', date: 'May 27, 2020 — 09:01', initials: 'BP', color: '#b49a7e',
    section: ['Inbox'], important: true,
  },
  {
    id: 5, sender: 'Jacob Hawkins', email: 'jacob.hawkins@mail.com',
    subject: 'Weekly project report', preview: 'Here is the latest update on our project progress.',
    time: '08:20', date: 'May 27, 2020 — 08:20', initials: 'JH', color: '#879fbe',
    section: ['Inbox'], unread: true, attachments: ['Weekly report.doc'],
  },
  {
    id: 6, sender: 'Shane Black', email: 'shane.black@mail.com',
    subject: 'Order Status #24197118', preview: 'Your order has been shipped and is on its way.',
    time: '08:10', date: 'May 27, 2020 — 08:10', initials: 'SB', color: '#a9ad82',
    section: ['Inbox'], important: true,
  },
  {
    id: 7, sender: 'Regina Cooper', email: 'regina_cooper@mail.com',
    subject: 'Welcome to Dribbble!', preview: 'Welcome to Dribbble. We are happy to have you here!',
    time: '08:02', date: 'May 27, 2020 — 08:02', initials: 'RC', color: '#d8b39a',
    section: ['Inbox'], unread: true, important: true,
  },
]

const sectionIcons = {
  Inbox: Archive,
  Marked: Bookmark,
  Drafts: FileText,
  Sent: Send,
  Important: Star,
  Deleted: Trash2,
}

interface MailLabel {
  id: number
  name: string
  color: string
  parentId?: number
}

const initialLabels: MailLabel[] = [
  { id: 1, name: 'Personal', color: '#F87171' },
  { id: 2, name: 'Work', color: '#22D3EE' },
  { id: 3, name: 'Friends', color: '#34D399' },
  { id: 4, name: 'Family', color: '#FACC15' },
  { id: 5, name: 'Social', color: '#6B7280' },
]

const labelColors = [
  { name: 'Red', value: '#F87171' },
  { name: 'Teal', value: '#3CCFBF' },
  { name: 'Yellow', value: '#FFC83D' },
  { name: 'Green', value: '#1E8E2E' },
  { name: 'Cyan', value: '#22D3EE' },
  { name: 'Green', value: '#34D399' },
  { name: 'Lime', value: '#A8E04A' },
  { name: 'Purple', value: '#B14EF0' },
  { name: 'Pink', value: '#FF7ADB' },
  { name: 'Gray', value: '#6B7280' },
]

const popularEmojis = ['😀', '😂', '😍', '🥰', '😊', '😉', '😎', '🤩', '😢', '😡', '👍', '👏', '🙏', '❤️', '🔥', '🎉']
const smileyEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😎', '🤓', '🥳', '😏', '😔', '😢', '😭', '😤', '😡']
const emojiSearchTerms: Record<string, string> = {
  '😀': 'grinning smile happy',
  '😃': 'grinning smile happy',
  '😄': 'grinning smile happy',
  '😁': 'grin smile happy',
  '😆': 'laugh smile happy',
  '😅': 'sweat laugh smile',
  '🤣': 'rolling laugh funny',
  '😂': 'tears laugh funny',
  '🙂': 'smile happy',
  '🙃': 'upside down smile',
  '😉': 'wink',
  '😊': 'blush smile happy',
  '😇': 'angel smile',
  '🥰': 'love hearts smile',
  '😍': 'heart eyes love',
  '🤩': 'star eyes excited',
  '😘': 'kiss love',
  '😎': 'cool sunglasses',
  '😢': 'cry sad tear',
  '😭': 'cry sad tears',
  '😡': 'angry mad',
  '👍': 'thumbs up like',
  '👏': 'clap applause',
  '🙏': 'pray please thanks',
  '❤️': 'heart love',
  '🔥': 'fire hot',
  '🎉': 'party celebration',
}

function MessageBody() {
  return (
    <>
      <p>Hello, Regina Cooper!</p>
      <p>
        I am writing to introduce you to David Boyd. I know you&apos;ve been looking hard for a candidate for that
        Creative Director position and I believe David Boyd fits the position.
      </p>
      <p>
        David Boyd and I worked together at Apple company, Where they were the senior Creative Director. They did a
        terrific job there. David Boyd was responsible for completely restructuring both the public-facing and internal
        websites. They&apos;d be a great fit at Google company.
      </p>
      <p>
        I&apos;ve attached David Boyd resume and portfolio for your review. You can contact David Boyd at
        {' '}regina_cooper@mail.com
      </p>
      <p>Thanks for any help you can give. 😀</p>
      <p>Best regards,<br />Regina Cooper</p>
    </>
  )
}

function ComposeFields({ replyTo, onClose, standalone = false }: { replyTo?: string; onClose?: () => void; standalone?: boolean }) {
  const composerId = useId()
  const [sendStatus, setSendStatus] = useState<'sent' | 'scheduled' | null>(null)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [recipientPresent, setRecipientPresent] = useState(true)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [emojiQuery, setEmojiQuery] = useState('')
  const [emojiCategory, setEmojiCategory] = useState<'smileys' | 'nature' | 'food' | 'activities' | 'flags'>('smileys')
  const [body, setBody] = useState('')
  const [chosenFiles, setChosenFiles] = useState<string[]>([])
  const [resumeAttached, setResumeAttached] = useState(true)
  const [uploadingAttached, setUploadingAttached] = useState(true)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiTriggerRef = useRef<HTMLButtonElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const selectionRef = useRef<Range | null>(null)

  useEffect(() => {
    if (!emojiOpen) return
    function closeOnOutsideClick(event: PointerEvent) {
      const target = event.target as Node
      if (!emojiPickerRef.current?.contains(target) && !emojiTriggerRef.current?.contains(target)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [emojiOpen])

  function rememberSelection() {
    const selection = window.getSelection()
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange()
    }
  }

  function insertEmoji(emoji: string) {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    const selection = window.getSelection()
    const range = selectionRef.current
    if (range && editor.contains(range.startContainer)) {
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
    const activeRange = selection?.rangeCount ? selection.getRangeAt(0) : null
    if (activeRange && editor.contains(activeRange.startContainer)) {
      activeRange.deleteContents()
      const node = document.createTextNode(emoji)
      activeRange.insertNode(node)
      activeRange.setStartAfter(node)
      activeRange.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(activeRange)
      selectionRef.current = activeRange.cloneRange()
    } else {
      editor.append(document.createTextNode(emoji))
    }
    setBody(editor.innerText)
    setEmojiOpen(false)
  }

  function formatText(command: string) {
    editorRef.current?.focus()
    document.execCommand(command)
    rememberSelection()
  }

  const categoryEmojis = {
    smileys: smileyEmojis,
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🌷'],
    food: ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🫐', '🍒', '🥑', '🍕', '🍔', '🍟', '🍰', '☕', '🍪', '🍩'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🎮', '🎯', '🎨', '🎤', '🎧', '🎉', '🏆', '🎈'],
    flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇫🇷', '🇩🇪', '🇮🇳', '🇯🇵', '🇰🇷', '🇧🇷', '🇮🇹'],
  }
  const matchingEmojis = emojiQuery.trim()
    ? [...new Set([...popularEmojis, ...smileyEmojis, ...categoryEmojis[emojiCategory]])].filter((emoji) => (
      emoji.includes(emojiQuery.trim()) || (emojiSearchTerms[emoji] ?? '').includes(emojiQuery.trim().toLowerCase())
    ))
    : categoryEmojis[emojiCategory]

  return (
    <section className={`mail-composer ${standalone ? 'mail-composer-standalone' : ''}`} aria-label={standalone ? 'Message fields' : replyTo ? 'Reply composer' : 'Compose message'}>
      <div className="mail-recipient-row">
        <span>{standalone ? 'To' : 'To:'}</span>
        {standalone ? (
          recipientPresent && <span className="mail-recipient-chip">Regina Cooper<button type="button" aria-label="Remove Regina Cooper" onClick={() => setRecipientPresent(false)}><X size={12} /></button></span>
        ) : replyTo ? <strong>{replyTo}</strong> : <input aria-label="To" placeholder="Recipients" />}
        <button type="button" aria-expanded={showCc} onClick={() => setShowCc((shown) => !shown)}>Cc</button>
        <button type="button" aria-expanded={showBcc} onClick={() => setShowBcc((shown) => !shown)}>Bcc</button>
        {!standalone && onClose && <button type="button" aria-label="Close compose" onClick={onClose}><X size={15} /></button>}
      </div>
      {showCc && <div className="mail-extra-recipient"><label htmlFor={`${composerId}-cc`}>Cc:</label><input id={`${composerId}-cc`} aria-label="Cc" /></div>}
      {showBcc && <div className="mail-extra-recipient"><label htmlFor={`${composerId}-bcc`}>Bcc:</label><input id={`${composerId}-bcc`} aria-label="Bcc" /></div>}
      {standalone ? (
        <label className="mail-compose-subject">
          <span>Subject</span>
          <input aria-label="Subject" defaultValue="Order Status #24197118" />
        </label>
      ) : !replyTo && <input className="mail-subject-input" aria-label="Subject" placeholder="Subject" />}
      {standalone && <div className="mail-compose-message-label">Message</div>}
      <div className={`mail-format-toolbar ${standalone ? 'mail-format-toolbar-standalone' : ''}`} aria-label="Formatting toolbar">
        {standalone && (
          <label className="mail-text-style">
            <Type size={14} />
            <select
              aria-label="Text style"
              defaultValue="Normal"
              onChange={(event) => {
                editorRef.current?.focus()
                document.execCommand('formatBlock', false, event.target.value === 'Normal' ? 'div' : event.target.value.toLowerCase())
                rememberSelection()
              }}
            >
              <option>Normal</option><option>Heading 1</option><option>Heading 2</option>
            </select>
            <ChevronDown size={12} />
          </label>
        )}
        {[Bold, Italic, Underline, LinkIcon, Smile, Image, Paperclip, List, ListOrdered, AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
          <button
            type="button"
            aria-label={['Bold', 'Italic', 'Underline', 'Link', 'Emoji', 'Image', 'Attachment', 'Bulleted list', 'Numbered list', 'Align left', 'Align center', 'Align right'][index]}
            key={index}
            ref={index === 4 ? emojiTriggerRef : undefined}
            aria-expanded={index === 4 ? emojiOpen : undefined}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (index === 4) {
                rememberSelection()
                setEmojiOpen((open) => !open)
              } else if (index === 0) formatText('bold')
              else if (index === 1) formatText('italic')
              else if (index === 2) formatText('underline')
              else if (index === 7) formatText('insertUnorderedList')
              else if (index === 8) formatText('insertOrderedList')
              else if (index === 9) formatText('justifyLeft')
              else if (index === 10) formatText('justifyCenter')
              else if (index === 11) formatText('justifyRight')
              else if (index === 5) imageInputRef.current?.click()
              else if (index === 6) attachmentInputRef.current?.click()
              else if (index === 3) {
                const url = window.prompt('Enter link URL')
                if (url) {
                  editorRef.current?.focus()
                  document.execCommand('createLink', false, url)
                }
              }
            }}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className={`mail-editor ${standalone ? 'mail-editor-standalone' : ''} ${body ? 'has-content' : ''}`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Message body"
        data-placeholder="Type something"
        onInput={(event) => setBody(event.currentTarget.innerText)}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={rememberSelection}
      >
      </div>
      {standalone && (
        <div className="mail-compose-attachments" aria-label="Attachments">
          {resumeAttached && (
            <div className="mail-compose-attachment">
              <span className="mail-compose-attachment-icon pdf"><FileText size={19} /></span>
              <span className="mail-compose-attachment-copy"><strong>Resume.pdf</strong><small>570 KB</small></span>
              <button type="button" aria-label="Remove Resume.pdf" onClick={() => setResumeAttached(false)}><Trash size={15} /></button>
            </div>
          )}
          {uploadingAttached && (
            <div className="mail-compose-attachment mail-upload-attachment">
              <span className="mail-compose-attachment-icon"><FileArchive size={18} /></span>
              <span className="mail-compose-attachment-copy"><strong>Uploading File...</strong><span className="mail-upload-progress"><i /></span></span>
              <small>40%</small>
              <button type="button" aria-label="Remove uploading attachment" onClick={() => setUploadingAttached(false)}><X size={15} /></button>
            </div>
          )}
        </div>
      )}
      <input ref={imageInputRef} className="mail-hidden-file-input" type="file" accept="image/*" aria-label="Choose image" onChange={(event) => setChosenFiles((files) => [...files, ...Array.from(event.target.files ?? []).map((file) => file.name)])} />
      <input ref={attachmentInputRef} className="mail-hidden-file-input" type="file" multiple aria-label="Choose attachment" onChange={(event) => setChosenFiles((files) => [...files, ...Array.from(event.target.files ?? []).map((file) => file.name)])} />
      {chosenFiles.length > 0 && <div className="mail-chosen-files">{chosenFiles.map((file, index) => <span key={`${file}-${index}`}>{file}</span>)}</div>}
      {emojiOpen && (
        <div className="mail-emoji-picker" ref={emojiPickerRef} role="dialog" aria-label="Emoji picker">
          <label className="mail-emoji-search"><Search size={14} /><input autoFocus aria-label="Search emoji" placeholder="Search emoji" value={emojiQuery} onChange={(event) => setEmojiQuery(event.target.value)} /></label>
          {!emojiQuery && <><strong className="mail-emoji-section-title">POPULAR</strong><div className="mail-emoji-grid mail-popular-grid">{popularEmojis.map((emoji) => <button type="button" key={emoji} onClick={() => insertEmoji(emoji)}>{emoji}</button>)}</div></>}
          {!emojiQuery && <strong className="mail-emoji-section-title">{emojiCategory.toUpperCase()}</strong>}
          <div className="mail-emoji-grid">{matchingEmojis.map((emoji, index) => <button type="button" key={`${emoji}-${index}`} aria-label={`Insert ${emoji}`} onClick={() => insertEmoji(emoji)}>{emoji}</button>)}</div>
          <div className="mail-emoji-categories" aria-label="Emoji categories">
            {([
              ['smileys', Smile],
              ['nature', Leaf],
              ['food', Utensils],
              ['activities', Heart],
              ['flags', Flag],
            ] as const).map(([category, Icon]) => (
              <button type="button" key={category} aria-label={category} aria-pressed={emojiCategory === category} className={emojiCategory === category ? 'is-active' : ''} onClick={() => { setEmojiCategory(category); setEmojiQuery('') }}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`mail-composer-footer ${standalone ? 'mail-composer-footer-standalone' : ''}`}>
        <button type="button" className="mail-send-button" onClick={() => setSendStatus('sent')}>
          <Send size={13} />{sendStatus === 'sent' ? 'Sent' : sendStatus === 'scheduled' ? 'Scheduled' : 'Send'}
        </button>
        <button type="button" className={standalone ? 'mail-schedule-button' : ''} aria-label="Schedule send" onClick={() => setSendStatus('scheduled')}>
          {standalone ? <Clock3 size={14} /> : <CalendarClock size={15} />}
        </button>
        <button type="button" aria-label="Attach file" onClick={() => attachmentInputRef.current?.click()}><Paperclip size={15} /></button>
      </div>
    </section>
  )
}

export default function MailPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [activeSection, setActiveSection] = useState<MailSection>('Inbox')
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [sortRecent, setSortRecent] = useState(true)
  const [compose, setCompose] = useState(false)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [labels, setLabels] = useState(initialLabels)
  const [labelMenu, setLabelMenu] = useState<{ labelId: number | null; top: number; left: number } | null>(null)
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null)
  const [labelDraft, setLabelDraft] = useState('')
  const [defaultLabelColor, setDefaultLabelColor] = useState(labelColors[0].value)
  const labelMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!labelMenu) return
    function closeLabelMenu(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      if (!labelMenuRef.current?.contains(target) && !target.closest('.mail-label-menu-trigger')) {
        setLabelMenu(null)
      }
    }
    document.addEventListener('pointerdown', closeLabelMenu)
    return () => document.removeEventListener('pointerdown', closeLabelMenu)
  }, [labelMenu])

  const menuTargetLabelId = labelMenu?.labelId ?? labels[0]?.id

  const sectionMessages = useMemo(() => messages.filter((message) => {
    if (activeSection === 'Deleted') return message.section.includes('Deleted')
    if (message.section.includes('Deleted')) return false
    if (activeSection === 'Marked') return message.bookmarked
    if (activeSection === 'Important') return message.important
    return message.section.includes(activeSection)
  }).filter((message) => {
    const searchText = `${message.sender} ${message.subject} ${message.preview}`.toLowerCase()
    return searchText.includes(query.trim().toLowerCase())
  }).sort((first, second) => sortRecent ? first.id - second.id : second.id - first.id), [activeSection, messages, query, sortRecent])

  const selectedIndex = sectionMessages.findIndex((message) => message.id === selectedId)
  const listIndex = selectedIndex >= 0 ? selectedIndex : 0
  const displayedMessage = sectionMessages[listIndex]
  const unreadCount = messages.filter((message) => message.unread && !message.section.includes('Deleted')).length
  const importantCount = messages.filter((message) => message.important && !message.section.includes('Deleted')).length

  function selectMessage(message: MailMessage) {
    setSelectedId(message.id)
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, unread: false } : item))
  }

  function changeSection(section: MailSection) {
    setActiveSection(section)
    const nextMessage = messages.find((message) => {
      if (section === 'Deleted') return message.section.includes('Deleted')
      if (message.section.includes('Deleted')) return false
      if (section === 'Marked') return message.bookmarked
      if (section === 'Important') return message.important
      return message.section.includes(section)
    })
    if (nextMessage) setSelectedId(nextMessage.id)
  }

  function moveSelection(direction: -1 | 1) {
    if (sectionMessages.length === 0) return
    const next = (listIndex + direction + sectionMessages.length) % sectionMessages.length
    selectMessage(sectionMessages[next])
  }

  function toggleBookmark() {
    if (!displayedMessage) return
    setMessages((current) => current.map((message) => message.id === displayedMessage.id
      ? { ...message, bookmarked: !message.bookmarked }
      : message))
  }

  function deleteSelected() {
    if (!displayedMessage) return
    setMessages((current) => current.map((message) => message.id === displayedMessage.id
      ? { ...message, section: message.section.includes('Deleted') ? message.section : [...message.section, 'Deleted'] }
      : message))
    setActiveSection('Deleted')
  }

  function showLabelMenu(event: React.MouseEvent<HTMLButtonElement>, labelId: number | null) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setLabelMenu({
      labelId,
      top: Math.min(bounds.bottom + 4, window.innerHeight - 170),
      left: Math.max(8, Math.min(bounds.left, window.innerWidth - 184)),
    })
  }

  function renameLabel(labelId: number) {
    const name = labelDraft.trim()
    if (name) setLabels((current) => current.map((label) => label.id === labelId ? { ...label, name } : label))
    setEditingLabelId(null)
  }

  function addSubLabel() {
    const parent = labels.find((label) => label.id === labelMenu?.labelId)
    const id = Date.now()
    setLabels((current) => [...current, {
      id,
      name: 'Sub-label',
      color: parent?.color ?? defaultLabelColor,
      ...(parent ? { parentId: parent.id } : {}),
    }])
    setEditingLabelId(id)
    setLabelDraft('Sub-label')
    setLabelMenu(null)
  }

  function changeLabelColor(color: string) {
    if (labelMenu?.labelId !== null && labelMenu?.labelId !== undefined) {
      setLabels((current) => current.map((label) => label.id === labelMenu.labelId ? { ...label, color } : label))
    } else {
      setDefaultLabelColor(color)
    }
  }

  return (
    <div className="mail-app-shell">
      <Sidebar />
      <div className="mail-app-main">
        <Header />
        <main className="mail-layout">
          <aside className="mail-navigation">
            <button type="button" className="mail-new-button" onClick={() => setCompose(true)}>
              <MailPlus size={15} />NEW MESSAGE
            </button>
            <nav className="mail-folders" aria-label="Mail folders">
              {(Object.keys(sectionIcons) as MailSection[]).map((section) => {
                const Icon = sectionIcons[section]
                const badge = section === 'Inbox' ? unreadCount : section === 'Important' ? importantCount : 0
                return (
                  <button
                    type="button"
                    key={section}
                    aria-current={activeSection === section ? 'page' : undefined}
                    onClick={() => changeSection(section)}
                    className={`mail-folder ${activeSection === section ? 'is-active' : ''}`}
                  >
                    <Icon size={16} strokeWidth={1.7} />
                    <span>{section}</span>
                    {badge > 0 && <b>{badge}</b>}
                  </button>
                )
              })}
            </nav>
            <div className="mail-labels-heading">
              <span>LABELS</span>
              <button
                type="button"
                aria-label="Add label"
                className="mail-label-menu-trigger"
                aria-expanded={labelMenu?.labelId === null}
                onClick={(event) => showLabelMenu(event, null)}
              >
                +
              </button>
            </div>
            <div className="mail-label-list">
              {labels.map((label) => (
                <div className={`mail-label-row ${label.parentId ? 'is-nested' : ''}`} key={label.id}>
                  {editingLabelId === label.id ? (
                    <input
                      autoFocus
                      className="mail-label-edit-input"
                      aria-label="Edit label name"
                      value={labelDraft}
                      onChange={(event) => setLabelDraft(event.target.value)}
                      onBlur={() => renameLabel(label.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') renameLabel(label.id)
                        if (event.key === 'Escape') setEditingLabelId(null)
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className={`mail-label-select ${activeLabel === label.name ? 'is-active' : ''}`}
                      onClick={() => {
                        setActiveLabel(activeLabel === label.name ? null : label.name)
                        setActiveSection('Inbox')
                      }}
                    >
                      <i style={{ backgroundColor: label.color }} />{label.name}
                    </button>
                  )}
                  <button
                    type="button"
                    className="mail-label-options mail-label-menu-trigger"
                    aria-label={`Options for ${label.name}`}
                    aria-expanded={labelMenu?.labelId === label.id}
                    onClick={(event) => showLabelMenu(event, label.id)}
                  >
                    <Ellipsis size={16} />
                  </button>
                </div>
              ))}
            </div>
          </aside>

          <section className="mail-inbox-column" aria-label="Inbox">
            <div className="mail-list-toolbar">
              <label className="mail-search">
                <Search size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." aria-label="Search mail" />
              </label>
              <button type="button" className="mail-sort" onClick={() => setSortRecent((recent) => !recent)}>
                {sortRecent ? 'Recent' : 'Oldest'}<ChevronDown size={13} />
              </button>
            </div>
            <div className="mail-message-list">
              {sectionMessages.map((message) => (
                <button
                  type="button"
                  key={message.id}
                  onClick={() => selectMessage(message)}
                  className={`mail-message-row ${displayedMessage?.id === message.id ? 'is-selected' : ''} ${message.unread ? 'is-unread' : ''}`}
                >
                  <span className="mail-avatar" style={{ '--avatar-color': message.color } as React.CSSProperties}>{message.initials}</span>
                  <span className="mail-message-copy">
                    <span className="mail-message-top"><strong>{message.sender}</strong><time>{message.time}</time></span>
                    <span className="mail-message-subject">{message.subject}</span>
                    <span className="mail-message-preview">{message.preview}</span>
                    <span className="mail-row-icons">
                      {message.attachments && <Paperclip size={12} />}
                      {message.important && <Star size={12} fill="currentColor" />}
                      <Ellipsis size={15} />
                    </span>
                  </span>
                </button>
              ))}
              {sectionMessages.length === 0 && <p className="mail-no-results">No messages found.</p>}
            </div>
          </section>

          {labelMenu && (
            <div
              className="mail-label-menu"
              ref={labelMenuRef}
              role="menu"
              aria-label="Label options"
              style={{ top: labelMenu.top, left: labelMenu.left }}
            >
              <button type="button" role="menuitem" disabled={menuTargetLabelId === undefined} onClick={() => {
                const label = labels.find((item) => item.id === menuTargetLabelId)
                if (label) {
                  setLabelDraft(label.name)
                  setEditingLabelId(label.id)
                }
                setLabelMenu(null)
              }}>Edit</button>
              <button type="button" role="menuitem" onClick={addSubLabel}>Add Sub-label</button>
              <button type="button" role="menuitem" disabled={menuTargetLabelId === undefined} onClick={() => {
                if (menuTargetLabelId !== undefined) {
                  const label = labels.find((item) => item.id === menuTargetLabelId)
                  setLabels((current) => current.filter((item) => item.id !== menuTargetLabelId && item.parentId !== menuTargetLabelId))
                  if (label) setActiveLabel((current) => current === label.name ? null : current)
                }
                setLabelMenu(null)
              }}>Delete Label</button>
              <div className="mail-label-menu-colors" role="group" aria-label="Label colors">
                {labelColors.map((color, index) => (
                  <button
                    type="button"
                    key={`${color.value}-${index}`}
                    aria-label={`${color.name} label color`}
                    className="mail-label-color-dot"
                    style={{ '--label-color': color.value } as React.CSSProperties}
                    onClick={() => { changeLabelColor(color.value); setLabelMenu(null) }}
                  />
                ))}
              </div>
            </div>
          )}

          <section className="mail-reading-column" aria-label="Email details">
            {displayedMessage ? (
              <>
                <div className="mail-reader-toolbar">
                  <button type="button" aria-label="Back to inbox" onClick={() => changeSection('Inbox')}>
                    <ArrowLeft size={17} />
                  </button>
                  <span className="mail-toolbar-spacer" />
                  <button type="button" aria-label="Previous email" onClick={() => moveSelection(-1)}><ChevronLeft size={17} /></button>
                  <span className="mail-count">{sectionMessages.length ? listIndex + 1 : 0} of {sectionMessages.length}</span>
                  <button type="button" aria-label="Next email" onClick={() => moveSelection(1)}><ChevronRight size={17} /></button>
                  <span className="mail-toolbar-divider" />
                  <button type="button" aria-label={displayedMessage.bookmarked ? 'Remove bookmark' : 'Bookmark'} onClick={toggleBookmark} className={displayedMessage.bookmarked ? 'is-bookmarked' : ''}><Bookmark size={16} /></button>
                  <button type="button" aria-label="Print" onClick={() => window.print()}><Printer size={16} /></button>
                  <button type="button" aria-label="Delete email" onClick={deleteSelected}><Trash2 size={16} /></button>
                </div>
                <article className="mail-reading-content">
                  <h1>{displayedMessage.subject}</h1>
                  <div className="mail-sender">
                    <span className="mail-avatar mail-sender-avatar" style={{ '--avatar-color': displayedMessage.color } as React.CSSProperties}>{displayedMessage.initials}</span>
                    <div><strong>{displayedMessage.sender}</strong><span>{displayedMessage.email}</span></div>
                    <time>{displayedMessage.date}</time>
                  </div>
                  <div className="mail-body">
                    {displayedMessage.id === 1 ? <MessageBody /> : (
                      <>
                        <p>Hello,</p>
                        <p>{displayedMessage.preview}</p>
                        <p>Best regards,<br />{displayedMessage.sender}</p>
                      </>
                    )}
                  </div>
                  {displayedMessage.attachments && (
                    <div className="mail-attachments">
                      {displayedMessage.id === 1 ? (
                        <>
                          <AttachmentCard name="Resume.pdf" size="570 KB" type="pdf" />
                          <AttachmentCard name="Portfolio.zip" size="250 MB" type="zip" />
                        </>
                      ) : displayedMessage.attachments.map((file) => <AttachmentCard key={file} name={file} size="1.2 MB" type="pdf" />)}
                    </div>
                  )}
                </article>
                <ComposeFields replyTo={displayedMessage.sender} />
              </>
            ) : (
              <div className="mail-empty-reader">Select a message to read</div>
            )}
          </section>
          {compose && (
            <section className="mail-compose-panel" aria-label="Compose message">
              <header className="mail-compose-panel-header">
                <h1>New Message</h1>
                <button type="button" aria-label="Close compose" onClick={() => setCompose(false)}><X size={18} /></button>
              </header>
              <ComposeFields standalone onClose={() => setCompose(false)} />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function AttachmentCard({ name, size, type }: { name: string; size: string; type: 'pdf' | 'zip' }) {
  const Icon = type === 'zip' ? FileArchive : FileText
  function downloadAttachment() {
    const file = new Blob([`Mock attachment: ${name}`], { type: type === 'pdf' ? 'application/pdf' : 'application/zip' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="mail-attachment-card">
      <span className={`mail-file-icon ${type}`}><Icon size={17} /></span>
      <span className="mail-file-copy"><strong>{name}</strong><small>{size}</small></span>
      <button type="button" aria-label={`Download ${name}`} onClick={downloadAttachment}><Download size={15} /></button>
    </div>
  )
}
