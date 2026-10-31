import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Modal } from '@/components/ui';
import { content, t } from '@/data/content';
import {
  Users, Heart, MessageCircle, Flag, Send, Pin, Sparkles,
  ShieldAlert, Lock, Eye,
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatarColor: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  club: string;
  liked?: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatarColor: string;
  text: string;
  time: string;
}

export function CommunityPage() {
  const { language, isCreator, canPost, canComment, profile, mode, ageGroup } = useApp();
  const [posts, setPosts] = useState<Post[]>(content.samplePosts as Post[]);
  const [guidelines,setGuidelines]=useState(false);
  const [newPost, setNewPost] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    p1: [
      { id: 'c1', author: 'SongketFan', avatarColor: '#abc399', text: 'Love the neon songket idea! 🔥', time: '1h' },
      { id: 'c2', author: 'BatikMaster', avatarColor: '#e6c779', text: 'Can you share the pattern?', time: '30m' },
    ],
    p2: [],
    p3: [
      { id: 'c3', author: 'LegendLover', avatarColor: '#cda8b9', text: 'Which region is your grandma from?', time: '20h' },
    ],
    p4: [],
  });
  const [postStatus, setPostStatus] = useState<string | null>(null);
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set());

  const handlePost = () => {
    if(!canPost)return;
    if (!newPost.trim()) return;

    // Simulate local keyword checks
    const blocked = checkContent(newPost);
    if (blocked) {
      setPostStatus('blocked');
      setTimeout(() => setPostStatus(null), 3000);
      return;
    }

    const post: Post = {
      id: `p${Date.now()}`,
      author: profile.nickname,
      avatarColor: profile.avatarColor,
      time: 'now',
      text: newPost,
      likes: 0,
      comments: 0,
      club: 'general',
    };

    if (isCreator) {
      // Posts publish instantly after local keyword checks
      setPosts([post, ...posts]);
      setPostStatus('published');
    } else {
      // Explorer: needs moderator approval
      setPostStatus('pending');
    }

    setNewPost('');
    setShowPostForm(false);
    setTimeout(() => setPostStatus(null), 3000);
  };

  // Simple local keyword checks mock — checks for personal info, inappropriate content
  const checkContent = (text: string): boolean => {
    const lower = text.toLowerCase();
    const blocked = ['phone', 'address', 'school name', 'http', 'www.', '@gmail', '@yahoo', 'facebook.com', 'instagram.com'];
    return blocked.some((b) => lower.includes(b));
  };

  const handleLike = (id: string) => {
    setPosts(posts.map((p) =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleReport = (id: string) => {
    setReportedPosts(new Set([...reportedPosts, id]));
  };

  const handleComment = (postId: string) => {
    if(!canComment)return;
    if (!commentText.trim()) return;
    const blocked = checkContent(commentText);
    if (blocked) {setPostStatus("blocked");return;}

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: profile.nickname,
      avatarColor: profile.avatarColor,
      text: commentText,
      time: 'now',
    };
    setComments({
      ...comments,
      [postId]: [...(comments[postId] || []), newComment],
    });
    setCommentText('');
  };

  // Explorer mode: preset reactions only
  const presetReactions = ['❤️', '👏', '🔥', '😍', '🤩'];

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto"><p className="card-base p-4 mb-5 text-sm text-ink-300">Local demonstration · example posts, counts and members are fictional. Actions affect this session only. No live community or moderation service is connected.</p>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-ink-50 flex items-center gap-2">
          <Users className="text-batik-700" /> {language === 'EN' ? 'Community' : 'Komunitas'}
        </h1>
        <p className="text-ink-400 mt-1">
          {isCreator
            ? language === 'EN' ? 'Share your creations, stories, and reflections.' : 'Bagikan kreasi, cerita, dan refleksi kamu.'
            : language === 'EN' ? 'Browse and react to posts from the community.' : 'Jelajahi dan beri reaksi pada postingan komunitas.'}
        </p>
      </div>

      {/* Mode info banner */}
      {!isCreator && (
        <Card className="mb-4 border-l-4 border-l-neon-blue">
          <div className="flex items-center gap-3">
            <Eye className="text-neon-blue" size={20} />
            <p className="text-sm text-ink-300">
              {language === 'EN'
                ? 'Explorer mode: You can react with emojis, but posting and text comments need Creator mode (unlocks at 13).'
                : 'Mode Explorer: Kamu bisa bereaksi dengan emoji, tetapi posting dan komentar teks memerlukan mode Creator (terbuka di usia 13).'}
            </p>
          </div>
        </Card>
      )}

      {/* Creator spotlight */}
      <Card className="mb-6 border-l-4 border-l-neon-yellow">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-neon-yellow" size={20} />
          <h3 className="font-display font-bold text-ink-50">
            {language === 'EN' ? 'Creator Spotlight' : 'Sorotan Kreator'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neon-yellow flex items-center justify-center text-xl font-bold text-black">
            S
          </div>
          <div>
            <p className="font-medium text-ink-50">StreetStyleID</p>
            <p className="text-xs text-ink-400">
              {language === 'EN'
                ? 'Mixing Toraja motifs with streetwear — 89 likes this week!'
                : 'Mencampur motif Toraja dengan streetwear — 89 suka minggu ini!'}
            </p>
          </div>
        </div>
      </Card>

      {/* Post form (Creator only) */}
      {isCreator ? (
        <div className="mb-6">
          {!showPostForm ? (
            <Button onClick={() => setShowPostForm(true)} variant="neon-pink" className="w-full">
              <Sparkles size={18} /> {language === 'EN' ? 'Create a Post' : 'Buat Postingan'}
            </Button>
          ) : (
            <Card>
              <textarea
                aria-label="Draft a local community post"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={language === 'EN' ? 'Share something about Indonesian culture...' : 'Bagikan sesuatu tentang budaya Indonesia...'}
                className="w-full bg-ink-800 border border-ink-600 rounded-xl p-3 text-ink-50 outline-none focus:border-neon-pink resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-ink-500">
                  {language === 'EN' ? 'No personal info, photos of people, or off-topic posts.' : 'Tanpa info pribadi, foto orang, atau postingan di luar topik.'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowPostForm(false)}>
                    {language === 'EN' ? 'Cancel' : 'Batal'}
                  </Button>
                  <Button size="sm" variant="neon-pink" onClick={handlePost}>
                    <Send size={14} /> {language === 'EN' ? 'Post' : 'Posting'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <Button disabled variant="secondary" className="w-full">
            <Lock size={18} /> {language === 'EN' ? 'Posting unlocks in Creator mode (age 13+)' : 'Posting terbuka di mode Creator (usia 13+)'}
          </Button>
        </div>
      )}

      {/* Post status messages */}
      {postStatus === 'published' && (
        <div className="mb-4 p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl text-neon-green text-sm animate-fade-in">
          {language === 'EN' ? 'Added to this local demonstration. It is not published.' : 'Ditambahkan ke demonstrasi lokal ini. Tidak diterbitkan.'}
        </div>
      )}
      {postStatus === 'pending' && (
        <div className="mb-4 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-neon-blue text-sm animate-fade-in">
          {language === 'EN' ? 'No moderation service is connected. Nothing was sent.' : 'Layanan moderasi belum terhubung. Tidak ada yang dikirim.'}
        </div>
      )}
      {postStatus === 'blocked' && (
        <div className="mb-4 p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm animate-fade-in">
          {language === 'EN' ? 'Oops, that one can\'t be posted. Try removing personal info or links!' : 'Oops, itu tidak bisa diposting. Coba hapus info pribadi atau tautan!'}
        </div>
      )}

      {/* Posts feed */}
      <div className="space-y-4">
        {posts.filter(post=>!reportedPosts.has(post.id)).map((post) => (
          <Card key={post.id}>
            {/* Post header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-ink-50"
                style={{ backgroundColor: post.avatarColor }}
              >
                {post.author.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink-50">{post.author}</p>
                <p className="text-xs text-ink-500">{post.time}</p>
              </div>
              <button
                onClick={() => handleReport(post.id)}
                className="text-ink-500 hover:text-neon-pink p-1"
                aria-label="Report post"
                title="Report"
              >
                {reportedPosts.has(post.id) ? <ShieldAlert size={16} className="text-neon-pink" /> : <Flag size={16} />}
              </button>
            </div>

            {/* Post text */}
            <p className="text-ink-200 mb-4">{post.text}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-neon-pink' : 'text-ink-400 hover:text-ink-50'}`}
              >
                <Heart size={16} className={post.liked ? 'fill-current' : ''} />
                {post.likes}
              </button>

              {/* Comments */}
              {isCreator ? (
                <button
                  onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-ink-400 hover:text-ink-50"
                >
                  <MessageCircle size={16} /> {post.comments + (comments[post.id]?.length || 0)}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {presetReactions.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-lg hover:scale-125 transition-transform"
                      aria-label={`React ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comments section (Creator mode) */}
            {isCreator && openComments === post.id && (
              <div className="mt-4 pt-4 border-t border-ink-700 space-y-3">
                {(comments[post.id] || []).map((c) => (
                  <div key={c.id} className="flex items-start gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-ink-50 flex-shrink-0"
                      style={{ backgroundColor: c.avatarColor }}
                    >
                      {c.author.charAt(0)}
                    </div>
                    <div className="flex-1 bg-ink-800 rounded-lg p-2.5">
                      <p className="text-xs text-ink-500 mb-0.5">{c.author} · {c.time}</p>
                      <p className="text-sm text-ink-200">{c.text}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label="Draft a local comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                    placeholder={language === 'EN' ? 'Add a comment...' : 'Tambahkan komentar...'}
                    className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-ink-50 outline-none focus:border-neon-pink"
                  />
                  <Button size="sm" variant="neon-pink" onClick={() => handleComment(post.id)} ariaLabel="Add local comment">
                    <Send size={14} />
                  </Button>
                </div>
                <p className="text-xs text-ink-500">
                  {language === 'EN' ? 'No DMs here — we keep everything public so everyone stays safe.' : 'Tidak ada DM di sini — kami menjaga semuanya publik agar semua tetap aman.'}
                </p>
              </div>
            )}

            {reportedPosts.has(post.id) && (
              <div className="mt-3 text-xs text-neon-pink flex items-center gap-1">
                <ShieldAlert size={12} /> {language === 'EN' ? 'Reported — hidden until reviewed.' : 'Dilaporkan — disembunyikan hingga ditinjau.'}
              </div>
            )}
          </Card>
        ))}
      </div>

      {reportedPosts.size>0&&<p role="status" className="text-sm mt-4">Hidden from this local feed. No report was sent to a moderation service.</p>}
      <Modal open={guidelines} onClose={()=>setGuidelines(false)} title="Community guidelines"><p>Be kind and discuss ideas respectfully. Do not post personal details, private images, or links to contact strangers. Ask permission before sharing another person’s story. This community is a local demonstration; public posting and human moderation are not connected.</p></Modal>
      {/* Community guidelines link */}
      <Card className="mt-6 text-center">
        <p className="text-sm text-ink-400 mb-2">
          {language === 'EN' ? 'New here? Read our' : 'Baru di sini? Baca'}{' '}
          <button onClick={()=>setGuidelines(true)} className="text-neon-blue underline">
            {language === 'EN' ? 'Community Guidelines' : 'Panduan Komunitas'}
          </button>
        </p>
        <p className="text-xs text-ink-500">
          {language === 'EN' ? 'Be kind. Stay on topic. No personal info. We keep everything public so everyone stays safe.' : 'Jadilah baik. Tetap di topik. Tanpa info pribadi. Kami menjaga semuanya publik agar semua tetap aman.'}
        </p>
      </Card>
    </div>
  );
}
