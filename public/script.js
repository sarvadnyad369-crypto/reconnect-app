
function iconSmile(){
  return `
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <circle cx="9" cy="10" r="1"></circle>
      <circle cx="15" cy="10" r="1"></circle>
      <path d="M8.5 14.2c1 1.3 2.1 2 3.5 2 1.4 0 2.5-.7 3.5-2"></path>
    </svg>
  `;
}
function iconAttach(){
  return `
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 12.5l5.7-5.7a3 3 0 1 1 4.2 4.2l-8.4 8.4a5 5 0 0 1-7.1-7.1l8.7-8.7"></path>
    </svg>
  `;
}
function iconMic(){
  return `
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3"></rect>
      <path d="M6 11.5a6 6 0 0 0 12 0"></path>
      <path d="M12 17.5v3"></path>
      <path d="M9 20.5h6"></path>
    </svg>
  `;
}

function iconGallery(){
  return `
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="3"></rect>
      <circle cx="9" cy="10" r="1.5"></circle>
      <path d="M7 17l4.2-4.2 2.8 2.8 1.8-1.8L20 18"></path>
    </svg>
  `;
}
function iconSticker(){
  return `
    <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v7l-7 7H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"></path>
      <path d="M14 21v-4a3 3 0 0 1 3-3h4"></path>
      <circle cx="9" cy="10" r="1"></circle>
      <circle cx="15" cy="10" r="1"></circle>
      <path d="M8.5 14c1 .9 2.1 1.3 3.5 1.3s2.5-.4 3.5-1.3"></path>
    </svg>
  `;
}
function iconStop(){
  return `
    <svg class="ui-icon recording-stop" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="2"></rect>
    </svg>
  `;
}

function iconSend(){
  return `
    <svg class="ui-icon send-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20l16-8L4 4l3.5 8L20 12"></path>
    </svg>
  `;
}

const THEME_KEY='reconnect_theme_mode_v1';
function getSystemTheme(){return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}function getSavedTheme(){return localStorage.getItem(THEME_KEY)||'system'}function applyTheme(mode){const selected=mode||getSavedTheme();document.body.setAttribute('data-theme',selected==='system'?getSystemTheme():selected);updateThemeControls(selected)}function setTheme(mode){localStorage.setItem(THEME_KEY,mode);applyTheme(mode);toast(mode==='system'?'Theme set to device theme':mode==='light'?'Light mode enabled':'Dark mode enabled')}function updateThemeControls(selected=getSavedTheme()){const s=document.getElementById('themeSelect');if(s)s.value=selected;document.querySelectorAll('[data-theme-option]').forEach(b=>b.classList.toggle('active',b.dataset.themeOption===selected))}function initTheme(){applyTheme(getSavedTheme());matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(getSavedTheme()==='system')applyTheme('system')})}
const API={login:'/api/auth/login',register:'/api/auth/register',me:'/api/auth/me',logout:'/api/auth/logout',feed:'/api/posts/feed',posts:'/api/posts',messages:'/api/messages',users:'/api/users'};const AUTH_TOKEN_KEY='reconnect_auth_token_v2';let activeView='home',currentUserData=null,feedPosts=[],feedFilter='all',feedSearch='';const openComments=new Set();function token(){return localStorage.getItem(AUTH_TOKEN_KEY)}function setToken(v){localStorage.setItem(AUTH_TOKEN_KEY,v)}function clearToken(){localStorage.removeItem(AUTH_TOKEN_KEY)}function escapeHTML(v=''){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;")}function timeAgo(d){const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<1)return'now';if(m<60)return`${m}m ago`;const h=Math.floor(m/60);if(h<24)return`${h}h ago`;return`${Math.floor(h/24)}d ago`}function toast(msg){const e=document.getElementById('toast');e.textContent=msg;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
async function apiFetch(url,opt={}){const headers={'Content-Type':'application/json',...(opt.headers||{})};if(token())headers.Authorization=`Bearer ${token()}`;const res=await fetch(url,{...opt,headers});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||'Request failed');return data}
function showAuthForm(type){document.querySelectorAll('.auth-tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));document.querySelector(`[data-auth-tab="${type}"]`).classList.add('active');document.getElementById(`${type}Form`).classList.add('active')}
async function login(){try{const username=document.getElementById('loginUsername').value.trim().toLowerCase(),password=document.getElementById('loginPassword').value.trim();if(!username||!password)return toast('Enter username and password');const data=await apiFetch(API.login,{method:'POST',body:JSON.stringify({username,password})});setToken(data.token);currentUserData=data.user;toast('Login successful');bootApp()}catch(e){toast(e.message)}}async function register(){try{const displayName=document.getElementById('registerDisplayName').value.trim(),username=document.getElementById('registerUsername').value.trim().toLowerCase().replace(/\s+/g,''),password=document.getElementById('registerPassword').value.trim(),confirm=document.getElementById('registerConfirmPassword').value.trim();if(!displayName||!username||!password)return toast('Fill all fields');if(password.length<6)return toast('Password must be at least 6 characters');if(password!==confirm)return toast('Passwords do not match');const data=await apiFetch(API.register,{method:'POST',body:JSON.stringify({displayName,username,email:'',password})});setToken(data.token);currentUserData=data.user;toast('Account created');bootApp()}catch(e){toast(e.message)}}async function logout(){try{await apiFetch(API.logout,{method:'POST'})}catch{}clearToken();currentUserData=null;feedPosts=[];document.body.classList.add('auth-mode');document.body.classList.remove('app-mode');document.getElementById('appShell').classList.add('hidden');document.getElementById('authScreen').classList.remove('hidden')}
async function forgotPassword(){
  try{
    const username=document.getElementById('forgotUsername').value.trim().toLowerCase();
    const password=document.getElementById('forgotPassword').value.trim();
    const confirm=document.getElementById('forgotConfirmPassword').value.trim();

    if(!username||!password||!confirm) return toast('Fill all reset fields');
    if(password.length<6) return toast('Password must be at least 6 characters');
    if(password!==confirm) return toast('Passwords do not match');

    const data=await apiFetch('/api/auth/forgot-password',{
      method:'POST',
      body:JSON.stringify({username,password})
    });

    toast(data.message||'Password reset successful');
    showAuthForm('login');
    document.getElementById('loginUsername').value=username;
    document.getElementById('loginPassword').value='';
  }catch(e){
    toast(e.message||'Password reset failed');
  }
}
async function bootApp(){try{if(!token())return showLoginScreen();const data=await apiFetch(API.me);currentUserData=data.user;initSession();startActivityHeartbeat();syncDmPrivacyToBackend();document.body.classList.remove('auth-mode');document.body.classList.add('app-mode');document.getElementById('authScreen').classList.add('hidden');document.getElementById('appShell').classList.remove('hidden');await loadFeed();renderLeftProfile();renderRightPanel();switchView(activeView)}catch{clearToken();showLoginScreen()}}function showLoginScreen(){document.body.classList.add('auth-mode');document.body.classList.remove('app-mode');document.getElementById('authScreen').classList.remove('hidden');document.getElementById('appShell').classList.add('hidden')}function renderLeftProfile(){const u=currentUserData;const sideAvatar=document.getElementById('sideAvatar');if(sideAvatar){sideAvatar.innerHTML=renderAvatarHTML(getProfilePhoto(),'🔥');sideAvatar.classList.remove('status-active','status-inactive');sideAvatar.classList.add('status-active')}const personal=typeof getPersonalSettings==='function'?getPersonalSettings():{};document.getElementById('sideName').textContent=personal.displayName||u.displayName||'User';document.getElementById('sideUsername').textContent=`@${u.username}`;document.getElementById('sideStats').textContent=`${u.followers?.length||0} followers • ${u.following?.length||0} following`}
function switchView(view){if(view!=='messages'&&typeof stopChatPolling==='function')stopChatPolling();activeView=view;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));const a=document.querySelector(`[data-view="${view}"]`);if(a)a.classList.add('active');if(view==='home')renderHome();if(view==='explore')renderExplore();if(view==='messages')renderMessages();if(view==='profile')renderProfile();if(view==='settings')renderSettings();if(view==='liked')renderLiked();if(view==='saved')renderSaved()}
async function loadFeed(){const data=await apiFetch(API.feed);feedPosts=data.posts||[];return feedPosts}function renderTopbar(){return`<section class="topbar card"><div class="search"><span>⌕</span><input placeholder="Search posts, moods, people..." value="${escapeHTML(feedSearch)}" oninput="handleSearch(this.value)"></div><div class="top-actions"><span class="chip">● Live DB</span><button class="ghost" onclick="switchView('settings')">Settings</button></div></section>`}function handleSearch(v){feedSearch=v.trim().toLowerCase();refreshCurrentView()}function getFilteredPosts(posts){let f=[...posts];const blockedLocal=typeof getBlockedUsers==='function'?getBlockedUsers():[];const blockedIds=getIdList('blockedUsers');const mutedIds=getIdList('mutedUsers');f=f.filter(p=>{const author=p.author||{};const username=String(author.username||'').toLowerCase();const id=String(author._id||author.id||'');return !blockedLocal.includes(username)&&!blockedIds.includes(id)&&!mutedIds.includes(id)});if(feedFilter==='mine')f=f.filter(p=>p.author?.username===currentUserData.username);if(feedFilter==='popular')f.sort((a,b)=>((b.likes?.length||0)+(b.comments?.length||0))-((a.likes?.length||0)+(a.comments?.length||0)));if(feedSearch)f=f.filter(p=>String(p.content||'').toLowerCase().includes(feedSearch)||String(p.mood||'').toLowerCase().includes(feedSearch)||String(p.author?.displayName||'').toLowerCase().includes(feedSearch)||String(p.author?.username||'').toLowerCase().includes(feedSearch));return f}function setFeedFilter(f){feedFilter=f;refreshCurrentView()}function setMood(m,e){const i=document.getElementById('postMood');if(i)i.value=m;document.querySelectorAll('.mood').forEach(b=>b.classList.remove('active'));if(e)e.classList.add('active')}function togglePremiumSwitch(el,label){el.classList.toggle('active');toast(`${label} ${el.classList.contains('active')?'enabled':'disabled'}`)}
const SAVED_POSTS_BASE_KEY='reconnect_saved_posts_v12';
const PROFILE_SETTINGS_BASE_KEY='reconnect_personal_settings_v12';
const SESSIONS_BASE_KEY='reconnect_sessions_v12';
const CURRENT_SESSION_KEY='reconnect_current_session_id_v12';

function userKeySuffix(){
  return currentUserData?.username || currentUserData?.id || currentUserData?._id || 'guest';
}
function getUserId(){
  return String(currentUserData?.id || currentUserData?._id || '');
}
function savedPostsKey(){
  return `${SAVED_POSTS_BASE_KEY}_${userKeySuffix()}`;
}
function profileSettingsKey(){
  return `${PROFILE_SETTINGS_BASE_KEY}_${userKeySuffix()}`;
}
function sessionsKey(){
  return `${SESSIONS_BASE_KEY}_${userKeySuffix()}`;
}
function readJSON(key, fallback){
  try{
    const value=localStorage.getItem(key);
    return value?JSON.parse(value):fallback;
  }catch{
    return fallback;
  }
}
function writeJSON(key,value){
  localStorage.setItem(key,JSON.stringify(value));
}
function getSavedPostIds(){
  return readJSON(savedPostsKey(),[]);
}
function isPostSaved(postId){
  return getSavedPostIds().map(String).includes(String(postId));
}
function toggleSavePost(postId){
  const id=String(postId);
  let ids=getSavedPostIds().map(String);
  if(ids.includes(id)){
    ids=ids.filter(x=>x!==id);
    toast('Removed from saved posts');
  }else{
    ids.unshift(id);
    toast('Saved post');
  }
  writeJSON(savedPostsKey(),ids);
  refreshCurrentView();
  renderRightPanel();
}
function getLikedPosts(){
  const uid=getUserId();
  return feedPosts.filter(post=>(post.likes||[]).some(id=>String(id)===uid));
}
function getSavedPosts(){
  const ids=getSavedPostIds().map(String);
  return feedPosts.filter(post=>ids.includes(String(post._id)));
}
function getPersonalSettings(){
  const saved=readJSON(profileSettingsKey(),{});
  return {
    displayName:saved.displayName || currentUserData?.displayName || '',
    email:saved.email || currentUserData?.email || '',
    phone:saved.phone || '',
    dob:saved.dob || ''
  };
}
function savePersonalSettings(){
  const data={
    displayName:document.getElementById('profileName')?.value.trim() || currentUserData?.displayName || '',
    email:document.getElementById('profileEmail')?.value.trim() || '',
    phone:document.getElementById('profilePhone')?.value.trim() || '',
    dob:document.getElementById('profileDob')?.value || ''
  };
  writeJSON(profileSettingsKey(),data);
  if(currentUserData){
    currentUserData.displayName=data.displayName || currentUserData.displayName;
    currentUserData.email=data.email;
  }
  renderLeftProfile();
  toast('Personal settings saved locally');
  renderSettings();
}
function browserName(){
  const ua=navigator.userAgent;
  if(ua.includes('Edg'))return 'Microsoft Edge';
  if(ua.includes('Chrome'))return 'Google Chrome';
  if(ua.includes('Firefox'))return 'Firefox';
  if(ua.includes('Safari'))return 'Safari';
  return 'Browser';
}
function deviceLabel(){
  const platform=navigator.platform || 'Unknown device';
  return `${browserName()} on ${platform}`;
}
function initSession(){
  if(!currentUserData)return;
  let sid=localStorage.getItem(CURRENT_SESSION_KEY);
  if(!sid){
    sid=`session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CURRENT_SESSION_KEY,sid);
  }
  const sessions=readJSON(sessionsKey(),[]);
  const now=new Date().toISOString();
  const existing=sessions.find(s=>s.id===sid);
  if(existing){
    existing.lastActive=now;
    existing.status='Current';
  }else{
    sessions.unshift({
      id:sid,
      device:deviceLabel(),
      location:'Local browser',
      createdAt:now,
      lastActive:now,
      status:'Current'
    });
  }
  writeJSON(sessionsKey(),sessions.slice(0,8));
}
function getSessions(){
  initSession();
  return readJSON(sessionsKey(),[]);
}
function removeSession(sessionId){
  const current=localStorage.getItem(CURRENT_SESSION_KEY);
  let sessions=getSessions().filter(s=>s.id!==sessionId);
  writeJSON(sessionsKey(),sessions);
  if(sessionId===current){
    toast('Current session removed');
    logout();
    return;
  }
  toast('Session removed');
  renderSettings();
}
function removeOtherSessions(){
  const current=localStorage.getItem(CURRENT_SESSION_KEY);
  const sessions=getSessions().filter(s=>s.id===current);
  writeJSON(sessionsKey(),sessions);
  toast('Other sessions removed');
  renderSettings();
}
function renderMiniPostCards(posts, emptyText, type='collection'){
  if(!posts.length){
    return `<div class="collection-empty">${emptyText}</div>`;
  }
  return posts.map(post=>{
    const author=post.author||{};
    const saved=isPostSaved(post._id);
    const liked=(post.likes||[]).some(id=>String(id)===getUserId());
    return `
      <article class="collection-post">
        <button class="collection-post-head account-open-head" onclick="openAccountProfile(\`${escapeHTML(author.username||'')}\`)">
          ${avatarBox(author,post.createdAt,'sm')}
          <div>
            <strong>${escapeHTML(author.displayName||'User')}</strong>
            <span>@${escapeHTML(author.username||'user')} • ${statusTextFor(author,post.createdAt)} • ${timeAgo(post.createdAt)}</span>
          </div>
        </button>
        <p>${escapeHTML(post.content||'')}</p>
        ${renderPostMedia(post)}
        <div class="collection-actions">
          <button class="action ${liked?'liked':''}" onclick="likePost('${post._id}')">❤️ ${(post.likes||[]).length}</button>
          <button class="action ${saved?'liked':''}" onclick="toggleSavePost('${post._id}')">${saved?'🔖 Saved':'🔖 Save'}</button>
        </div>
      </article>
    `;
  }).join('');
}
function renderLiked(){
  activeView='liked';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="liked"]');
  if(btn)btn.classList.add('active');
  const liked=getLikedPosts();
  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Collection</p>
      <h1>Liked Posts</h1>
      <p>All posts you have liked on reConnect appear here.</p>
      <div class="settings-pills"><span class="settings-pill">${liked.length} liked posts</span></div>
    </section>
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div><h2>Your liked posts</h2><p>These are pulled from MongoDB likes on your account.</p></div>
        <span class="tag">❤️ Likes</span>
      </div>
      <div class="collection-grid">${renderMiniPostCards(liked,'You have not liked any posts yet.','liked')}</div>
    </section>
  `;
}
function renderSaved(){
  activeView='saved';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="saved"]');
  if(btn)btn.classList.add('active');
  const saved=getSavedPosts();
  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Collection</p>
      <h1>Saved Posts</h1>
      <p>Posts you save are stored locally in this browser for now.</p>
      <div class="settings-pills"><span class="settings-pill">${saved.length} saved posts</span></div>
    </section>
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div><h2>Your saved posts</h2><p>Saved posts are private to your browser until backend saved-post sync is added.</p></div>
        <span class="tag">🔖 Saved</span>
      </div>
      <div class="collection-grid">${renderMiniPostCards(saved,'You have not saved any posts yet.','saved')}</div>
    </section>
  `;
}


const PROFILE_PHOTO_BASE_KEY='reconnect_profile_photo_v16';

function profilePhotoKey(){
  return `${PROFILE_PHOTO_BASE_KEY}_${userKeySuffix ? userKeySuffix() : (currentUserData?.username || 'guest')}`;
}

function getProfilePhoto(){
  if(!currentUserData) return '';
  return localStorage.getItem(profilePhotoKey()) || currentUserData.avatar || '🔥';
}

function isImageAvatar(value){
  return typeof value === 'string' && value.startsWith('data:image/');
}

function renderAvatarHTML(value, fallback='👤'){
  const avatar=value || fallback;
  if(isImageAvatar(avatar)){
    return `<img class="avatar-img" src="${avatar}" alt="Profile picture">`;
  }
  return escapeHTML(avatar);
}

function updateProfilePhotoUI(){
  const avatarEl=document.getElementById('sideAvatar');
  if(avatarEl){
    avatarEl.innerHTML=renderAvatarHTML(getProfilePhoto(),'🔥');
  }
}

function openProfilePhotoModal(){
  if(!currentUserData){
    toast('Login required');
    return;
  }

  const old=document.getElementById('profilePhotoModal');
  if(old) old.remove();

  const current=getProfilePhoto();
  const preview=isImageAvatar(current)
    ? `<img class="profile-photo-preview-img" src="${current}" alt="Current profile picture">`
    : `<div class="profile-photo-preview-emoji">${escapeHTML(current || '🔥')}</div>`;

  document.body.insertAdjacentHTML('beforeend',`
    <section id="profilePhotoModal" class="profile-photo-modal-backdrop" onclick="closeProfilePhotoModal(event)">
      <div class="profile-photo-modal" onclick="event.stopPropagation()">
        <div class="profile-photo-modal-head">
          <div>
            <p class="eyebrow">Profile picture</p>
            <h2>Change your profile picture</h2>
          </div>
          <button class="modal-close-btn" onclick="closeProfilePhotoModal()">×</button>
        </div>

        <div class="profile-photo-preview">${preview}</div>

        <p class="profile-photo-note">
          Choose a new image or remove the current one. For now this is saved locally in this browser.
        </p>

        <input id="profilePhotoInput" type="file" accept="image/*" hidden onchange="handleProfilePhotoFile(this.files[0])">

        <div class="profile-photo-actions">
          <button class="primary-action" onclick="document.getElementById('profilePhotoInput').click()">Change picture</button>
          <button class="primary-action secondary" onclick="removeProfilePhoto()">Remove picture</button>
          <button class="primary-action neutral" onclick="closeProfilePhotoModal()">Cancel</button>
        </div>
      </div>
    </section>
  `);
}

function closeProfilePhotoModal(event){
  if(event && event.target && event.target.id !== 'profilePhotoModal') return;
  const modal=document.getElementById('profilePhotoModal');
  if(modal) modal.remove();
}

function handleProfilePhotoFile(file){
  if(!file) return;

  if(!file.type.startsWith('image/')){
    toast('Please choose an image file');
    return;
  }

  if(file.size > 5 * 1024 * 1024){
    toast('Image is too large. Choose under 5 MB');
    return;
  }

  const reader=new FileReader();

  reader.onload=event=>{
    const img=new Image();

    img.onload=()=>{
      const maxSize=520;
      let {width,height}=img;

      if(width > height && width > maxSize){
        height=Math.round(height * maxSize / width);
        width=maxSize;
      }else if(height >= width && height > maxSize){
        width=Math.round(width * maxSize / height);
        height=maxSize;
      }

      const canvas=document.createElement('canvas');
      canvas.width=width;
      canvas.height=height;

      const ctx=canvas.getContext('2d');
      ctx.drawImage(img,0,0,width,height);

      const dataUrl=canvas.toDataURL('image/jpeg',0.86);

      try{
        localStorage.setItem(profilePhotoKey(),dataUrl);
        if(currentUserData) currentUserData.avatar=dataUrl;

        updateProfilePhotoUI();
        closeProfilePhotoModal();
        renderLeftProfile();

        if(activeView){
          switchView(activeView);
        }

        toast('Profile picture updated');
      }catch(error){
        toast('Could not save image. Try a smaller photo');
      }
    };

    img.onerror=()=>toast('Could not read this image');
    img.src=event.target.result;
  };

  reader.onerror=()=>toast('Could not open this image');
  reader.readAsDataURL(file);
}

function removeProfilePhoto(){
  localStorage.removeItem(profilePhotoKey());

  if(currentUserData){
    currentUserData.avatar='🔥';
  }

  updateProfilePhotoUI();
  closeProfilePhotoModal();
  renderLeftProfile();

  if(activeView){
    switchView(activeView);
  }

  toast('Profile picture removed');
}


const ACTIVITY_BASE_KEY='reconnect_activity_status_v17';
const BLOCKED_USERS_BASE_KEY='reconnect_blocked_users_v17';
const POST_MEDIA_BASE_KEY='reconnect_post_media_v17';
let pendingPostMedia=[];

function activityKey(){
  return `${ACTIVITY_BASE_KEY}_${userKeySuffix()}`;
}
function blockKey(){
  return `${BLOCKED_USERS_BASE_KEY}_${userKeySuffix()}`;
}
function postMediaKey(){
  return `${POST_MEDIA_BASE_KEY}_${userKeySuffix()}`;
}
function markCurrentUserActive(){
  if(!currentUserData?.username) return;
  const map=readJSON(activityKey(),{});
  map[String(currentUserData.username).toLowerCase()]=new Date().toISOString();
  writeJSON(activityKey(),map);
}
function startActivityHeartbeat(){
  markCurrentUserActive();
  sendPresence({});
  if(window.__reconnectActivityTimer) return;
  window.__reconnectActivityTimer=setInterval(()=>{markCurrentUserActive();sendPresence({});},25000);
  ['click','keydown','mousemove','scroll'].forEach(eventName=>{
    window.addEventListener(eventName,markCurrentUserActive,{passive:true});
  });
}
function isUserActive(author={}, createdAt=''){
  const username=String(author?.username||'').toLowerCase();
  if(currentUserData?.username && username===String(currentUserData.username).toLowerCase()) return true;
  const map=readJSON(activityKey(),{});
  const last=map[username];
  if(last && Date.now()-new Date(last).getTime()<120000) return true;
  if(createdAt && Date.now()-new Date(createdAt).getTime()<90000) return true;
  return false;
}
function statusClassFor(author={}, createdAt=''){
  return isUserActive(author,createdAt)?'status-active':'status-inactive';
}
function statusTextFor(author={}, createdAt=''){
  return isUserActive(author,createdAt)?'Active now':'Not active';
}
function getAuthorAvatar(author={}){
  if(currentUserData?.username && author?.username===currentUserData.username) return getProfilePhoto();
  return author?.avatar || '👤';
}
function avatarBox(author={}, createdAt='', size=''){
  const cls=`avatar ${size} ${statusClassFor(author,createdAt)}`.trim();
  return `<div class="${cls}" title="${statusTextFor(author,createdAt)}">${renderAvatarHTML(getAuthorAvatar(author),'👤')}</div>`;
}
function getBlockedUsers(){
  return readJSON(blockKey(),[]).map(u=>String(u).toLowerCase());
}
function blockUsername(){
  const input=document.getElementById('blockUsernameInput');
  const raw=(input?.value||'').trim().replace('@','').toLowerCase();
  if(!raw){
    toast('Enter a username to block');
    return;
  }
  if(currentUserData?.username && raw===String(currentUserData.username).toLowerCase()){
    toast('You cannot block yourself');
    return;
  }
  const blocked=getBlockedUsers();
  if(!blocked.includes(raw)) blocked.unshift(raw);
  writeJSON(blockKey(),blocked);
  if(input) input.value='';
  toast(`@${raw} blocked`);
  renderSettings();
  if(activeView==='home'||activeView==='explore') refreshCurrentView();
}
function unblockUsername(username){
  const blocked=getBlockedUsers().filter(u=>u!==String(username).toLowerCase());
  writeJSON(blockKey(),blocked);
  toast(`@${username} unblocked`);
  renderSettings();
  if(activeView==='home'||activeView==='explore') refreshCurrentView();
}
function getMediaStore(){
  return readJSON(postMediaKey(),{});
}
function saveLocalPostMedia(postId, media){
  if(!postId || !media?.length) return;
  const store=getMediaStore();
  store[String(postId)]=media;
  try{
    writeJSON(postMediaKey(),store);
  }catch{
    toast('Media is too large to save locally');
  }
}
function removeLocalPostMedia(postId){
  const store=getMediaStore();
  delete store[String(postId)];
  writeJSON(postMediaKey(),store);
}
function getPostMedia(post){
  const fromPost=Array.isArray(post.media)?post.media:[];
  const fromLocal=getMediaStore()[String(post._id)]||[];
  return fromPost.length?fromPost:fromLocal;
}
function normaliseMediaItem(item){
  const src=item.src||item.url||item.data||item.path||'';
  const type=item.type||item.mimeType||'';
  const name=item.name||item.filename||'Media';
  return {src,type,name};
}
function renderPostMedia(post){
  const media=getPostMedia(post).map(normaliseMediaItem).filter(m=>m.src);
  if(!media.length) return '';
  return `<div class="post-media-grid ${media.length===1?'single':''}">${media.map(m=>{
    const safeName=escapeHTML(m.name||'Media');
    if(m.type.startsWith('image/')) return `<figure class="post-media-card"><img src="${m.src}" alt="${safeName}"><figcaption>${safeName}</figcaption></figure>`;
    if(m.type.startsWith('video/')) return `<figure class="post-media-card"><video controls src="${m.src}"></video><figcaption>${safeName}</figcaption></figure>`;
    if(m.type.startsWith('audio/')) return `<figure class="post-media-card audio-card"><div class="audio-icon">🎧</div><audio controls src="${m.src}"></audio><figcaption>${safeName}</figcaption></figure>`;
    return `<a class="post-media-file" href="${m.src}" target="_blank" rel="noreferrer">📎 ${safeName}</a>`;
  }).join('')}</div>`;
}
function handlePostMediaFiles(files){
  const list=Array.from(files||[]);
  if(!list.length) return;
  const allowed=['image/','video/','audio/'];
  const available=4-pendingPostMedia.length;
  if(available<=0){
    toast('Maximum 4 media files per post');
    return;
  }
  const selected=list.slice(0,available);
  let loaded=0;
  selected.forEach(file=>{
    if(!allowed.some(prefix=>file.type.startsWith(prefix))){
      toast(`${file.name} is not supported`);
      loaded++;
      return;
    }
    const maxSize=file.type.startsWith('video/')?8*1024*1024:4*1024*1024;
    if(file.size>maxSize){
      toast(`${file.name} is too large`);
      loaded++;
      return;
    }
    const reader=new FileReader();
    reader.onload=e=>{
      pendingPostMedia.push({type:file.type,src:e.target.result,name:file.name,size:file.size});
      loaded++;
      renderPendingMediaPreview();
      if(loaded===selected.length) toast('Media attached');
    };
    reader.onerror=()=>{
      loaded++;
      toast(`Could not read ${file.name}`);
    };
    reader.readAsDataURL(file);
  });
}
function removePendingMedia(index){
  pendingPostMedia.splice(index,1);
  renderPendingMediaPreview();
}
function clearPendingMedia(){
  pendingPostMedia=[];
  renderPendingMediaPreview();
}
function renderPendingMediaPreview(){
  const box=document.getElementById('pendingMediaPreview');
  if(!box) return;
  if(!pendingPostMedia.length){
    box.innerHTML='';
    box.classList.add('hidden');
    return;
  }
  box.classList.remove('hidden');
  box.innerHTML=pendingPostMedia.map((m,i)=>{
    const safe=escapeHTML(m.name);
    let preview='📎';
    if(m.type.startsWith('image/')) preview=`<img src="${m.src}" alt="${safe}">`;
    if(m.type.startsWith('video/')) preview=`<video src="${m.src}"></video>`;
    if(m.type.startsWith('audio/')) preview=`<div class="audio-preview">🎧</div>`;
    return `<div class="pending-media-item">${preview}<span>${safe}</span><button onclick="removePendingMedia(${i})">×</button></div>`;
  }).join('');
}
function renderBlockedList(){
  const blocked=getBlockedUsers();
  if(!blocked.length) return '<div class="collection-empty">No blocked usernames yet.</div>';
  return blocked.map(username=>`<div class="blocked-user-card"><div><strong>@${escapeHTML(username)}</strong><span>Posts from this username are hidden from your feed.</span></div><button class="primary-action secondary" onclick="unblockUsername('${escapeHTML(username)}')">Unblock</button></div>`).join('');
}


const DM_PRIVACY_BASE_KEY='reconnect_dm_privacy_v27';

function dmPrivacyKey(){
  return `${DM_PRIVACY_BASE_KEY}_${userKeySuffix()}`;
}
function getDmPrivacySettings(){
  return readJSON(dmPrivacyKey(),{
    mode:'public',
    selected:[]
  });
}
function saveDmPrivacySettings(){
  const mode=document.querySelector('input[name="dmPrivacyMode"]:checked')?.value || 'public';
  const selectedText=(document.getElementById('dmSelectedPeople')?.value || '')
    .split(',')
    .map(v=>v.trim().replace('@','').toLowerCase())
    .filter(Boolean);
  writeJSON(dmPrivacyKey(),{mode,selected:[...new Set(selectedText)]});
  toast('DM privacy saved');
  renderSettings();
}
function addSelectedDmUser(){
  const input=document.getElementById('dmSelectedInput');
  const username=(input?.value||'').trim().replace('@','').toLowerCase();
  if(!username){
    toast('Enter username');
    return;
  }
  const settings=getDmPrivacySettings();
  if(!settings.selected.includes(username)) settings.selected.unshift(username);
  writeJSON(dmPrivacyKey(),settings);
  if(input) input.value='';
  toast(`@${username} added to selected DM list`);
  renderSettings();
}
function removeSelectedDmUser(username){
  const settings=getDmPrivacySettings();
  settings.selected=settings.selected.filter(u=>u!==username);
  writeJSON(dmPrivacyKey(),settings);
  toast(`@${username} removed`);
  renderSettings();
}
async function syncDmPrivacyToBackend(){
  const settings=getDmPrivacySettings();
  try{
    await apiFetch(`${API.messages}/privacy`,{
      method:'POST',
      body:JSON.stringify(settings)
    });
  }catch{}
}
function renderSelectedDmList(settings){
  if(!settings.selected.length) return '<div class="collection-empty">No selected usernames yet. Add usernames who can DM you.</div>';
  return settings.selected.map(username=>`
    <div class="blocked-user-card">
      <div>
        <strong>@${escapeHTML(username)}</strong>
        <span>Allowed to send you direct messages in selected mode.</span>
      </div>
      <button class="primary-action secondary" onclick="removeSelectedDmUser('${escapeHTML(username)}')">Remove</button>
    </div>
  `).join('');
}

function getIdList(field){
  return (currentUserData?.[field]||[]).map(v=>String(v?._id||v?.id||v));
}
function isFollowingAuthor(author={}){
  const id=String(author?._id||author?.id||'');
  return getIdList('following').includes(id);
}
function isBlockedAuthor(author={}){
  const id=String(author?._id||author?.id||'');
  return getIdList('blockedUsers').includes(id);
}
function isMutedAuthor(author={}){
  const id=String(author?._id||author?.id||'');
  return getIdList('mutedUsers').includes(id);
}
async function accountAction(username, action){
  const clean=String(username||'').replace('@','').toLowerCase();
  if(!clean){
    toast('Username missing');
    return;
  }
  if(clean===String(currentUserData?.username||'').toLowerCase()){
    toast('You cannot use this action on yourself');
    return;
  }
  try{
    const data=await apiFetch(`${API.users}/${encodeURIComponent(clean)}/${action}`,{method:'POST'});
    if(data.user) currentUserData=data.user;
    toast(data.message||'Account updated');
    renderLeftProfile();
    await loadFeed();
    if(activeView==='account-profile') renderAccountProfile(clean);
    else refreshCurrentView();
    renderRightPanel();
  }catch(e){
    toast(e.message||'Action failed');
  }
}
function toggleFollow(username){return accountAction(username,'follow')}
function toggleBlock(username){return accountAction(username,'block')}
function toggleMute(username){return accountAction(username,'mute')}
function renderFollowButton(author={}){
  const username=author?.username;
  if(!username || username===currentUserData?.username) return '';
  const following=isFollowingAuthor(author);
  return `<button class="follow-mini ${following?'following':''}" onclick="event.stopPropagation();toggleFollow('${escapeHTML(username)}')">${following?'Following':'Follow'}</button>`;
}
function renderAccountControlButtons(user={}){
  if(!user?.username || user.username===currentUserData?.username) return '';
  const following=isFollowingAuthor(user);
  const blocked=isBlockedAuthor(user);
  const muted=isMutedAuthor(user);
  return `
    <div class="account-control-row">
      <button class="account-control primary ${following?'active':''}" onclick="toggleFollow('${escapeHTML(user.username)}')">${following?'Unfollow':'Follow'}</button>
      <button class="account-control ${muted?'active muted':''}" onclick="toggleMute('${escapeHTML(user.username)}')">${muted?'Unmute':'Mute'}</button>
      <button class="account-control danger ${blocked?'active':''}" onclick="toggleBlock('${escapeHTML(user.username)}')">${blocked?'Unblock':'Block'}</button>
      <button class="account-control" onclick="switchView('messages');setTimeout(()=>openChat('${escapeHTML(user.username)}'),150)">Message</button>
    </div>
  `;
}
async function openAccountProfile(username){
  const clean=String(username||'').replace('@','').toLowerCase();
  if(!clean) return;
  if(clean===String(currentUserData?.username||'').toLowerCase()){
    renderProfile();
    return;
  }
  renderAccountProfile(clean);
}
async function renderAccountProfile(username){
  activeView='account-profile';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));

  const clean=String(username||'').replace('@','').toLowerCase();

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="card empty">
      Loading @${escapeHTML(clean)} profile...
    </section>
  `;

  try{
    const data=await apiFetch(`${API.users}/${encodeURIComponent(clean)}`);
    const user=data.user||{};
    const posts=data.posts||[];

    document.getElementById('mainContent').innerHTML=`
      ${renderTopbar()}

      <section class="account-profile-page card">
        <div class="account-profile-cover"></div>

        <div class="account-profile-main">
          <div class="avatar big ${presenceClassFor?presenceClassFor(user):''}">
            ${renderAvatarHTML(user.avatar||'👤','👤')}
          </div>

          <div class="account-profile-text">
            <p class="eyebrow">Account Profile</p>
            <h1>${escapeHTML(user.displayName||'User')}</h1>
            <p>@${escapeHTML(user.username||'user')}</p>
          </div>

          ${renderAccountControlButtons(user)}
        </div>
      </section>

      <section class="settings-panel card">
        <div class="settings-panel-head">
          <div>
            <h2>@${escapeHTML(user.username||'user')}'s Posts</h2>
            <p>Only this account's posts are shown here.</p>
          </div>
          <span class="tag">${posts.length} posts</span>
        </div>

        <div id="feedList" class="feed"></div>
      </section>
    `;

    renderFeedList(posts);
  }catch(e){
    document.getElementById('mainContent').innerHTML=`
      ${renderTopbar()}
      <section class="card empty">
        ${escapeHTML(e.message||'Could not load profile')}
      </section>
    `;
  }
}

function renderFeedToolbar(){return`<div class="toolbar"><button class="filter ${feedFilter==='all'?'active':''}" onclick="setFeedFilter('all')">All Posts</button><button class="filter ${feedFilter==='popular'?'active':''}" onclick="setFeedFilter('popular')">Popular</button><button class="filter ${feedFilter==='mine'?'active':''}" onclick="setFeedFilter('mine')">My Posts</button></div>`}
async function renderHome(){const u=currentUserData;document.getElementById('mainContent').innerHTML=`${renderTopbar()}<section class="hero card"><h1>Welcome back, ${escapeHTML((u.displayName||'User').split(' ')[0])}</h1><p>Share updates, build your network, and stay connected with your ideas and people in one clean social workspace.</p><div class="hero-stats"><span class="hero-stat">${feedPosts.length} Posts</span><span class="hero-stat">${u.followers?.length||0} Followers</span><span class="hero-stat">${u.following?.length||0} Following</span></div></section><section class="composer card"><div class="composer-head"><div><p class="eyebrow">Create Post</p><h3>Share text, photos, videos, or audio</h3></div><span class="badge">Live</span></div><div class="compose-row"><div class="avatar sm status-active">${renderAvatarHTML(getProfilePhoto(),'🌐')}</div><textarea id="postText" placeholder="What do you want to share today?"></textarea></div><div id="pendingMediaPreview" class="pending-media-preview hidden"></div><div class="media-tools"><input id="postMediaInput" type="file" accept="image/*,video/*,audio/*" multiple hidden onchange="handlePostMediaFiles(this.files);this.value=''"><button class="media-btn" onclick="document.getElementById('postMediaInput').click()">📷 Photo</button><button class="media-btn" onclick="document.getElementById('postMediaInput').click()">🎬 Video</button><button class="media-btn" onclick="document.getElementById('postMediaInput').click()">🎧 Audio</button><button class="media-btn danger-lite" onclick="clearPendingMedia()">Clear media</button></div><div class="moods"><button class="mood active" onclick="setMood('Thought',this)">Thought</button><button class="mood" onclick="setMood('Build Mode',this)">Build Mode</button><button class="mood" onclick="setMood('Study',this)">Study</button><button class="mood" onclick="setMood('Startup',this)">Startup</button><button class="mood" onclick="setMood('Life Update',this)">Life Update</button><button class="mood" onclick="setMood('Question',this)">Question</button></div><input type="hidden" id="postMood" value="Thought"><div class="compose-actions"><div><span class="tool">Images supported</span> <span class="tool">Video supported</span> <span class="tool">Audio supported</span></div><button class="publish" onclick="createPost()">+ Publish Post</button></div></section>${renderFeedToolbar()}<div id="feedList" class="feed"><div class="card empty">Loading feed...</div></div>`;renderPendingMediaPreview();try{await loadFeed();renderFeedList(getFilteredPosts(feedPosts))}catch(e){document.getElementById('feedList').innerHTML=`<div class="card empty">${escapeHTML(e.message)}</div>`}}function focusComposer(){const i=document.getElementById('postText');if(i)i.focus()}
function renderFeedList(posts){const c=document.getElementById('feedList');if(!posts.length){c.innerHTML='<div class="card empty">No posts found. Create a new post or change the filter.</div>';return}c.innerHTML=posts.map(p=>{const a=p.author||{},liked=(p.likes||[]).some(id=>String(id)===String(currentUserData.id||currentUserData._id)),saved=isPostSaved(p._id),open=openComments.has(p._id),canDelete=String(a._id)===String(currentUserData.id||currentUserData._id);return`<article class="post card"><div class="post-head"><button class="profile-link" onclick="openAccountProfile('${escapeHTML(a.username||'')}')">${avatarBox(a,p.createdAt)}<div><strong>${escapeHTML(a.displayName||'User')}</strong><span>@${escapeHTML(a.username||'user')} • ${statusTextFor(a,p.createdAt)} • ${timeAgo(p.createdAt)}</span></div></button><div class="post-head-actions">${renderFollowButton(a)}<button class="mini-more" onclick="event.stopPropagation();openAccountProfile('${escapeHTML(a.username||'')}')">View</button><span class="mood-pill">${escapeHTML(p.mood||'Thought')}</span></div></div><p class="post-text">${escapeHTML(p.content)}</p>${renderPostMedia(p)}<div class="post-actions"><button class="action ${liked?'liked':''}" onclick="likePost('${p._id}')">❤️ ${(p.likes||[]).length}</button><button class="action" onclick="toggleComments('${p._id}')">💬 ${(p.comments||[]).length}</button><button class="action ${saved?'liked':''}" onclick="toggleSavePost('${p._id}')">${saved?'🔖 Saved':'🔖 Save'}</button><button class="action" onclick="sharePost()">↗ Share</button>${canDelete?`<button class="action" onclick="deletePost('${p._id}')">Delete</button>`:''}</div>${open?renderComments(p):''}</article>`}).join('')}
function renderComments(p){const comments=(p.comments||[]).map(c=>`<div class="comment"><div class="avatar sm">${escapeHTML(c.author?.avatar||'👤')}</div><div><strong>${escapeHTML(c.author?.displayName||'User')}</strong><p>${escapeHTML(c.text)}</p></div></div>`).join('');return`<div class="comments">${comments||'<p class="muted">No comments yet.</p>'}<div class="comment-row"><input id="comment-${p._id}" placeholder="Write a comment..." onkeydown="commentEnter(event,'${p._id}')"><button onclick="addComment('${p._id}')">Send</button></div></div>`}
async function createPost(){try{const input=document.getElementById('postText'),mood=document.getElementById('postMood')?.value||'Thought';let content=input.value.trim();if(!content&&!pendingPostMedia.length)return toast('Write something or attach media first');if(!content&&pendingPostMedia.length)content=`Shared ${pendingPostMedia.length} media file${pendingPostMedia.length>1?'s':''}`;const data=await apiFetch(API.posts,{method:'POST',body:JSON.stringify({content,mood})});const postId=data?.post?._id;if(postId&&pendingPostMedia.length)saveLocalPostMedia(postId,pendingPostMedia);pendingPostMedia=[];toast('Posted on reConnect');await loadFeed();renderHome();renderRightPanel()}catch(e){toast(e.message)}}async function likePost(id){try{await apiFetch(`${API.posts}/${id}/like`,{method:'POST'});await loadFeed();refreshCurrentView()}catch(e){toast(e.message)}}function toggleComments(id){openComments.has(id)?openComments.delete(id):openComments.add(id);refreshCurrentView()}function commentEnter(e,id){if(e.key==='Enter')addComment(id)}async function addComment(id){try{const input=document.getElementById(`comment-${id}`),text=input.value.trim();if(!text)return;await apiFetch(`${API.posts}/${id}/comment`,{method:'POST',body:JSON.stringify({text})});await loadFeed();refreshCurrentView()}catch(e){toast(e.message)}}async function deletePost(id){try{if(!confirm('Delete this post?'))return;await apiFetch(`${API.posts}/${id}`,{method:'DELETE'});removeLocalPostMedia(id);toast('Post deleted');await loadFeed();refreshCurrentView();renderRightPanel()}catch(e){toast(e.message)}}function sharePost(){toast('Share feature will come in next version')}async function refreshCurrentView(){if(activeView==='home')await renderHome();if(activeView==='explore')await renderExplore();if(activeView==='profile')renderProfile();if(activeView==='settings')renderSettings()}
async function renderExplore(){document.getElementById('mainContent').innerHTML=`${renderTopbar()}<div class="page-header"><div><p class="eyebrow">Explore</p><h1>Trending on reConnect</h1></div></div>${renderFeedToolbar()}<div id="feedList" class="feed"></div>`;await loadFeed();renderFeedList(getFilteredPosts(feedPosts))}
let activeChatUsername='';
let chatPollTimer=null;
let presencePollTimer=null;
let chatPresenceMap={};
let chatTypingTimer=null;
let pendingChatMedia=[];
let chatRecorder=null;
let chatRecording=false;
let chatRecordChunks=[];




function toggleEmojiPicker(){
  const picker=document.getElementById('chatEmojiPicker');
  if(!picker) return;
  picker.classList.toggle('hidden');
}

function addChatEmoji(emoji){
  const input=document.getElementById('chatMessageInput');
  if(!input) return;
  input.value=(input.value||'') + emoji;
  input.focus();
}

function openChatFilePicker(){
  const input=document.getElementById('chatMediaInput');
  if(input) input.click();
}

function chatMediaTypeFor(fileType=''){
  const type=String(fileType||'').toLowerCase();
  if(type.startsWith('image/')) return 'image';
  if(type.startsWith('video/')) return 'video';
  if(type.startsWith('audio/')) return 'audio';
  return 'file';
}

function handleChatMediaFiles(fileList){
  const files=Array.from(fileList||[]);
  if(!files.length) return;

  const remaining=4-pendingChatMedia.length;
  if(remaining<=0){
    toast('Maximum 4 attachments per message');
    return;
  }

  sendPresence({sendingMedia:true});
  setTimeout(()=>sendPresence({sendingMedia:false}),3500);

  const accepted=files.slice(0,remaining);
  let done=0;

  accepted.forEach(file=>{
    const maxSize=file.type.startsWith('video/') ? 8*1024*1024 : 5*1024*1024;
    if(file.size>maxSize){
      toast(`${file.name} is too large`);
      done++;
      return;
    }

    const reader=new FileReader();
    reader.onload=e=>{
      pendingChatMedia.push({
        src:e.target.result,
        type:file.type || 'application/octet-stream',
        name:file.name || 'File',
        size:file.size || 0
      });
      done++;
      renderChatPendingMedia();
      if(done===accepted.length) toast('Attachment added');
    };
    reader.onerror=()=>{
      done++;
      toast(`Could not read ${file.name}`);
    };
    reader.readAsDataURL(file);
  });

  const input=document.getElementById('chatMediaInput');
  if(input) input.value='';
}

function removeChatPendingMedia(index){
  pendingChatMedia.splice(index,1);
  renderChatPendingMedia();
}

function clearChatPendingMedia(){
  pendingChatMedia=[];
  renderChatPendingMedia();
}

function renderChatPendingMedia(){
  const box=document.getElementById('chatPendingMedia');
  if(!box) return;

  if(!pendingChatMedia.length){
    box.innerHTML='';
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');
  box.innerHTML=`
    <div class="chat-attachment-header">
      <strong>${pendingChatMedia.length} attachment${pendingChatMedia.length>1?'s':''} selected</strong>
      <span>These will be sent with your message.</span>
      <button onclick="clearChatPendingMedia()">Clear</button>
    </div>
    <div class="chat-attachment-grid">
      ${pendingChatMedia.map((item,index)=>{
        const safeName=escapeHTML(item.name||'File');
        const typeLabel=chatMediaTypeFor(item.type);
        let preview='<div class="chat-media-glyph">📎</div>';
        if(String(item.type).startsWith('image/')) preview=`<img src="${item.src}" alt="${safeName}">`;
        if(String(item.type).startsWith('video/')) preview=`<video src="${item.src}"></video>`;
        if(String(item.type).startsWith('audio/')) preview=`<div class="chat-media-glyph">🎧</div>`;

        return `
          <div class="chat-pending-card">
            ${preview}
            <div class="chat-pending-meta">
              <strong>${safeName}</strong>
              <span>${typeLabel}${item.type==='audio/webm'?' • voice note':''}</span>
            </div>
            <button onclick="removeChatPendingMedia(${index})">×</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

async function toggleVoiceRecording(){
  if(chatRecording){
    sendPresence({recording:false});
    if(chatRecorder) chatRecorder.stop();
    return;
  }

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    toast('Voice recording not supported on this device');
    return;
  }

  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    chatRecordChunks=[];
    chatRecorder=new MediaRecorder(stream);
    chatRecording=true;
    updateVoiceRecordButton();

    chatRecorder.ondataavailable=e=>{
      if(e.data && e.data.size>0) chatRecordChunks.push(e.data);
    };

    chatRecorder.onstop=()=>{
      chatRecording=false;
      sendPresence({recording:false});
      updateVoiceRecordButton();

      const blob=new Blob(chatRecordChunks,{type:'audio/webm'});
      const reader=new FileReader();
      reader.onload=ev=>{
        pendingChatMedia.push({
          src:ev.target.result,
          type:'audio/webm',
          name:`voice-note-${new Date().toISOString().replace(/[:.]/g,'-')}.webm`,
          size:blob.size || 0
        });
        renderChatPendingMedia();
        toast('Voice note added');
      };
      reader.readAsDataURL(blob);

      stream.getTracks().forEach(track=>track.stop());
    };

    chatRecorder.start();
    sendPresence({recording:true});
    toast('Recording started');
  }catch(error){
    toast('Could not access microphone');
  }
}

function updateVoiceRecordButton(){
  const btn=document.getElementById('chatVoiceBtn');
  if(!btn) return;
  btn.innerHTML = chatRecording ? iconStop() : iconMic();
  btn.classList.toggle('recording', chatRecording);
  btn.classList.toggle('core-recording', chatRecording);
}

function renderChatMessageMedia(mediaList=[]){
  const media=Array.isArray(mediaList) ? mediaList : [];
  if(!media.length) return '';

  return `
    <div class="chat-message-media">
      ${media.map(item=>{
        const src=item.url || item.src || '';
        const type=item.type || '';
        const name=escapeHTML(item.name || 'Attachment');

        if(String(type).startsWith('image/')){
          return `<figure class="chat-msg-media-card"><img src="${src}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
        }
        if(String(type).startsWith('video/')){
          return `<figure class="chat-msg-media-card"><video controls src="${src}"></video><figcaption>${name}</figcaption></figure>`;
        }
        if(String(type).startsWith('audio/')){
          return `<figure class="chat-msg-media-card audio"><div class="chat-media-glyph">🎧</div><audio controls src="${src}"></audio><figcaption>${name}</figcaption></figure>`;
        }
        return `<a class="chat-msg-file" href="${src}" target="_blank" rel="noreferrer">📎 ${name}</a>`;
      }).join('')}
    </div>
  `;
}


function humanTimeAgo(input){
  if(!input) return 'not active';
  const diff=Math.max(0,Date.now()-new Date(input).getTime());
  const sec=Math.floor(diff/1000);
  if(sec<20) return 'active now';
  if(sec<60) return `active ${sec}s ago`;
  const min=Math.floor(sec/60);
  if(min<60) return `active ${min}m ago`;
  const hr=Math.floor(min/60);
  if(hr<24) return `active ${hr}h ago`;
  return `active ${Math.floor(hr/24)}d ago`;
}
function presenceFor(username){
  return chatPresenceMap[String(username||'').toLowerCase()]||{};
}
function presenceLineFor(user={}, fallbackCreatedAt=''){
  const username=String(user?.username||activeChatUsername||'').toLowerCase();
  const p=presenceFor(username);
  const now=Date.now();

  if(p.typingUntil && new Date(p.typingUntil).getTime()>now) return 'typing...';
  if(p.recordingUntil && new Date(p.recordingUntil).getTime()>now) return 'recording voice...';
  if(p.sendingMediaUntil && new Date(p.sendingMediaUntil).getTime()>now) return 'sending media...';

  if(p.lastActive) return humanTimeAgo(p.lastActive);
  if(typeof statusTextFor==='function') return statusTextFor(user,fallbackCreatedAt);
  return 'not active';
}
function presenceClassFor(user={}, fallbackCreatedAt=''){
  const username=String(user?.username||activeChatUsername||'').toLowerCase();
  const p=presenceFor(username);
  const last=p.lastActive||fallbackCreatedAt;
  if(last && Date.now()-new Date(last).getTime()<120000) return 'status-active';
  if(typeof statusClassFor==='function') return statusClassFor(user,fallbackCreatedAt);
  return 'status-inactive';
}
async function sendPresence(extra={}){
  if(!token()) return;
  try{
    await apiFetch(`${API.messages}/presence`,{
      method:'POST',
      body:JSON.stringify({chatWith:activeChatUsername||'',...extra})
    });
  }catch{}
}
async function loadPresence(username){
  if(!username||!token()) return {};
  try{
    const data=await apiFetch(`${API.messages}/presence/${encodeURIComponent(username)}`);
    if(data && data.presence){
      chatPresenceMap[String(username).toLowerCase()]=data.presence;
      return data.presence;
    }
  }catch{}
  return {};
}
function startPresencePolling(username){
  stopPresencePolling();
  if(!username) return;
  loadPresence(username).then(forceUpdateChatHeaderStatus);
  presencePollTimer=setInterval(()=>{
    loadPresence(username).then(forceUpdateChatHeaderStatus);
  },900);
}
function stopPresencePolling(){
  if(presencePollTimer){
    clearInterval(presencePollTimer);
    presencePollTimer=null;
  }
}
function updateChatHeaderPresence(){
  forceUpdateChatHeaderStatus();
}
function handleChatTyping(){
  if(!activeChatUsername) return;
  // The other person's screen receives this through backend presence.
  if(chatTypingTimer) clearTimeout(chatTypingTimer);
  sendPresence({typing:true});
  chatTypingTimer=setTimeout(()=>sendPresence({typing:false}),1700);
}
function messageReceiptText(msg={}, mine=false){
  if(!mine) return '';
  if(msg.readAt) return `Read ${new Date(msg.readAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  if(msg.status==='read') return 'Read';
  if(msg.status==='delivered') return 'Delivered';
  return 'Sent';
}

function stopChatPolling(){
  if(chatPollTimer){
    clearInterval(chatPollTimer);
    chatPollTimer=null;
  }
  stopPresencePolling();
}

async function loadConversations(){
  try{
    const data=await apiFetch(`${API.messages}/conversations`);
    const list=data.conversations||[];
    const box=document.getElementById('conversationList');
    if(!box) return;

    if(!list.length){
      box.innerHTML='<div class="collection-empty">No conversations yet. Enter a username to start chatting.</div>';
      return;
    }

    box.innerHTML=list.map(conv=>{
      const user=conv.user||{};
      const last=conv.lastMessage||{};
      const unread=conv.unreadCount||0;
      const avatar=user.avatar||'👤';
      return `
        <button class="conversation-card ${activeChatUsername===user.username?'active':''}" onclick="openChat('${escapeHTML(user.username)}')">
          <div class="avatar sm ${typeof statusClassFor==='function'?statusClassFor(user,last.createdAt):''}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(avatar,'👤'):escapeHTML(avatar)}</div>
          <div>
            <strong>${escapeHTML(user.displayName||user.username||'User')}</strong>
            <span>@${escapeHTML(user.username||'user')}</span>
            <p>${escapeHTML((presenceFor(user.username).typingUntil&&new Date(presenceFor(user.username).typingUntil).getTime()>Date.now())?'typing...':(last.body||'No messages yet'))}</p>
          </div>
          ${unread?`<b>${unread}</b>`:''}
        </button>
      `;
    }).join('');
  }catch(error){
    const box=document.getElementById('conversationList');
    if(box) box.innerHTML=`<div class="collection-empty">${escapeHTML(error.message)}</div>`;
  }
}

function openChatByUsername(){
  const input=document.getElementById('chatUsernameInput');
  const username=(input?.value||'').trim().replace('@','').toLowerCase();
  if(!username){
    toast('Enter username');
    return;
  }
  if(currentUserData?.username && username===String(currentUserData.username).toLowerCase()){
    toast('You cannot chat with yourself');
    return;
  }
  openChat(username);
}

async function openChat(username){
  activeChatUsername=String(username||'').replace('@','').toLowerCase();
  if(!activeChatUsername) return;
  stopChatPolling();
  startPresencePolling(activeChatUsername);
  await loadChatThread();
  chatPollTimer=setInterval(loadChatThread,3500);
}

async function loadChatThread(){
  if(!activeChatUsername) return;

  try{
    const data=await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}`);
    const other=data.user||{username:activeChatUsername};
    const messages=data.messages||[];

    await loadPresence(activeChatUsername);

    const header=document.getElementById('chatThreadHeader');
    if(header){
      const lastTime=messages[messages.length-1]?.createdAt;
      header.innerHTML=`
        <div class="chat-user-head">
          <div id="chatHeaderAvatar" class="avatar sm ${presenceClassFor(other,lastTime)}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(other.avatar||'👤','👤'):escapeHTML(other.avatar||'👤')}</div>
          <div>
            <h2>${escapeHTML(other.displayName||other.username||'User')}</h2>
            <p>@${escapeHTML(other.username||activeChatUsername)} • <span id="chatPresenceLine" class="${['typing...','recording voice...','sending media...'].includes(presenceLineFor(other,lastTime))?'live-action':''}">${escapeHTML(presenceLineFor(other,lastTime))}</span></p>
          </div>
        </div>
      `;
    }

    const box=document.getElementById('chatMessages');
    if(!box) return;

    if(!messages.length){
      box.innerHTML='<div class="collection-empty">No messages yet. Say hello.</div>';
    }else{
      box.innerHTML=messages.map(msg=>{
        const mine=String(msg.sender?._id||msg.sender)===String(currentUserData.id||currentUserData._id);
        const receipt=messageReceiptText(msg,mine);
        return `
          <div class="chat-bubble ${mine?'mine':'theirs'}">
            ${msg.body?`<p>${escapeHTML(msg.body||'')}</p>`:''}
            ${renderChatMessageMedia(msg.media||[])}
            <span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}${receipt?' • '+escapeHTML(receipt):''}</span>
          </div>
        `;
      }).join('');
      box.scrollTop=box.scrollHeight;
    }

    await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}/read`,{method:'PATCH'});
    updateChatHeaderPresence();
    loadConversations();
  }catch(error){
    const box=document.getElementById('chatMessages');
    if(box) box.innerHTML=`<div class="collection-empty">${escapeHTML(error.message)}</div>`;
  }
}

function chatEnter(event){
  if(event.key==='Enter'){
    sendChatMessage();
  }
}

async function sendChatMessage(){
  const input=document.getElementById('chatMessageInput');
  const body=(input?.value||'').trim();

  if(!activeChatUsername){
    toast('Open a chat first');
    return;
  }

  if(!body && !pendingChatMedia.length){
    toast('Write a message or attach media');
    return;
  }

  try{
    if(pendingChatMedia.length) sendPresence({sendingMedia:true});
    const media=pendingChatMedia.map(item=>({
      url:item.src,
      type:item.type,
      name:item.name,
      size:item.size
    }));

    const inferredType = media.length ? chatMediaTypeFor(media[0].type) : 'text';

    await apiFetch(API.messages,{
      method:'POST',
      body:JSON.stringify({
        toUsername:activeChatUsername,
        body,
        type: inferredType,
        media
      })
    });

    if(input) input.value='';
    clearChatPendingMedia();

    const picker=document.getElementById('chatEmojiPicker');
    if(picker) picker.classList.add('hidden');

    await sendPresence({typing:false,recording:false,sendingMedia:false});
    await loadChatThread();
    await loadConversations();
  }catch(error){
    toast(error.message);
  }
}





function forceUpdateChatHeaderStatus(){
  const line=document.getElementById('chatPresenceLine');
  if(line && activeChatUsername){
    const text=presenceLineFor({username:activeChatUsername});
    line.textContent=text;
    line.classList.toggle('live-action', ['typing...','recording voice...','sending media...'].includes(text));
  }
  const avatar=document.getElementById('chatHeaderAvatar');
  if(avatar && activeChatUsername){
    avatar.classList.remove('status-active','status-inactive');
    avatar.classList.add(presenceClassFor({username:activeChatUsername}));
  }
}


const EMOJI_CATEGORIES_V35 = {
  smileys:['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🫣','🤗','🫡','🤔','🫢','🤭','🤫','🤥','😶','🫠','😐','🫤','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕'],
  people:['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','👶','🧒','👦','👧','🧑','👨','👩','🧔','👱','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🧑‍💻','👨‍💻','👩‍💻','🧑‍🎓','🧑‍🏫','🧑‍🔬','🧑‍🚀'],
  nature:['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐂','🐄','🌵','🎄','🌲','🌳','🌴','🪵','🌱','🌿','☘️','🍀','🎍','🪴','🎋','🍃','🍂','🍁','🍄','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','⭐','🌟','✨','⚡','☄️','💥','🔥','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','🌪️','🌫️','🌊'],
  food:['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕','🫖','🍵','🧃','🥤','🧋','🍶'],
  travel:['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼','🚁','🛸','✈️','🛩️','🛫','🛬','🪂','💺','🚀','🛰️','🚉','🚊','🚝','🚞','🚋','🚃','🚋','🚟','🚠','🚡','⛴️','🛥️','🚤','⛵','🛶','🚢','⚓','🛟','⛽','🚧','🚦','🚥','🚏','🗺️','🗿','🗽','🗼','🏰','🏯','🏟️','🎡','🎢','🎠','⛲','⛱️','🏖️','🏝️','🏜️','🌋','⛰️','🏔️','🗻','🏕️','⛺','🛖','🏠','🏡','🏘️','🏚️','🏗️','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛️','⛪','🕌','🕍','🛕','🕋'],
  objects:['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','🗜️','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🪔','🧯','🛢️','💸','💵','💴','💶','💷','🪙','💰','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️','🛠️','⛏️','🪓','🪚','🔩','⚙️','🪤','🧱','⛓️','🧲','🔫','💣','🧨','🪓','🔪','🗡️','⚔️','🛡️','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','💈','⚗️','🔭','🔬','🕳️','🩻','🩹','🩺','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡️','🧹','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣','🧴','🛎️','🔑','🗝️','🚪','🪑','🛋️','🛏️','🛌','🧸','🪆','🖼️','🪞','🪟','🛍️','🛒','🎁','🎈','🎏','🎀','🪄','🪅','🎊','🎉','🎎','🏮','🎐','🧧','✉️','📩','📨','📧','💌','📥','📤','📦','🏷️','📪','📫','📬','📭','📮','📯','📜','📃','📄','📑','🧾','📊','📈','📉','🗒️','🗓️','📆','📅','🗑️','📇','🗃️','🗳️','🗄️','📋','📁','📂','🗂️','🗞️','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎','🖇️','📐','📏','🧮','📌','📍','✂️','🖊️','🖋️','✒️','🖌️','🖍️','📝','✏️'],
  symbols:['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫']
};

const GIF_LIBRARY_V35 = [
  {name:'Happy', tags:'happy smile yay', url:'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif'},
  {name:'Fire', tags:'fire lit awesome', url:'https://media.giphy.com/media/3o72FfM5HJydzafgUE/giphy.gif'},
  {name:'Dance', tags:'dance party', url:'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'},
  {name:'Wow', tags:'wow shocked', url:'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif'},
  {name:'Coding', tags:'coding computer work', url:'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif'},
  {name:'Clap', tags:'clap applause good', url:'https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif'},
  {name:'Success', tags:'success win', url:'https://media.giphy.com/media/ely3apij36BJhoZ234/giphy.gif'},
  {name:'Thinking', tags:'thinking hmm', url:'https://media.giphy.com/media/a5viI92PAF89q/giphy.gif'}
];

function chatEmojiList(){
  return Object.values(EMOJI_CATEGORIES_V35).flat();
}

let activeEmojiCategory='smileys';
let activeChatTray='emoji';

function toggleEmojiPicker(){
  const picker=document.getElementById('chatEmojiPicker');
  if(!picker) return;
  activeChatTray='emoji';
  picker.classList.toggle('hidden');
  if(!picker.classList.contains('hidden')) renderEmojiKeyboard();
}

function openGifPicker(){
  const picker=document.getElementById('chatGifPicker');
  if(!picker) return;
  activeChatTray='gif';
  picker.classList.toggle('hidden');
  if(!picker.classList.contains('hidden')) renderGifKeyboard();
}

function renderEmojiKeyboard(){
  const box=document.getElementById('emojiKeyboardBody');
  const tabs=document.getElementById('emojiCategoryTabs');
  if(!box||!tabs) return;

  const labels={
    smileys:'Smileys',
    people:'People',
    nature:'Nature',
    food:'Food',
    travel:'Travel',
    objects:'Objects',
    symbols:'Symbols'
  };

  tabs.innerHTML=Object.keys(EMOJI_CATEGORIES_V35).map(key=>`
    <button class="${activeEmojiCategory===key?'active':''}" onclick="activeEmojiCategory='${key}';renderEmojiKeyboard()">${labels[key]}</button>
  `).join('');

  box.innerHTML=(EMOJI_CATEGORIES_V35[activeEmojiCategory]||[]).map(e=>`
    <button type="button" onclick="addChatEmoji('${e}')">${e}</button>
  `).join('');
}

function renderGifKeyboard(){
  const grid=document.getElementById('gifKeyboardBody');
  if(!grid) return;
  const q=String(document.getElementById('gifSearchInput')?.value||'').toLowerCase().trim();
  const list=GIF_LIBRARY_V35.filter(g=>!q || g.name.toLowerCase().includes(q)||g.tags.includes(q));

  grid.innerHTML=list.map(g=>`
    <button class="gif-card" onclick="addChatGif('${g.url}','${g.name}')">
      <img src="${g.url}" alt="${g.name}">
      <span>${g.name}</span>
    </button>
  `).join('') || '<div class="collection-empty">No GIF found.</div>';
}

function addChatGif(url,name='GIF'){
  pendingChatMedia.push({
    src:url,
    type:'image/gif',
    name:`${name}.gif`,
    size:0
  });
  renderChatPendingMedia();
  const picker=document.getElementById('chatGifPicker');
  if(picker) picker.classList.add('hidden');
  toast('GIF added');
}

function openGifUpload(){
  const input=document.getElementById('chatGifUploadInput');
  if(input) input.click();
}

function handlePersonalGifFile(file){
  if(!file) return;
  if(!String(file.type).includes('gif')){
    toast('Please select a GIF file');
    return;
  }
  handleChatMediaFiles([file]);
}

function createPersonalGifSticker(){
  const text=(document.getElementById('personalGifText')?.value||'').trim() || 'reConnect';
  const safe=text.replace(/[<>&"]/g, ch=>({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[ch]));
  const svg=`
  <svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1f2937" flood-opacity=".25"/>
      </filter>
    </defs>
    <rect width="420" height="260" rx="42" fill="url(#g)" filter="url(#shadow)">
      <animate attributeName="rx" values="42;70;42" dur="1.6s" repeatCount="indefinite"/>
    </rect>
    <circle cx="70" cy="70" r="28" fill="rgba(255,255,255,.25)">
      <animate attributeName="r" values="18;34;18" dur="1.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="345" cy="196" r="36" fill="rgba(255,255,255,.18)">
      <animate attributeName="r" values="26;44;26" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <text x="210" y="138" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="44" font-weight="900" fill="white">${safe}</text>
    <text x="210" y="185" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800" fill="rgba(255,255,255,.8)">personal GIF sticker</text>
  </svg>`;
  const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  pendingChatMedia.push({
    src:data,
    type:'image/svg+xml',
    name:'personal-gif-sticker.svg',
    size:data.length
  });
  renderChatPendingMedia();
  toast('Personal GIF sticker created');
}

function renderMessages(){
  activeView='messages';

  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="messages"]');
  if(btn)btn.classList.add('active');

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}

    <section class="chat-shell card chat-shell-premium clean-message-screen">
      <aside class="chat-sidebar">
        <div class="chat-start">
          <input id="chatUsernameInput" placeholder="Enter username to chat">
          <button onclick="openChatByUsername()">Open</button>
        </div>

        <div id="conversationList" class="conversation-list">
          <div class="collection-empty">Loading conversations...</div>
        </div>
      </aside>

      <section class="chat-thread">
        <div id="chatThreadHeader" class="chat-thread-header pinned-chat-header">
          <div>
            <h2>Select a conversation</h2>
            <p>Open an existing chat or enter a username.</p>
          </div>
        </div>

        <div id="chatMessages" class="chat-messages chat-messages-premium">
          <div class="collection-empty no-chat-selected-box">No chat selected.</div>
        </div>

        <div class="chat-compose pro-chat-compose clean-chat-compose">
          <div class="composer-popups">
            <div id="chatEmojiPicker" class="emoji-picker core-emoji-picker emoji-keyboard-v35 hidden">
              <div class="chat-tray-title"><strong>Emoji Keyboard</strong><span>More emoji categories like a phone keyboard.</span></div>
              <div id="emojiCategoryTabs" class="emoji-category-tabs"></div>
              <div id="emojiKeyboardBody" class="emoji-keyboard-body"></div>
            </div>

            <div id="chatGifPicker" class="gif-picker-v35 hidden">
              <div class="chat-tray-title"><strong>GIF Studio</strong><span>Search, send, upload, or create your own GIF-style sticker.</span></div>
              <div class="gif-tools-row">
                <input id="gifSearchInput" placeholder="Search GIFs..." oninput="renderGifKeyboard()">
                <button onclick="renderGifKeyboard()">Search</button>
                <button onclick="openGifUpload()">Upload GIF</button>
              </div>
              <input id="chatGifUploadInput" type="file" hidden accept="image/gif" onchange="handlePersonalGifFile(this.files[0]);this.value=''">
              <div class="personal-gif-maker">
                <input id="personalGifText" placeholder="Text for personal GIF">
                <button onclick="createPersonalGifSticker()">Create Personal GIF</button>
              </div>
              <div id="gifKeyboardBody" class="gif-keyboard-body"></div>
            </div>

            <div id="chatPendingMedia" class="chat-pending-media core-pending-media hidden"></div>
          </div>

          <div class="pro-chat-bar no-gap-chat-bar">
            <div class="message-left-zone">
              <button class="pro-chat-icon left" onclick="toggleEmojiPicker()" title="Emoji">${iconSmile()}</button>
              <button class="pro-chat-icon gif-trigger" onclick="openGifPicker()" title="GIF">GIF</button>
              <input id="chatMessageInput" class="pro-chat-input no-gap-input" placeholder="Message..." oninput="handleChatTyping()" onkeydown="chatEnter(event)">
            </div>

            <div class="pro-chat-actions">
              <button id="chatVoiceBtn" class="pro-chat-icon" onclick="toggleVoiceRecording()" title="Voice note">${iconMic()}</button>
              <button class="pro-chat-icon" onclick="openChatFilePicker()" title="Photo / video / file">${iconGallery()}</button>
              <button class="pro-chat-icon" onclick="openChatFilePicker()" title="Attach file">${iconAttach()}</button>
              <button class="pro-chat-send" onclick="sendChatMessage()" title="Send">${iconSend()}</button>
            </div>

            <input id="chatMediaInput" type="file" hidden multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar" onchange="handleChatMediaFiles(this.files)">
          </div>
        </div>
      </section>
    </section>
  `;

  pendingChatMedia=[];
  renderChatPendingMedia();
  updateVoiceRecordButton();
  loadConversations();
}
function renderProfile(){
  const u=currentUserData || {};
  const personal=typeof getPersonalSettings==='function'?getPersonalSettings():{};
  const myPosts=feedPosts.filter(p=>p.author?.username===u.username);

  activeView='profile';

  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="profile"]');
  if(btn)btn.classList.add('active');

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}

    <section class="card profile-card-pro">
      <div class="profile-cover"></div>

      <div class="profile-info">
        <div class="avatar big status-active">${renderAvatarHTML(getProfilePhoto(),'🌐')}</div>

        <div>
          <p class="eyebrow">Profile</p>
          <h1>${escapeHTML(personal.displayName||u.displayName||'User')}</h1>
          <p>@${escapeHTML(u.username||'user')} • Active now</p>
          <p>${escapeHTML(u.bio||'New on reConnect.')}</p>

          <div class="profile-stats-row">
            <span>${myPosts.length} Posts</span>
            <span>${u.followers?.length||0} Followers</span>
            <span>${u.following?.length||0} Following</span>
          </div>
        </div>

        <button class="ghost" onclick="switchView('settings')">Edit Profile</button>
      </div>
    </section>

    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div>
          <h2>Your Posts</h2>
          <p>Posts created by you are shown here.</p>
        </div>
        <span class="tag">${myPosts.length} posts</span>
      </div>

      <div id="feedList" class="feed"></div>
    </section>
  `;

  renderFeedList(myPosts);
}

function renderSettings(){
  const savedTheme=getSavedTheme();
  const u=currentUserData || {};
  const liked=typeof getLikedPosts==='function'?getLikedPosts():[];
  const savedPosts=typeof getSavedPosts==='function'?getSavedPosts():[];
  const personal=typeof getPersonalSettings==='function'?getPersonalSettings():{};
  const sessions=typeof getSessions==='function'?getSessions():[];
  const blocked=typeof getBlockedUsers==='function'?getBlockedUsers():[];

  activeView='settings';

  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="settings"]');
  if(btn)btn.classList.add('active');

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}

    <section class="settings-hero card">
      <p class="eyebrow">Control Center</p>
      <h1>Premium Settings V63</h1>
      <p>Dashboard navigation is fixed. Account, personal settings, blocked usernames, sessions, appearance, and security are available again.</p>
      <div class="settings-pills">
        <span class="settings-pill">@${escapeHTML(u.username||'user')}</span>
        <span class="settings-pill">${feedPosts.length} posts</span>
        <span class="settings-pill">${liked.length} liked</span>
        <span class="settings-pill">${savedPosts.length} saved</span>
        <span class="settings-pill">${blocked.length} blocked</span>
      </div>
    </section>

    <section class="settings-layout">
      <aside class="settings-menu card">
        <div class="settings-title">Settings</div>
        <button class="menu-btn active" onclick="document.getElementById('account').scrollIntoView()">Account</button>
        <button class="menu-btn" onclick="document.getElementById('collections').scrollIntoView()">Post Collections</button>
        <button class="menu-btn" onclick="document.getElementById('blocked').scrollIntoView()">Blocked</button>
        <button class="menu-btn" onclick="document.getElementById('dmprivacy').scrollIntoView()">DM Privacy</button>
        <button class="menu-btn" onclick="document.getElementById('personal').scrollIntoView()">Personal</button>
        <button class="menu-btn" onclick="document.getElementById('sessions').scrollIntoView()">Sessions</button>
        <button class="menu-btn" onclick="document.getElementById('appearance').scrollIntoView()">Appearance</button>
        <button class="menu-btn" onclick="document.getElementById('security').scrollIntoView()">Security</button>
      </aside>

      <div class="settings-content">
        <section id="account" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Account Overview</h2>
              <p>Your identity, activity, posts, collections, and platform settings.</p>
            </div>
            <span class="tag">Active</span>
          </div>

          <div class="account-grid four">
            <div class="account-card">
              <div class="avatar status-active">${renderAvatarHTML(getProfilePhoto(),'🌐')}</div>
              <div>
                <strong>${escapeHTML(personal.displayName||u.displayName||'User')}</strong><br>
                <span>@${escapeHTML(u.username||'user')} • Active now</span>
              </div>
            </div>

            <div class="stat-card">
              <strong>${feedPosts.filter(p=>p.author?.username===u.username).length}</strong><br>
              <span>Your Posts</span>
            </div>

            <div class="stat-card">
              <strong>${liked.length}</strong><br>
              <span>Liked Posts</span>
            </div>

            <div class="stat-card">
              <strong>${savedPosts.length}</strong><br>
              <span>Saved Posts</span>
            </div>
          </div>
        </section>

        <section id="collections" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Post Collections</h2>
              <p>Liked and saved posts now open in separate full pages instead of showing inside settings.</p>
            </div>
            <span class="tag">Collections</span>
          </div>

          <div class="collection-two collection-launcher-v108">
            <button class="collection-open-card-v108" onclick="switchView('liked')">
              <div class="collection-open-icon-v108">❤️</div>
              <div>
                <h3>Liked Posts</h3>
                <p>Open a separate page with every post you have liked.</p>
                <span>${liked.length} liked posts</span>
              </div>
              <b>Open →</b>
            </button>

            <button class="collection-open-card-v108" onclick="switchView('saved')">
              <div class="collection-open-icon-v108">🔖</div>
              <div>
                <h3>Saved Posts</h3>
                <p>Open a separate page with every post you have saved.</p>
                <span>${savedPosts.length} saved posts</span>
              </div>
              <b>Open →</b>
            </button>
          </div>
        </section>

        <section id="blocked" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Blocked Usernames</h2>
              <p>Block usernames to hide their posts from your feed. This list is saved locally for now.</p>
            </div>
            <span class="tag">${blocked.length} blocked</span>
          </div>

          <div class="block-form">
            <input id="blockUsernameInput" placeholder="Enter username, example: rahul">
            <button class="primary-action" onclick="blockUsername()">Block username</button>
          </div>

          <div class="blocked-list">${renderBlockedList()}</div>
        </section>


        <section id="dmprivacy" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Direct Message Privacy</h2>
              <p>Control who can send you DMs.</p>
            </div>
            <span class="tag">DM Control</span>
          </div>

          <div class="dm-privacy-grid">
            <label class="dm-option-card">
              <input type="radio" name="dmPrivacyMode" value="public" ${getDmPrivacySettings().mode==='public'?'checked':''}>
              <strong>Public</strong>
              <span>Anyone can send you a direct message.</span>
            </label>

            <label class="dm-option-card">
              <input type="radio" name="dmPrivacyMode" value="followers" ${getDmPrivacySettings().mode==='followers'?'checked':''}>
              <strong>Followers only</strong>
              <span>Only accounts following you can DM you.</span>
            </label>

            <label class="dm-option-card">
              <input type="radio" name="dmPrivacyMode" value="selected" ${getDmPrivacySettings().mode==='selected'?'checked':''}>
              <strong>Selected people</strong>
              <span>Only usernames you add below can DM you.</span>
            </label>
          </div>

          <div class="block-form">
            <input id="dmSelectedInput" placeholder="Add selected username">
            <button class="primary-action" onclick="addSelectedDmUser()">Add person</button>
          </div>

          <textarea id="dmSelectedPeople" class="hidden">${getDmPrivacySettings().selected.join(',')}</textarea>

          <div class="blocked-list">${renderSelectedDmList(getDmPrivacySettings())}</div>

          <button class="primary-action" onclick="saveDmPrivacySettings();syncDmPrivacyToBackend()">Save DM privacy</button>
        </section>

        <section id="personal" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Personal Settings</h2>
              <p>Update personal details. These are saved locally now; backend profile update can be added next.</p>
            </div>
            <span class="tag">Profile</span>
          </div>

          <div class="personal-form">
            <label>Display name<input id="profileName" value="${escapeHTML(personal.displayName||'')}" placeholder="Your name"></label>
            <label>Email<input id="profileEmail" value="${escapeHTML(personal.email||'')}" placeholder="your@email.com"></label>
            <label>Phone number<input id="profilePhone" value="${escapeHTML(personal.phone||'')}" placeholder="+91..."></label>
            <label>Date of birth<input id="profileDob" type="date" value="${escapeHTML(personal.dob||'')}"></label>
          </div>

          <button class="primary-action" onclick="savePersonalSettings()">Save personal settings</button>
        </section>

        <section id="sessions" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Logged-in Sessions</h2>
              <p>Track this browser session now. Real all-device tracking will need backend session storage.</p>
            </div>
            <span class="tag">${sessions.length} session${sessions.length===1?'':'s'}</span>
          </div>

          <div class="session-list">
            ${
              sessions.map(s=>`
                <div class="session-card">
                  <div>
                    <strong>${escapeHTML(s.device)}</strong>
                    <span>${escapeHTML(s.location)} • ${s.status||'Active'}</span>
                    <small>Started: ${new Date(s.createdAt).toLocaleString()}<br>Last active: ${new Date(s.lastActive).toLocaleString()}</small>
                  </div>

                  <button class="primary-action danger" onclick="removeSession('${s.id}')">${s.id===localStorage.getItem(CURRENT_SESSION_KEY)?'Logout this':'Remove'}</button>
                </div>
              `).join('') || '<div class="collection-empty">No sessions found.</div>'
            }
          </div>

          <button class="primary-action secondary" onclick="removeOtherSessions()">Remove other sessions</button>
        </section>

        <section id="appearance" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Appearance</h2>
              <p>Choose how reConnect should look.</p>
            </div>
            <span class="tag">Theme</span>
          </div>

          <div class="theme-grid">
            <button class="setting-card ${savedTheme==='system'?'active':''}" data-theme-option="system" onclick="setTheme('system')">
              <span class="icon">💻</span>
              <strong>Device Theme</strong>
              <span>Follows your system automatically.</span>
            </button>

            <button class="setting-card ${savedTheme==='light'?'active':''}" data-theme-option="light" onclick="setTheme('light')">
              <span class="icon">☀️</span>
              <strong>Light Mode</strong>
              <span>Bright premium interface.</span>
            </button>

            <button class="setting-card ${savedTheme==='dark'?'active':''}" data-theme-option="dark" onclick="setTheme('dark')">
              <span class="icon">🌙</span>
              <strong>Dark Mode</strong>
              <span>Soft night interface.</span>
            </button>
          </div>

          <div class="quick">
            <div>
              <strong>Quick selector</strong>
              <p class="muted">Compact theme dropdown.</p>
            </div>
            <select id="themeSelect" onchange="setTheme(this.value)">
              <option value="system">Device Theme</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </section>

        <section id="security" class="settings-panel card">
          <div class="settings-panel-head">
            <div>
              <h2>Security Center</h2>
              <p>Backend protection and database status.</p>
            </div>
            <span class="tag">Secure</span>
          </div>

          <div class="security-grid">
            <div class="security-card">
              <strong>JWT Auth</strong>
              <p>Protected routes are active.</p>
              <button class="primary-action secondary" onclick="toast('JWT auth is active')">Check</button>
            </div>

            <div class="security-card">
              <strong>MongoDB Atlas</strong>
              <p>Cloud database connected.</p>
              <button class="primary-action secondary" onclick="toast('MongoDB Atlas connected')">Status</button>
            </div>

            <div class="security-card">
              <strong>Chat Media</strong>
              <p>Emoji, files, voice notes, photos, videos, and audio are available.</p>
              <button class="primary-action secondary" onclick="switchView('messages')">Open chats</button>
            </div>

            <div class="security-card">
              <strong>Session</strong>
              <p>Logout clears local token from this browser.</p>
              <button class="primary-action danger" onclick="logout()">Logout</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  `;

  updateThemeControls(savedTheme);
}

function renderRightPanel(){
  const tags=['#AI','#Startups','#Coding','#College','#Pune','#Projects'];
  const likes=feedPosts.reduce((s,p)=>s+(p.likes?.length||0),0);
  const comments=feedPosts.reduce((s,p)=>s+(p.comments?.length||0),0);
  const liked=typeof getLikedPosts==='function'?getLikedPosts():[];
  const saved=typeof getSavedPosts==='function'?getSavedPosts():[];
  const blocked=typeof getBlockedUsers==='function'?getBlockedUsers():[];

  const panel=document.getElementById('rightPanel');
  if(!panel) return;

  panel.innerHTML=`
    <section class="card right-card">
      <h3>Platform Overview</h3>

      <div class="suggestion">
        <div class="avatar sm status-active">🟢</div>
        <div>
          <strong>MongoDB Atlas</strong>
          <span>Connected cloud database</span>
        </div>
        <button>Live</button>
      </div>

      <div class="suggestion">
        <div class="avatar sm">📝</div>
        <div>
          <strong>${feedPosts.length} posts</strong>
          <span>${likes} likes • ${comments} comments</span>
        </div>
        <button onclick="switchView('home')">View</button>
      </div>

      <div class="suggestion">
        <div class="avatar sm">💬</div>
        <div>
          <strong>Chat Media</strong>
          <span>Emoji, files, voice notes</span>
        </div>
        <button onclick="switchView('messages')">Open</button>
      </div>
    </section>

    <section class="card right-card">
      <h3>Your Library</h3>

      <button class="trend" onclick="switchView('liked')">
        <strong>❤️ Liked Posts</strong>
        <span>${liked.length}</span>
      </button>

      <button class="trend" onclick="switchView('saved')">
        <strong>🔖 Saved Posts</strong>
        <span>${saved.length}</span>
      </button>

      <button class="trend" onclick="switchView('settings')">
        <strong>🚫 Blocked Users</strong>
        <span>${blocked.length}</span>
      </button>
    </section>

    <section class="card right-card">
      <h3>Trending</h3>
      ${tags.map((t,i)=>`
        <button class="trend" onclick="switchView('explore')">
          <strong>${t}</strong>
          <span>${Math.max(feedPosts.length+i,i+2)} posts</span>
        </button>
      `).join('')}
    </section>

    <section class="card right-card">
      <h3>V63 Search Only</h3>
      <p class="muted">Follow/following setup is active with counts, lists, suggestions, and follow/unfollow from profile pages.</p>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  if(typeof initRailTooltips==='function') initRailTooltips();
  bootApp();
});


/* =========================================================
   V29 FOLLOW / FOLLOWING SYSTEM OVERRIDES
   Full follow setup: counts, lists, suggestions and actions.
   ========================================================= */
let activeProfileUsernameV29 = '';
let activeConnectionsUsernameV29 = '';
let activeConnectionsTypeV29 = 'followers';

async function refreshCurrentUser(){
  try{
    const data=await apiFetch(API.me);
    if(data.user) currentUserData=data.user;
    if(typeof renderLeftProfile==='function') renderLeftProfile();
  }catch{}
}

function getIdList(field){
  return (currentUserData?.[field]||[]).map(v=>String(v?._id||v?.id||v));
}

function userIdOf(user={}){
  return String(user?._id||user?.id||'');
}

function followerCountOf(user={}){
  return (user.followers||[]).length || 0;
}

function followingCountOf(user={}){
  return (user.following||[]).length || 0;
}

function isFollowingAuthor(author={}){
  const id=userIdOf(author);
  return Boolean(id && getIdList('following').includes(id));
}

function isBlockedAuthor(author={}){
  const id=userIdOf(author);
  return Boolean(id && getIdList('blockedUsers').includes(id));
}

function isMutedAuthor(author={}){
  const id=userIdOf(author);
  return Boolean(id && getIdList('mutedUsers').includes(id));
}

function renderFollowStats(user={}, username=''){
  const clean=(username || user.username || currentUserData?.username || '').toLowerCase();
  return `
    <div class="follow-stats">
      <button onclick="openConnections('${escapeHTML(clean)}','followers')">
        <strong>${followerCountOf(user)}</strong>
        <span>Followers</span>
      </button>
      <button onclick="openConnections('${escapeHTML(clean)}','following')">
        <strong>${followingCountOf(user)}</strong>
        <span>Following</span>
      </button>
    </div>
  `;
}

async function accountAction(username, action){
  const clean=String(username||'').replace('@','').toLowerCase();
  if(!clean) return toast('Username missing');
  if(clean===String(currentUserData?.username||'').toLowerCase()) return toast('You cannot use this action on yourself');

  try{
    const data=await apiFetch(`${API.users}/${encodeURIComponent(clean)}/${action}`,{method:'POST'});
    if(data.user) currentUserData=data.user;
    await refreshCurrentUser();
    await loadFeed();
    toast(data.message||'Account updated');

    if(activeView==='account-profile'){
      await renderAccountProfile(activeProfileUsernameV29 || clean);
    }else if(activeView==='connections'){
      await openConnections(activeConnectionsUsernameV29, activeConnectionsTypeV29);
    }else{
      refreshCurrentView();
    }

    renderRightPanel();
  }catch(e){
    toast(e.message||'Action failed');
  }
}

function toggleFollow(username){ return accountAction(username,'follow'); }
function toggleBlock(username){ return accountAction(username,'block'); }
function toggleMute(username){ return accountAction(username,'mute'); }

function renderFollowButton(author={}){
  const username=author?.username;
  if(!username || username===currentUserData?.username) return '';
  const following=isFollowingAuthor(author);
  return `<button class="follow-mini ${following?'following':''}" onclick="event.stopPropagation();toggleFollow('${escapeHTML(username)}')">${following?'Following':'Follow'}</button>`;
}

function renderAccountControlButtons(user={}){
  if(!user?.username || user.username===currentUserData?.username) return '';
  const following=isFollowingAuthor(user);
  const blocked=isBlockedAuthor(user);
  const muted=isMutedAuthor(user);
  return `
    <div class="account-control-row">
      <button class="account-control primary ${following?'active':''}" onclick="toggleFollow('${escapeHTML(user.username)}')">${following?'Unfollow':'Follow'}</button>
      <button class="account-control ${muted?'active muted':''}" onclick="toggleMute('${escapeHTML(user.username)}')">${muted?'Unmute':'Mute'}</button>
      <button class="account-control danger ${blocked?'active':''}" onclick="toggleBlock('${escapeHTML(user.username)}')">${blocked?'Unblock':'Block'}</button>
      <button class="account-control" onclick="switchView('messages');setTimeout(()=>openChat('${escapeHTML(user.username)}'),150)">Message</button>
    </div>
  `;
}

async function openAccountProfile(username){
  const clean=String(username||'').replace('@','').toLowerCase();
  if(!clean) return;
  if(clean===String(currentUserData?.username||'').toLowerCase()) return renderProfile();
  return renderAccountProfile(clean);
}

async function renderAccountProfile(username){
  activeView='account-profile';
  activeProfileUsernameV29=String(username||'').replace('@','').toLowerCase();
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="card empty">Loading @${escapeHTML(activeProfileUsernameV29)} profile...</section>
  `;

  try{
    const data=await apiFetch(`${API.users}/${encodeURIComponent(activeProfileUsernameV29)}`);
    const user=data.user||{};
    const posts=data.posts||[];

    document.getElementById('mainContent').innerHTML=`
      ${renderTopbar()}

      <section class="account-profile-page card">
        <div class="account-profile-cover"></div>
        <div class="account-profile-main">
          <div class="avatar big ${typeof presenceClassFor==='function'?presenceClassFor(user):''}">
            ${renderAvatarHTML(user.avatar||'👤','👤')}
          </div>
          <div class="account-profile-text">
            <p class="eyebrow">Account Profile</p>
            <h1>${escapeHTML(user.displayName||'User')}</h1>
            <p>@${escapeHTML(user.username||'user')}</p>
            ${renderFollowStats(user,user.username)}
          </div>
          ${renderAccountControlButtons(user)}
        </div>
      </section>

      <section class="settings-panel card follow-suggestions-card">
        <div class="settings-panel-head">
          <div>
            <h2>Suggested Accounts</h2>
            <p>Discover and follow more accounts.</p>
          </div>
          <span class="tag">Follow setup</span>
        </div>
        <div id="followSuggestionsBox" class="connection-list">
          <div class="collection-empty">Loading suggestions...</div>
        </div>
      </section>

      <section class="settings-panel card">
        <div class="settings-panel-head">
          <div>
            <h2>@${escapeHTML(user.username||'user')}'s Posts</h2>
            <p>Only this account's posts are shown here.</p>
          </div>
          <span class="tag">${posts.length} posts</span>
        </div>
        <div id="feedList" class="feed"></div>
      </section>
    `;

    renderFeedList(posts);
    renderFollowSuggestions();
  }catch(e){
    document.getElementById('mainContent').innerHTML=`${renderTopbar()}<section class="card empty">${escapeHTML(e.message||'Could not load profile')}</section>`;
  }
}

async function openConnections(username,type='followers'){
  activeView='connections';
  activeConnectionsUsernameV29=String(username||'').replace('@','').toLowerCase();
  activeConnectionsTypeV29=type==='following'?'following':'followers';

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Connections</p>
      <h1>@${escapeHTML(activeConnectionsUsernameV29)} ${activeConnectionsTypeV29==='followers'?'Followers':'Following'}</h1>
      <p>Loading accounts...</p>
    </section>
  `;

  try{
    const data=await apiFetch(`${API.users}/${encodeURIComponent(activeConnectionsUsernameV29)}/connections?type=${encodeURIComponent(activeConnectionsTypeV29)}`);
    const users=data.users||[];
    document.getElementById('mainContent').innerHTML=`
      ${renderTopbar()}
      <section class="settings-hero card">
        <p class="eyebrow">Connections</p>
        <h1>@${escapeHTML(activeConnectionsUsernameV29)} ${activeConnectionsTypeV29==='followers'?'Followers':'Following'}</h1>
        <p>${users.length} account${users.length===1?'':'s'} found.</p>
        <div class="settings-pills">
          <span class="settings-pill">${users.length} ${activeConnectionsTypeV29}</span>
          <span class="settings-pill">Follow setup</span>
        </div>
      </section>
      <section class="settings-panel card">
        <div class="settings-panel-head">
          <div>
            <h2>${activeConnectionsTypeV29==='followers'?'Followers':'Following'}</h2>
            <p>Click any account to open profile, or use follow/unfollow.</p>
          </div>
          <button class="primary-action secondary" onclick="openAccountProfile('${escapeHTML(activeConnectionsUsernameV29)}')">Back to profile</button>
        </div>
        <div class="connection-list">${renderConnectionCards(users)}</div>
      </section>
    `;
  }catch(e){
    toast(e.message||'Could not load connections');
  }
}

function renderConnectionCards(users=[]){
  if(!users.length) return '<div class="collection-empty">No accounts found.</div>';
  return users.map(user=>{
    const isMe=user.username===currentUserData?.username;
    const following=isFollowingAuthor(user);
    return `
      <div class="connection-card">
        <button class="connection-user" onclick="openAccountProfile('${escapeHTML(user.username)}')">
          <div class="avatar sm ${typeof presenceClassFor==='function'?presenceClassFor(user):''}">${renderAvatarHTML(user.avatar||'👤','👤')}</div>
          <div>
            <strong>${escapeHTML(user.displayName||'User')}</strong>
            <span>@${escapeHTML(user.username||'user')}</span>
          </div>
        </button>
        ${isMe?'<span class="tag">You</span>':`<button class="follow-mini ${following?'following':''}" onclick="toggleFollow('${escapeHTML(user.username)}')">${following?'Following':'Follow'}</button>`}
      </div>
    `;
  }).join('');
}

async function loadFollowSuggestions(){
  try{
    const data=await apiFetch(`${API.users}/suggestions/list`);
    return data.users||[];
  }catch{
    return [];
  }
}

async function renderFollowSuggestions(){
  const box=document.getElementById('followSuggestionsBox');
  if(!box) return;
  const users=await loadFollowSuggestions();
  box.innerHTML=renderConnectionCards(users);
}

function getFilteredPosts(posts){
  let f=[...posts];
  const blockedLocal=typeof getBlockedUsers==='function'?getBlockedUsers():[];
  const blockedIds=getIdList('blockedUsers');
  const mutedIds=getIdList('mutedUsers');

  f=f.filter(p=>{
    const author=p.author||{};
    const username=String(author.username||'').toLowerCase();
    const id=userIdOf(author);
    return !blockedLocal.includes(username)&&!blockedIds.includes(id)&&!mutedIds.includes(id);
  });

  if(feedFilter==='mine')f=f.filter(p=>p.author?.username===currentUserData.username);
  if(feedFilter==='popular')f.sort((a,b)=>((b.likes?.length||0)+(b.comments?.length||0))-((a.likes?.length||0)+(a.comments?.length||0)));
  if(feedSearch)f=f.filter(p=>String(p.content||'').toLowerCase().includes(feedSearch)||String(p.mood||'').toLowerCase().includes(feedSearch)||String(p.author?.displayName||'').toLowerCase().includes(feedSearch)||String(p.author?.username||'').toLowerCase().includes(feedSearch));
  return f;
}

function renderFeedList(posts){
  const c=document.getElementById('feedList');
  if(!posts.length){
    c.innerHTML='<div class="card empty">No posts found. Create a new post or change the filter.</div>';
    return;
  }
  c.innerHTML=posts.map(p=>{
    const a=p.author||{};
    const liked=(p.likes||[]).some(id=>String(id)===String(currentUserData.id||currentUserData._id));
    const saved=isPostSaved(p._id);
    const open=openComments.has(p._id);
    const canDelete=String(a._id)===String(currentUserData.id||currentUserData._id);
    return `<article class="post card"><div class="post-head"><button class="profile-link" onclick="openAccountProfile('${escapeHTML(a.username||'')}')">${avatarBox(a,p.createdAt)}<div><strong>${escapeHTML(a.displayName||'User')}</strong><span>@${escapeHTML(a.username||'user')} • ${statusTextFor(a,p.createdAt)} • ${timeAgo(p.createdAt)}</span></div></button><div class="post-head-actions">${renderFollowButton(a)}<button class="mini-more" onclick="event.stopPropagation();openAccountProfile('${escapeHTML(a.username||'')}')">View</button><span class="mood-pill">${escapeHTML(p.mood||'Thought')}</span></div></div><p class="post-text">${escapeHTML(p.content)}</p>${renderPostMedia(p)}<div class="post-actions"><button class="action ${liked?'liked':''}" onclick="likePost('${p._id}')">❤️ ${(p.likes||[]).length}</button><button class="action" onclick="toggleComments('${p._id}')">💬 ${(p.comments||[]).length}</button><button class="action ${saved?'liked':''}" onclick="toggleSavePost('${p._id}')">${saved?'🔖 Saved':'🔖 Save'}</button><button class="action" onclick="sharePost()">↗ Share</button>${canDelete?`<button class="action" onclick="deletePost('${p._id}')">Delete</button>`:''}</div>${open?renderComments(p):''}</article>`;
  }).join('');
}

function renderProfile(){
  const u=currentUserData || {};
  const personal=typeof getPersonalSettings==='function'?getPersonalSettings():{};
  const myPosts=feedPosts.filter(p=>p.author?.username===u.username);
  activeView='profile';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('[data-view="profile"]');
  if(btn)btn.classList.add('active');

  document.getElementById('mainContent').innerHTML=`
    ${renderTopbar()}
    <section class="card profile-card-pro">
      <div class="profile-cover"></div>
      <div class="profile-info">
        <div class="avatar big status-active">${renderAvatarHTML(getProfilePhoto(),'🌐')}</div>
        <div>
          <p class="eyebrow">Profile</p>
          <h1>${escapeHTML(personal.displayName||u.displayName||'User')}</h1>
          <p>@${escapeHTML(u.username||'user')} • Active now</p>
          <p>${escapeHTML(u.bio||'New on reConnect.')}</p>
          ${renderFollowStats(u,u.username)}
        </div>
        <button class="ghost" onclick="switchView('settings')">Edit Profile</button>
      </div>
    </section>

    <section class="settings-panel card follow-suggestions-card">
      <div class="settings-panel-head">
        <div><h2>Suggested Accounts</h2><p>Discover and follow more accounts.</p></div>
        <span class="tag">Follow setup</span>
      </div>
      <div id="followSuggestionsBox" class="connection-list"><div class="collection-empty">Loading suggestions...</div></div>
    </section>

    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div><h2>Your Posts</h2><p>Posts created by you are shown here.</p></div>
        <span class="tag">${myPosts.length} posts</span>
      </div>
      <div id="feedList" class="feed"></div>
    </section>
  `;
  renderFeedList(myPosts);
  renderFollowSuggestions();
}


/* =========================================================
   V36 EMOJI/GIF TRAY + ACTIVITY STATUS FIX
   ========================================================= */

function closeChatTrays(except=''){
  const emoji=document.getElementById('chatEmojiPicker');
  const gif=document.getElementById('chatGifPicker');

  if(emoji && except!=='emoji') emoji.classList.add('hidden');
  if(gif && except!=='gif') gif.classList.add('hidden');
}

function toggleEmojiPicker(){
  const picker=document.getElementById('chatEmojiPicker');
  if(!picker) return;

  const willOpen=picker.classList.contains('hidden');
  closeChatTrays('emoji');

  if(willOpen){
    activeChatTray='emoji';
    picker.classList.remove('hidden');
    renderEmojiKeyboard();
  }else{
    picker.classList.add('hidden');
  }

  const input=document.getElementById('chatMessageInput');
  if(input) input.focus();
}

function openGifPicker(){
  const picker=document.getElementById('chatGifPicker');
  if(!picker) return;

  const willOpen=picker.classList.contains('hidden');
  closeChatTrays('gif');

  if(willOpen){
    activeChatTray='gif';
    picker.classList.remove('hidden');
    renderGifKeyboard();
  }else{
    picker.classList.add('hidden');
  }

  const input=document.getElementById('chatMessageInput');
  if(input) input.focus();
}

function renderGifKeyboard(){
  const grid=document.getElementById('gifKeyboardBody');
  if(!grid) return;

  const q=String(document.getElementById('gifSearchInput')?.value||'').toLowerCase().trim();
  const list=GIF_LIBRARY_V35.filter(g=>!q || g.name.toLowerCase().includes(q)||g.tags.includes(q));

  grid.innerHTML=list.map(g=>`
    <button class="gif-card clean-gif-card" onclick="addChatGif('${g.url}','${g.name}')" title="${escapeHTML(g.name)}">
      <img src="${g.url}" alt="${escapeHTML(g.name)}">
    </button>
  `).join('') || '<div class="collection-empty">No GIF found.</div>';
}

function startActivityHeartbeat(){
  let lastPresencePing=0;

  const pingActive=()=>{
    markCurrentUserActive();

    const now=Date.now();
    if(now-lastPresencePing>2500){
      lastPresencePing=now;
      sendPresence({});
    }

    const sideAvatar=document.getElementById('sideAvatar');
    if(sideAvatar){
      sideAvatar.classList.remove('status-inactive');
      sideAvatar.classList.add('status-active');
    }
  };

  pingActive();

  if(window.__reconnectActivityTimer){
    clearInterval(window.__reconnectActivityTimer);
  }

  window.__reconnectActivityTimer=setInterval(pingActive,10000);

  if(!window.__reconnectActivityListenersAdded){
    ['click','keydown','mousemove','pointermove','scroll','touchstart','focus'].forEach(eventName=>{
      window.addEventListener(eventName,pingActive,{passive:true});
    });

    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden) pingActive();
    });

    window.__reconnectActivityListenersAdded=true;
  }
}


/* =========================================================
   V37 LOGIN DASHBOARD RECOVERY FIX
   Prevents successful login from falling back to login page.
   ========================================================= */

const CURRENT_USER_CACHE_KEY_V37 = 'reconnect_cached_user_v37';

function cacheCurrentUserV37(user){
  try{
    if(user) localStorage.setItem(CURRENT_USER_CACHE_KEY_V37, JSON.stringify(user));
  }catch{}
}

function getCachedUserV37(){
  try{
    return JSON.parse(localStorage.getItem(CURRENT_USER_CACHE_KEY_V37) || 'null');
  }catch{
    return null;
  }
}

/* V38: ensure login recovery never forces grid layout */
function showAppShellV37(){
  document.body.classList.remove('auth-mode');
  document.body.classList.add('app-mode');

  const auth=document.getElementById('authScreen');
  const shell=document.getElementById('appShell');

  if(auth) auth.classList.add('hidden');
  if(shell){
    shell.classList.remove('hidden');
    shell.style.display='block';
  }
}

function showLoginScreen(){
  document.body.classList.add('auth-mode');
  document.body.classList.remove('app-mode');

  const auth=document.getElementById('authScreen');
  const shell=document.getElementById('appShell');

  if(auth) auth.classList.remove('hidden');
  if(shell) shell.classList.add('hidden');
}

function renderDashboardFallbackV37(errorMessage='Dashboard render issue fixed mode'){
  const main=document.getElementById('mainContent');
  if(!main) return;

  const name=currentUserData?.displayName || currentUserData?.username || 'User';

  main.innerHTML=`
    ${typeof renderTopbar==='function' ? renderTopbar() : ''}
    <section class="hero card">
      <h1>Welcome back, ${escapeHTML(String(name).split(' ')[0])}</h1>
      <p>Your login is successful. A small dashboard module failed to load, so recovery mode opened the home page safely.</p>
      <div class="hero-stats">
        <span class="hero-stat">Recovery Mode</span>
        <span class="hero-stat">Logged In</span>
      </div>
    </section>
    <section class="card empty">
      ${escapeHTML(errorMessage)}
    </section>
  `;
}

async function enterDashboardV37(userFromLogin=null){
  if(userFromLogin){
    currentUserData=userFromLogin;
    cacheCurrentUserV37(userFromLogin);
  }

  if(!currentUserData){
    currentUserData=getCachedUserV37();
  }

  if(!currentUserData){
    throw new Error('No user data available after login');
  }

  showAppShellV37();

  try{ initSession(); }catch(e){ console.warn('initSession failed', e); }
  try{ startActivityHeartbeat(); }catch(e){ console.warn('activity failed', e); }
  try{ syncDmPrivacyToBackend && syncDmPrivacyToBackend(); }catch(e){}

  try{
    await loadFeed();
  }catch(e){
    console.warn('loadFeed failed', e);
    feedPosts = Array.isArray(feedPosts) ? feedPosts : [];
  }

  try{ renderLeftProfile(); }catch(e){ console.warn('left profile failed', e); }
  try{ renderRightPanel(); }catch(e){ console.warn('right panel failed', e); }

  try{
    activeView = activeView || 'home';
    switchView(activeView === 'account-profile' ? 'home' : activeView);
  }catch(e){
    console.error('Dashboard render failed:', e);
    renderDashboardFallbackV37(e.message || 'Dashboard render failed');
  }
}

async function login(){
  try{
    const username=document.getElementById('loginUsername').value.trim().toLowerCase();
    const password=document.getElementById('loginPassword').value.trim();

    if(!username||!password) return toast('Enter username and password');

    const data=await apiFetch(API.login,{
      method:'POST',
      body:JSON.stringify({username,password})
    });

    setToken(data.token);
    currentUserData=data.user;
    cacheCurrentUserV37(data.user);

    toast('Login successful');

    await enterDashboardV37(data.user);
  }catch(e){
    console.error('Login/startup error:', e);
    toast(e.message || 'Login failed');
  }
}

async function register(){
  try{
    const displayName=document.getElementById('registerDisplayName').value.trim();
    const username=document.getElementById('registerUsername').value.trim().toLowerCase().replace(/\s+/g,'');
    const password=document.getElementById('registerPassword').value.trim();
    const confirm=document.getElementById('registerConfirmPassword').value.trim();

    if(!displayName||!username||!password) return toast('Fill all fields');
    if(password.length<6) return toast('Password must be at least 6 characters');
    if(password!==confirm) return toast('Passwords do not match');

    const data=await apiFetch(API.register,{
      method:'POST',
      body:JSON.stringify({displayName,username,email:'',password})
    });

    setToken(data.token);
    currentUserData=data.user;
    cacheCurrentUserV37(data.user);

    toast('Account created');

    await enterDashboardV37(data.user);
  }catch(e){
    console.error('Register/startup error:', e);
    toast(e.message || 'Register failed');
  }
}

async function bootApp(){
  try{
    if(!token()) return showLoginScreen();

    try{
      const data=await apiFetch(API.me);
      currentUserData=data.user;
      cacheCurrentUserV37(data.user);
    }catch(meError){
      console.warn('/api/auth/me failed, using cached login user if available:', meError);
      currentUserData = currentUserData || getCachedUserV37();

      if(!currentUserData){
        clearToken();
        return showLoginScreen();
      }
    }

    await enterDashboardV37(currentUserData);
  }catch(e){
    console.error('bootApp fatal:', e);

    // Do not throw back to login if token/user exists.
    if(token() && (currentUserData || getCachedUserV37())){
      currentUserData = currentUserData || getCachedUserV37();
      showAppShellV37();
      renderDashboardFallbackV37(e.message || 'Startup recovery mode');
      return;
    }

    clearToken();
    showLoginScreen();
  }
}

async function logout(){
  try{ await apiFetch(API.logout,{method:'POST'}); }catch{}
  clearToken();
  currentUserData=null;
  feedPosts=[];
  try{ localStorage.removeItem(CURRENT_USER_CACHE_KEY_V37); }catch{}
  showLoginScreen();
}


/* =========================================================
   V39 EMOJI KEYBOARD LAYOUT FIX
   Ensures emoji panel renders as a proper keyboard grid.
   ========================================================= */

function ensureEmojiKeyboardShellV39(){
  const picker=document.getElementById('chatEmojiPicker');
  if(!picker) return;

  if(!document.getElementById('emojiCategoryTabs') || !document.getElementById('emojiKeyboardBody')){
    picker.innerHTML=`
      <div class="chat-tray-title"><strong>Emoji Keyboard</strong><span>Choose emoji and keep typing below.</span></div>
      <div id="emojiCategoryTabs" class="emoji-category-tabs"></div>
      <div id="emojiKeyboardBody" class="emoji-keyboard-body"></div>
    `;
  }

  picker.classList.add('emoji-keyboard-v39');
}

const __oldToggleEmojiPickerV39 = typeof toggleEmojiPicker === 'function' ? toggleEmojiPicker : null;
function toggleEmojiPicker(){
  const picker=document.getElementById('chatEmojiPicker');
  if(!picker) return;

  const willOpen=picker.classList.contains('hidden');

  const gif=document.getElementById('chatGifPicker');
  if(gif) gif.classList.add('hidden');

  if(willOpen){
    ensureEmojiKeyboardShellV39();
    picker.classList.remove('hidden');
    activeChatTray='emoji';
    renderEmojiKeyboard();
  }else{
    picker.classList.add('hidden');
  }

  const input=document.getElementById('chatMessageInput');
  if(input) input.focus();
}

const __oldRenderEmojiKeyboardV39 = typeof renderEmojiKeyboard === 'function' ? renderEmojiKeyboard : null;
function renderEmojiKeyboard(){
  ensureEmojiKeyboardShellV39();

  const box=document.getElementById('emojiKeyboardBody');
  const tabs=document.getElementById('emojiCategoryTabs');
  if(!box||!tabs) return;

  const labels={
    smileys:'😀',
    people:'👋',
    nature:'🌿',
    food:'🍔',
    travel:'🚗',
    objects:'💡',
    symbols:'❤️'
  };

  const names={
    smileys:'Smileys',
    people:'People',
    nature:'Nature',
    food:'Food',
    travel:'Travel',
    objects:'Objects',
    symbols:'Symbols'
  };

  const keys=Object.keys(EMOJI_CATEGORIES_V35 || {});
  if(!keys.includes(activeEmojiCategory)) activeEmojiCategory='smileys';

  tabs.innerHTML=keys.map(key=>`
    <button class="${activeEmojiCategory===key?'active':''}" onclick="activeEmojiCategory='${key}';renderEmojiKeyboard()" title="${names[key]||key}">
      <span>${labels[key]||'🙂'}</span>
      <small>${names[key]||key}</small>
    </button>
  `).join('');

  box.innerHTML=(EMOJI_CATEGORIES_V35[activeEmojiCategory]||[]).map(e=>`
    <button type="button" onclick="addChatEmoji('${e}')">${e}</button>
  `).join('');
}


/* =========================================================
   V40 ACTIVITY STATUS SYNC FIX
   One accurate presence system for chat header + conversation list.
   Blue = active recently. Orange = offline/old active.
   ========================================================= */

const ONLINE_THRESHOLD_MS_V40 = 35000;

function normalizeUsernameV40(username=''){
  return String(username || '').replace('@','').toLowerCase().trim();
}

function presenceFor(username){
  return chatPresenceMap[normalizeUsernameV40(username)] || {};
}

function isPresenceOnlineV40(username){
  const p = presenceFor(username);
  if(!p.lastActive) return false;

  const time = new Date(p.lastActive).getTime();
  if(Number.isNaN(time)) return false;

  return Date.now() - time <= ONLINE_THRESHOLD_MS_V40;
}

function humanTimeAgo(input){
  if(!input) return 'offline';

  const time = new Date(input).getTime();
  if(Number.isNaN(time)) return 'offline';

  const diff = Math.max(0, Date.now() - time);
  const sec = Math.floor(diff / 1000);

  if(sec <= 35) return 'active now';
  if(sec < 60) return `active ${sec}s ago`;

  const min = Math.floor(sec / 60);
  if(min < 60) return `active ${min}m ago`;

  const hr = Math.floor(min / 60);
  if(hr < 24) return `active ${hr}h ago`;

  return `active ${Math.floor(hr / 24)}d ago`;
}

function presenceLineFor(user={}, fallbackCreatedAt=''){
  const username = normalizeUsernameV40(user?.username || activeChatUsername || '');
  const p = presenceFor(username);
  const now = Date.now();

  if(p.typingUntil && new Date(p.typingUntil).getTime() > now) return 'typing...';
  if(p.recordingUntil && new Date(p.recordingUntil).getTime() > now) return 'recording voice...';
  if(p.sendingMediaUntil && new Date(p.sendingMediaUntil).getTime() > now) return 'sending media...';

  if(p.lastActive) return humanTimeAgo(p.lastActive);

  return 'offline';
}

function presenceClassFor(user={}, fallbackCreatedAt=''){
  const username = normalizeUsernameV40(user?.username || activeChatUsername || '');
  return isPresenceOnlineV40(username) ? 'status-active' : 'status-inactive';
}

function forceUpdateChatHeaderStatus(){
  if(!activeChatUsername) return;

  const line = document.getElementById('chatPresenceLine');
  const statusText = presenceLineFor({ username: activeChatUsername });

  if(line){
    line.textContent = statusText;
    line.classList.toggle('live-action', ['typing...','recording voice...','sending media...'].includes(statusText));
  }

  const avatar = document.getElementById('chatHeaderAvatar');
  if(avatar){
    avatar.classList.remove('status-active','status-inactive');
    avatar.classList.add(presenceClassFor({ username: activeChatUsername }));
  }

  document.querySelectorAll(`[data-presence-user="${CSS.escape(activeChatUsername)}"]`).forEach(el=>{
    el.classList.remove('status-active','status-inactive');
    el.classList.add(presenceClassFor({ username: activeChatUsername }));
  });
}

async function loadPresence(username){
  const clean = normalizeUsernameV40(username);
  if(!clean || !token()) return {};

  try{
    const data = await apiFetch(`${API.messages}/presence/${encodeURIComponent(clean)}`);
    if(data && data.presence){
      chatPresenceMap[clean] = data.presence;
      return data.presence;
    }
  }catch(e){
    console.warn('presence read failed', e);
  }

  return {};
}

function startPresencePolling(username){
  stopPresencePolling();

  const clean = normalizeUsernameV40(username);
  if(!clean) return;

  loadPresence(clean).then(()=>{
    forceUpdateChatHeaderStatus();
    loadConversations();
  });

  presencePollTimer = setInterval(async ()=>{
    await loadPresence(clean);
    forceUpdateChatHeaderStatus();
    await loadConversations();
  }, 2500);
}

async function loadConversations(){
  try{
    const data = await apiFetch(`${API.messages}/conversations`);
    const list = data.conversations || [];
    const box = document.getElementById('conversationList');
    if(!box) return;

    if(!list.length){
      box.innerHTML = '<div class="collection-empty">No conversations yet. Enter a username to start chatting.</div>';
      return;
    }

    await Promise.all(
      list
        .map(conv => normalizeUsernameV40(conv.user?.username))
        .filter(Boolean)
        .map(username => loadPresence(username))
    );

    box.innerHTML = list.map(conv=>{
      const user = conv.user || {};
      const username = normalizeUsernameV40(user.username);
      const last = conv.lastMessage || {};
      const unread = conv.unreadCount || 0;
      const avatar = user.avatar || '👤';
      const statusText = presenceLineFor(user);
      const liveText = ['typing...','recording voice...','sending media...'].includes(statusText);
      const previewText = liveText ? statusText : (last.body || 'No messages yet');

      return `
        <button class="conversation-card ${activeChatUsername===username?'active':''}" onclick="openChat('${escapeHTML(username)}')">
          <div data-presence-user="${escapeHTML(username)}" class="avatar sm ${presenceClassFor(user)}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(avatar,'👤'):escapeHTML(avatar)}</div>
          <div>
            <strong>${escapeHTML(user.displayName||user.username||'User')}</strong>
            <span>@${escapeHTML(user.username||'user')} • ${escapeHTML(statusText)}</span>
            <p class="${liveText?'live-preview':''}">${escapeHTML(previewText)}</p>
          </div>
          ${unread?`<b>${unread}</b>`:''}
        </button>
      `;
    }).join('');
  }catch(error){
    const box = document.getElementById('conversationList');
    if(box) box.innerHTML = `<div class="collection-empty">${escapeHTML(error.message)}</div>`;
  }
}

async function loadChatThread(){
  if(!activeChatUsername) return;

  try{
    const data = await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}`);
    const other = data.user || { username: activeChatUsername };
    const messages = data.messages || [];

    await loadPresence(activeChatUsername);

    const header = document.getElementById('chatThreadHeader');
    if(header){
      const statusText = presenceLineFor(other);
      header.innerHTML = `
        <div class="chat-user-head">
          <div id="chatHeaderAvatar" data-presence-user="${escapeHTML(activeChatUsername)}" class="avatar sm ${presenceClassFor(other)}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(other.avatar||'👤','👤'):escapeHTML(other.avatar||'👤')}</div>
          <div>
            <h2>${escapeHTML(other.displayName||other.username||'User')}</h2>
            <p>@${escapeHTML(other.username||activeChatUsername)} • <span id="chatPresenceLine" class="${['typing...','recording voice...','sending media...'].includes(statusText)?'live-action':''}">${escapeHTML(statusText)}</span></p>
          </div>
        </div>
      `;
    }

    const box = document.getElementById('chatMessages');
    if(!box) return;

    if(!messages.length){
      box.innerHTML = '<div class="collection-empty">No messages yet. Say hello.</div>';
    }else{
      box.innerHTML = messages.map(msg=>{
        const mine = String(msg.sender?._id||msg.sender) === String(currentUserData.id||currentUserData._id);
        const receipt = typeof messageReceiptText==='function' ? messageReceiptText(msg,mine) : '';
        return `
          <div class="chat-bubble ${mine?'mine':'theirs'}">
            ${msg.body?`<p>${escapeHTML(msg.body||'')}</p>`:''}
            ${typeof renderChatMessageMedia==='function'?renderChatMessageMedia(msg.media||[]):''}
            <span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}${receipt?' • '+escapeHTML(receipt):''}</span>
          </div>
        `;
      }).join('');
      box.scrollTop = box.scrollHeight;
    }

    await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}/read`,{method:'PATCH'});
    forceUpdateChatHeaderStatus();
    loadConversations();
  }catch(error){
    const box = document.getElementById('chatMessages');
    if(box) box.innerHTML = `<div class="collection-empty">${escapeHTML(error.message)}</div>`;
  }
}

function markCurrentUserActive(){
  const username = normalizeUsernameV40(currentUserData?.username || '');
  if(username){
    chatPresenceMap[username] = {
      ...(chatPresenceMap[username] || {}),
      username,
      lastActive: new Date().toISOString()
    };
  }

  try{
    localStorage.setItem('reconnect_last_active_'+username, new Date().toISOString());
  }catch{}
}

function startActivityHeartbeat(){
  let lastPresencePing = 0;

  const pingActive = ()=>{
    if(!token() || !currentUserData) return;

    markCurrentUserActive();

    const now = Date.now();
    if(now - lastPresencePing > 2500){
      lastPresencePing = now;
      sendPresence({});
    }

    const me = normalizeUsernameV40(currentUserData.username);
    document.querySelectorAll(`[data-presence-user="${CSS.escape(me)}"]`).forEach(el=>{
      el.classList.remove('status-inactive');
      el.classList.add('status-active');
    });
  };

  pingActive();

  if(window.__reconnectActivityTimer){
    clearInterval(window.__reconnectActivityTimer);
  }

  window.__reconnectActivityTimer = setInterval(pingActive, 8000);

  if(!window.__reconnectActivityListenersAddedV40){
    ['click','keydown','mousemove','pointermove','scroll','touchstart','focus'].forEach(eventName=>{
      window.addEventListener(eventName, pingActive, { passive:true });
    });

    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden) pingActive();
    });

    window.__reconnectActivityListenersAddedV40 = true;
  }
}


/* =========================================================
   V41 VOICE NOTES FIX
   Stable recording -> preview -> send -> audio player flow.
   ========================================================= */

function getSupportedAudioMimeV41(){
  if(typeof MediaRecorder === 'undefined') return '';

  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ];

  return types.find(type => {
    try{
      return MediaRecorder.isTypeSupported(type);
    }catch{
      return false;
    }
  }) || '';
}

function voiceNoteFileNameV41(type='audio/webm'){
  const ext = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm';
  return `voice-note-${new Date().toISOString().replace(/[:.]/g,'-')}.${ext}`;
}

function updateVoiceRecordButton(){
  const btn=document.getElementById('chatVoiceBtn');
  if(!btn) return;

  btn.innerHTML = chatRecording ? iconStop() : iconMic();
  btn.classList.toggle('recording', chatRecording);
  btn.classList.toggle('core-recording', chatRecording);
  btn.title = chatRecording ? 'Stop voice note' : 'Record voice note';
}

async function toggleVoiceRecording(){
  if(!activeChatUsername){
    toast('Open a chat first');
    return;
  }

  if(chatRecording){
    try{
      setLocalPeerAction && setLocalPeerAction('recording',false);
      sendPresence && sendPresence({recording:false});
    }catch{}

    if(chatRecorder && chatRecorder.state !== 'inactive'){
      chatRecorder.stop();
    }

    return;
  }

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined'){
    toast('Voice recording is not supported in this browser');
    return;
  }

  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const mimeType = getSupportedAudioMimeV41();
    const options = mimeType ? { mimeType } : undefined;

    chatRecordChunks = [];
    chatRecorder = new MediaRecorder(stream, options);
    chatRecording = true;
    updateVoiceRecordButton();

    try{
      setLocalPeerAction && setLocalPeerAction('recording',true);
      sendPresence && sendPresence({recording:true});
    }catch{}

    chatRecorder.ondataavailable = event => {
      if(event.data && event.data.size > 0){
        chatRecordChunks.push(event.data);
      }
    };

    chatRecorder.onerror = () => {
      toast('Voice recording error');
      chatRecording = false;
      updateVoiceRecordButton();
      stream.getTracks().forEach(track => track.stop());
    };

    chatRecorder.onstop = () => {
      const finalType = chatRecorder.mimeType || mimeType || 'audio/webm';
      const blob = new Blob(chatRecordChunks, { type: finalType });

      chatRecording = false;
      updateVoiceRecordButton();

      try{
        setLocalPeerAction && setLocalPeerAction('recording',false);
        sendPresence && sendPresence({recording:false});
      }catch{}

      stream.getTracks().forEach(track => track.stop());

      if(!blob.size){
        toast('No voice was recorded');
        return;
      }

      if(blob.size > 7 * 1024 * 1024){
        toast('Voice note is too long. Keep it shorter.');
        return;
      }

      const reader = new FileReader();

      reader.onload = event => {
        pendingChatMedia.push({
          src: event.target.result,
          type: finalType,
          name: voiceNoteFileNameV41(finalType),
          size: blob.size,
          isVoiceNote: true
        });

        renderChatPendingMedia();
        toast('Voice note ready. Press send.');
      };

      reader.onerror = () => toast('Could not prepare voice note');

      reader.readAsDataURL(blob);
    };

    chatRecorder.start(500);
    toast('Recording voice note... click mic again to stop');
  }catch(error){
    console.error('Voice note mic error:', error);

    if(location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
      toast('Mic needs localhost or HTTPS');
    }else{
      toast('Microphone permission denied or unavailable');
    }

    chatRecording = false;
    updateVoiceRecordButton();
  }
}

function renderChatPendingMedia(){
  const box=document.getElementById('chatPendingMedia');
  if(!box) return;

  if(!pendingChatMedia.length){
    box.innerHTML='';
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');

  box.innerHTML=`
    <div class="chat-attachment-header">
      <strong>${pendingChatMedia.length} attachment${pendingChatMedia.length>1?'s':''} selected</strong>
      <span>Preview before sending.</span>
      <button onclick="clearChatPendingMedia()">Clear</button>
    </div>

    <div class="chat-attachment-grid">
      ${pendingChatMedia.map((item,index)=>{
        const safeName=escapeHTML(item.name||'Attachment');
        const type=String(item.type||'');
        let preview='<div class="chat-media-glyph">📎</div>';
        let label=chatMediaTypeFor(type);

        if(item.isVoiceNote || type.startsWith('audio/')){
          label=item.isVoiceNote?'Voice note':'Audio';
          preview=`
            <div class="voice-preview-card">
              <div class="voice-preview-icon">🎙️</div>
              <audio controls src="${item.src}"></audio>
            </div>
          `;
        }else if(type.startsWith('image/')){
          preview=`<img src="${item.src}" alt="${safeName}">`;
        }else if(type.startsWith('video/')){
          preview=`<video src="${item.src}"></video>`;
        }

        return `
          <div class="chat-pending-card ${item.isVoiceNote?'voice-note-pending':''}">
            ${preview}
            <div class="chat-pending-meta">
              <strong>${safeName}</strong>
              <span>${label}</span>
            </div>
            <button onclick="removeChatPendingMedia(${index})">×</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderChatMessageMedia(mediaList=[]){
  const media=Array.isArray(mediaList) ? mediaList : [];
  if(!media.length) return '';

  return `
    <div class="chat-message-media">
      ${media.map(item=>{
        const src=item.url || item.src || '';
        const type=item.type || '';
        const name=escapeHTML(item.name || 'Attachment');
        const isVoice = String(name).toLowerCase().includes('voice-note') || item.isVoiceNote;

        if(String(type).startsWith('image/') && !String(type).includes('svg')){
          return `<figure class="chat-msg-media-card"><img src="${src}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
        }

        if(String(type).startsWith('image/svg')){
          return `<figure class="chat-msg-media-card"><img src="${src}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
        }

        if(String(type).startsWith('video/')){
          return `<figure class="chat-msg-media-card"><video controls src="${src}"></video><figcaption>${name}</figcaption></figure>`;
        }

        if(String(type).startsWith('audio/')){
          return `
            <figure class="chat-msg-media-card audio voice-note-player">
              <div class="voice-message-head">
                <span>${isVoice?'🎙️':'🎧'}</span>
                <strong>${isVoice?'Voice note':'Audio'}</strong>
              </div>
              <audio controls preload="metadata" src="${src}"></audio>
            </figure>
          `;
        }

        return `<a class="chat-msg-file" href="${src}" target="_blank" rel="noreferrer">📎 ${name}</a>`;
      }).join('')}
    </div>
  `;
}

async function sendChatMessage(){
  const input=document.getElementById('chatMessageInput');
  const body=(input?.value||'').trim();

  if(!activeChatUsername){
    toast('Open a chat first');
    return;
  }

  if(chatRecording){
    toast('Stop recording first');
    return;
  }

  if(!body && !pendingChatMedia.length){
    toast('Write a message or attach media');
    return;
  }

  try{
    if(pendingChatMedia.length){
      setLocalPeerAction && setLocalPeerAction('sendingMedia',true);
      sendPresence && sendPresence({sendingMedia:true});
    }

    const media=pendingChatMedia.map(item=>({
      url:item.src,
      type:item.type,
      name:item.name,
      size:item.size,
      isVoiceNote:Boolean(item.isVoiceNote)
    }));

    const hasVoice=media.some(item => item.isVoiceNote || String(item.type||'').startsWith('audio/'));
    const inferredType = hasVoice ? 'audio' : media.length ? chatMediaTypeFor(media[0].type) : 'text';
    const finalBody = body || (hasVoice ? 'Voice note' : '');

    await apiFetch(API.messages,{
      method:'POST',
      body:JSON.stringify({
        toUsername:activeChatUsername,
        body:finalBody,
        type:inferredType,
        media
      })
    });

    if(input) input.value='';
    clearChatPendingMedia();

    const picker=document.getElementById('chatEmojiPicker');
    if(picker) picker.classList.add('hidden');

    const gif=document.getElementById('chatGifPicker');
    if(gif) gif.classList.add('hidden');

    await sendPresence({typing:false,recording:false,sendingMedia:false});
    await loadChatThread();
    await loadConversations();
  }catch(error){
    console.error('Send voice/media error:', error);
    toast(error.message || 'Could not send message');
  }
}

/* =========================================================
   V42 AUDIO + VIDEO CALL PROTOCOL
   ========================================================= */
let activeCallV42=null, callPcV42=null, localCallStreamV42=null, remoteCallStreamV42=null;
let callPollTimerV42=null, callInboxTimerV42=null, callCandidateTimerV42=null;
let lastCandidateIndexV42=-1, callerRemoteSetV42=false;
const CALL_API_V42='/api/calls';

function iconPhoneV42(){return `<svg class="ui-icon" viewBox="0 0 24 24"><path d="M22 16.8v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.2 19.2 0 0 1-5.9-5.9A19.7 19.7 0 0 1 2.2 4.2 2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 5.9 5.9l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.8z"></path></svg>`}
function iconVideoV42(){return `<svg class="ui-icon" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path></svg>`}

function renderCallModalV42(html){const m=document.getElementById('callModalV42');if(!m)return;m.classList.remove('hidden');m.innerHTML=html;}
function hideCallModalV42(){const m=document.getElementById('callModalV42');if(!m)return;m.classList.add('hidden');m.innerHTML='';}
function callDisplayUserV42(call){const me=String(currentUserData?.username||'').toLowerCase();return String(call?.caller?.username||'').toLowerCase()===me?call.receiver:call.caller;}

function renderActiveCallModalV42(call,mode='calling'){
  const u=callDisplayUserV42(call), type=call?.type==='video'?'Video':'Audio';
  renderCallModalV42(`<div class="call-card-v42 ${call?.type==='video'?'video':'audio'}">
    <div class="call-card-head-v42"><div class="avatar big">${typeof renderAvatarHTML==='function'?renderAvatarHTML(u.avatar||'👤','👤'):escapeHTML(u.avatar||'👤')}</div><div><p class="eyebrow">${type} Call</p><h2>${escapeHTML(u.displayName||u.username||'User')}</h2><span>@${escapeHTML(u.username||'user')} • ${escapeHTML(mode)}</span></div></div>
    <div class="call-video-grid-v42 ${call?.type==='audio'?'audio-only':''}"><video id="remoteCallVideoV42" autoplay playsinline></video><video id="localCallVideoV42" autoplay playsinline muted></video><div class="audio-call-wave-v42"><span></span><span></span><span></span><span></span></div></div>
    <div class="call-actions-v42"><button class="call-action end" onclick="endCallV42()">End Call</button></div></div>`);
  attachCallStreamsToUIV42();
}
function renderIncomingCallModalV42(call){
  const u=call.caller||{}, type=call.type==='video'?'Video':'Audio';
  renderCallModalV42(`<div class="call-card-v42 incoming"><div class="call-card-head-v42"><div class="avatar big">${typeof renderAvatarHTML==='function'?renderAvatarHTML(u.avatar||'👤','👤'):escapeHTML(u.avatar||'👤')}</div><div><p class="eyebrow">Incoming ${type} Call</p><h2>${escapeHTML(u.displayName||u.username||'User')}</h2><span>@${escapeHTML(u.username||'user')}</span></div></div><div class="call-actions-v42"><button class="call-action accept" onclick="acceptCallV42('${call.id}')">Accept</button><button class="call-action end" onclick="declineCallV42('${call.id}')">Decline</button></div></div>`);
}
function attachCallStreamsToUIV42(){const l=document.getElementById('localCallVideoV42'), r=document.getElementById('remoteCallVideoV42');if(l&&localCallStreamV42)l.srcObject=localCallStreamV42;if(r&&remoteCallStreamV42)r.srcObject=remoteCallStreamV42;}

async function getCallMediaV42(type='audio'){
  if(!navigator.mediaDevices?.getUserMedia) throw new Error('Calling is not supported in this browser');
  if(location.protocol!=='https:' && location.hostname!=='localhost' && location.hostname!=='127.0.0.1') throw new Error('Camera/mic calls need localhost or HTTPS');
  return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:type==='video'?{width:{ideal:960},height:{ideal:540},facingMode:'user'}:false});
}
function createPeerV42(callId){
  const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
  remoteCallStreamV42=new MediaStream();
  pc.ontrack=e=>{e.streams[0].getTracks().forEach(t=>remoteCallStreamV42.addTrack(t));attachCallStreamsToUIV42();};
  pc.onicecandidate=async e=>{if(e.candidate&&callId){try{await apiFetch(`${CALL_API_V42}/${callId}/candidate`,{method:'POST',body:JSON.stringify({candidate:e.candidate})});}catch{}}};
  pc.onconnectionstatechange=()=>{if(['failed','closed','disconnected'].includes(pc.connectionState)&&activeCallV42)toast(`Call ${pc.connectionState}`);};
  return pc;
}
async function addRemoteCandidatesV42(){
  if(!activeCallV42||!callPcV42)return;
  try{
    const data=await apiFetch(`${CALL_API_V42}/${activeCallV42.id}/candidates?after=${lastCandidateIndexV42}`);
    for(const item of data.candidates||[]){ if(item.index>lastCandidateIndexV42)lastCandidateIndexV42=item.index; try{await callPcV42.addIceCandidate(new RTCIceCandidate(item.candidate));}catch{}}
  }catch{}
}
function startCandidatePollingV42(){stopCandidatePollingV42();callCandidateTimerV42=setInterval(addRemoteCandidatesV42,1200);}
function stopCandidatePollingV42(){if(callCandidateTimerV42){clearInterval(callCandidateTimerV42);callCandidateTimerV42=null;}}

async function startCallV42(type='audio'){
  if(!activeChatUsername)return toast('Open a chat first');
  try{
    localCallStreamV42=await getCallMediaV42(type);
    callPcV42=createPeerV42(null);
    localCallStreamV42.getTracks().forEach(t=>callPcV42.addTrack(t,localCallStreamV42));
    const offer=await callPcV42.createOffer(); await callPcV42.setLocalDescription(offer);
    const data=await apiFetch(`${CALL_API_V42}/start`,{method:'POST',body:JSON.stringify({toUsername:activeChatUsername,type,offer})});
    activeCallV42=data.call;
    const old=localCallStreamV42; callPcV42.close(); callPcV42=createPeerV42(activeCallV42.id); old.getTracks().forEach(t=>callPcV42.addTrack(t,old)); await callPcV42.setLocalDescription(offer);
    renderActiveCallModalV42(activeCallV42,'calling...'); startCallerStatusPollingV42(); startCandidatePollingV42(); toast(`${type==='video'?'Video':'Audio'} call started`);
  }catch(e){console.error(e);toast(e.message||'Could not start call');cleanupCallV42(false);}
}
function startCallerStatusPollingV42(){
  if(callPollTimerV42)clearInterval(callPollTimerV42);
  callPollTimerV42=setInterval(async()=>{
    if(!activeCallV42||!callPcV42)return;
    try{
      const data=await apiFetch(`${CALL_API_V42}/${activeCallV42.id}`), call=data.call;
      if(call.status==='connected'&&call.answer&&!callerRemoteSetV42){callerRemoteSetV42=true;await callPcV42.setRemoteDescription(new RTCSessionDescription(call.answer));renderActiveCallModalV42(call,'connected');toast('Call connected');}
      if(['declined','ended'].includes(call.status)){toast(call.status==='declined'?'Call declined':'Call ended');cleanupCallV42(false);}
    }catch{}
  },1400);
}
async function acceptCallV42(callId){
  try{
    const data=await apiFetch(`${CALL_API_V42}/${callId}`), call=data.call;
    localCallStreamV42=await getCallMediaV42(call.type); activeCallV42=call; callPcV42=createPeerV42(call.id);
    localCallStreamV42.getTracks().forEach(t=>callPcV42.addTrack(t,localCallStreamV42));
    await callPcV42.setRemoteDescription(new RTCSessionDescription(call.offer));
    const answer=await callPcV42.createAnswer(); await callPcV42.setLocalDescription(answer);
    const answered=await apiFetch(`${CALL_API_V42}/${call.id}/answer`,{method:'POST',body:JSON.stringify({answer})});
    activeCallV42=answered.call; renderActiveCallModalV42(activeCallV42,'connected'); startCandidatePollingV42(); toast('Call connected');
  }catch(e){console.error(e);toast(e.message||'Could not accept call');cleanupCallV42(false);}
}
async function declineCallV42(callId){try{await apiFetch(`${CALL_API_V42}/${callId}/decline`,{method:'POST'});}catch{} hideCallModalV42();}
async function endCallV42(){try{if(activeCallV42)await apiFetch(`${CALL_API_V42}/${activeCallV42.id}/end`,{method:'POST'});}catch{} cleanupCallV42(true);}
function cleanupCallV42(showToast=true){
  if(callPollTimerV42)clearInterval(callPollTimerV42);callPollTimerV42=null;stopCandidatePollingV42();
  if(callPcV42){try{callPcV42.close();}catch{} callPcV42=null;}
  if(localCallStreamV42){localCallStreamV42.getTracks().forEach(t=>t.stop());localCallStreamV42=null;}
  remoteCallStreamV42=null;activeCallV42=null;callerRemoteSetV42=false;lastCandidateIndexV42=-1;hideCallModalV42();if(showToast)toast('Call ended');
}
async function pollIncomingCallsV42(){
  if(!token()||!currentUserData||activeCallV42)return;
  try{const data=await apiFetch(`${CALL_API_V42}/incoming`);const incoming=data.calls||[];if(incoming.length)renderIncomingCallModalV42(incoming[0]);}catch{}
}
function startCallInboxPollingV42(){if(callInboxTimerV42)clearInterval(callInboxTimerV42);callInboxTimerV42=setInterval(pollIncomingCallsV42,2500);pollIncomingCallsV42();}
const __oldEnterDashboardV42=typeof enterDashboardV37==='function'?enterDashboardV37:null;
if(__oldEnterDashboardV42){enterDashboardV37=async function(userFromLogin=null){await __oldEnterDashboardV42(userFromLogin);startCallInboxPollingV42();}}
const __oldLogoutV42=typeof logout==='function'?logout:null;
if(__oldLogoutV42){logout=async function(){cleanupCallV42(false);if(callInboxTimerV42)clearInterval(callInboxTimerV42);return __oldLogoutV42();}}
const __oldLoadChatThreadV42=typeof loadChatThread==='function'?loadChatThread:null;
if(__oldLoadChatThreadV42){loadChatThread=async function(){await __oldLoadChatThreadV42();const header=document.getElementById('chatThreadHeader');if(header&&activeChatUsername&&!header.querySelector('.call-buttons-v42')){const buttons=document.createElement('div');buttons.className='call-buttons-v42';buttons.innerHTML=`<button title="Audio call" onclick="startCallV42('audio')">${iconPhoneV42()}</button><button title="Video call" onclick="startCallV42('video')">${iconVideoV42()}</button>`;const head=header.querySelector('.chat-user-head');if(head)head.appendChild(buttons);}}}


/* =========================================================
   V43 FOLLOW PROTOCOL + NOTIFICATIONS
   ========================================================= */

API.notifications = '/api/notifications';

function getIdStringV43(value){
  return String(value?._id || value?.id || value || '');
}

function getIdList(field){
  return (currentUserData?.[field] || []).map(getIdStringV43);
}

function isFollowingAuthor(author={}){
  const id = getIdStringV43(author);
  return Boolean(id) && getIdList('following').includes(id);
}

async function refreshCurrentUser(){
  try{
    const data = await apiFetch(API.me);
    if(data.user) currentUserData = data.user;
    renderLeftProfile();
    updateNotificationBadgeV43();
  }catch(error){
    console.warn('refresh user failed', error);
  }
}

async function toggleFollow(username){
  const clean = String(username || '').replace('@','').toLowerCase().trim();

  if(!clean){
    toast('Username missing');
    return;
  }

  if(clean === String(currentUserData?.username || '').toLowerCase()){
    toast('You cannot follow yourself');
    return;
  }

  try{
    const data = await apiFetch(`${API.users}/${encodeURIComponent(clean)}/follow`, { method:'POST' });

    if(data.user) currentUserData = data.user;

    toast(data.message || 'Follow updated');

    renderLeftProfile();
    await loadFeed();

    if(activeView === 'account-profile') {
      await renderAccountProfile(clean);
    } else {
      refreshCurrentView();
    }

    renderRightPanel();
    updateNotificationBadgeV43();
  }catch(error){
    console.error('follow failed', error);
    toast(error.message || 'Follow failed');
  }
}

function renderFollowButton(author={}){
  const username = author?.username;

  if(!username || username === currentUserData?.username) return '';

  const following = isFollowingAuthor(author);

  return `<button class="follow-mini ${following?'following':''}" onclick="event.stopPropagation();toggleFollow('${escapeHTML(username)}')">${following?'Following':'Follow'}</button>`;
}

async function loadNotificationsV43(markRead=false){
  const data = await apiFetch(API.notifications);
  const notifications = data.notifications || [];

  if(markRead){
    try{ await apiFetch(`${API.notifications}/read`, { method:'PATCH' }); }catch{}
    updateNotificationBadgeV43();
  }

  return notifications;
}

function notificationIconV43(type){
  if(type === 'follow') return '👥';
  if(type === 'like') return '❤️';
  if(type === 'comment') return '💬';
  if(type === 'message') return '✉️';
  return '🔔';
}

function notificationTextV43(n){
  const actor = n.actor || {};
  const name = actor.displayName || actor.username || 'Someone';

  if(n.type === 'follow') return `${name} followed you`;
  if(n.type === 'like') return `${name} liked your post`;
  if(n.type === 'comment') return `${name} commented on your post`;
  if(n.text) return n.text;

  return 'New notification';
}

function renderNotificationCardsV43(items=[]){
  if(!items.length){
    return '<div class="collection-empty">No notifications yet. When someone follows, likes, or comments, it will appear here.</div>';
  }

  return items.map(n=>{
    const actor = n.actor || {};
    const unread = !n.isRead;

    return `
      <article class="notification-card-v43 ${unread?'unread':''}">
        <button class="notification-user-v43" onclick="openAccountProfile('${escapeHTML(actor.username||'')}')">
          <div class="notification-icon-v43">${notificationIconV43(n.type)}</div>
          <div class="avatar sm">${typeof renderAvatarHTML==='function'?renderAvatarHTML(actor.avatar||'👤','👤'):escapeHTML(actor.avatar||'👤')}</div>
          <div>
            <strong>${escapeHTML(notificationTextV43(n))}</strong>
            <span>@${escapeHTML(actor.username||'user')} • ${timeAgo(n.createdAt)}</span>
            ${n.post?.content ? `<p>${escapeHTML(String(n.post.content).slice(0,100))}</p>` : ''}
          </div>
        </button>
        ${unread?'<b class="unread-dot-v43"></b>':''}
      </article>
    `;
  }).join('');
}

async function renderNotifications(){
  activeView = 'notifications';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('[data-view="notifications"]');
  if(btn) btn.classList.add('active');

  document.getElementById('mainContent').innerHTML = `
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Notification Center</p>
      <h1>Notifications</h1>
      <p>Followers, likes, comments, and future alerts will appear here.</p>
      <div class="settings-pills">
        <span class="settings-pill">Follow alerts</span>
        <span class="settings-pill">Like alerts</span>
        <span class="settings-pill">Comment alerts</span>
      </div>
    </section>
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div>
          <h2>Recent Activity</h2>
          <p>Who followed, liked, or commented on your posts.</p>
        </div>
        <button class="primary-action secondary" onclick="markNotificationsReadV43()">Mark all read</button>
      </div>
      <div id="notificationListV43" class="notification-list-v43">
        <div class="collection-empty">Loading notifications...</div>
      </div>
    </section>
  `;

  const items = await loadNotificationsV43(true);
  const list = document.getElementById('notificationListV43');
  if(list) list.innerHTML = renderNotificationCardsV43(items);
}

async function markNotificationsReadV43(){
  try{
    await apiFetch(`${API.notifications}/read`, { method:'PATCH' });
    toast('Notifications marked as read');
    updateNotificationBadgeV43();
    renderNotifications();
  }catch(error){
    toast(error.message || 'Could not mark notifications read');
  }
}

async function updateNotificationBadgeV43(){
  try{
    if(!token()) return;

    const data = await apiFetch(`${API.notifications}/unread-count`);
    const count = Number(data.count || 0);
    const badge = document.getElementById('notificationBadge');

    if(!badge) return;

    if(count > 0){
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.classList.remove('hidden');
    }else{
      badge.classList.add('hidden');
    }
  }catch{}
}

// Patch switchView safely.
const __oldSwitchViewV43 = typeof switchView === 'function' ? switchView : null;
if(__oldSwitchViewV43){
  switchView = function(view){
    if(view === 'notifications') return renderNotifications();
    return __oldSwitchViewV43(view);
  };
}

// Patch post actions to refresh notifications.
const __oldLikePostV43 = typeof likePost === 'function' ? likePost : null;
if(__oldLikePostV43){
  likePost = async function(id){
    try{
      await apiFetch(`${API.posts}/${id}/like`, { method:'POST' });
      await loadFeed();
      refreshCurrentView();
      updateNotificationBadgeV43();
    }catch(e){
      toast(e.message);
    }
  };
}

const __oldAddCommentV43 = typeof addComment === 'function' ? addComment : null;
if(__oldAddCommentV43){
  addComment = async function(id){
    try{
      const input = document.getElementById(`comment-${id}`);
      const text = input.value.trim();
      if(!text) return;

      await apiFetch(`${API.posts}/${id}/comment`, {
        method:'POST',
        body:JSON.stringify({text})
      });

      await loadFeed();
      refreshCurrentView();
      updateNotificationBadgeV43();
    }catch(e){
      toast(e.message);
    }
  };
}

// Patch dashboard startup to update badge.
const __oldEnterDashboardV43 = typeof enterDashboardV37 === 'function' ? enterDashboardV37 : null;
if(__oldEnterDashboardV43){
  enterDashboardV37 = async function(userFromLogin=null){
    await __oldEnterDashboardV43(userFromLogin);
    updateNotificationBadgeV43();
    if(window.__notificationBadgeTimerV43) clearInterval(window.__notificationBadgeTimerV43);
    window.__notificationBadgeTimerV43 = setInterval(updateNotificationBadgeV43, 12000);
  };
}


/* =========================================================
   V44 RELIABLE FOLLOW NOTIFICATIONS
   Notifications no longer get hidden/cleared automatically.
   ========================================================= */

async function loadNotificationsV43(markRead=false){
  const data = await apiFetch(API.notifications);
  const notifications = data.notifications || [];

  if(markRead){
    try{ await apiFetch(`${API.notifications}/read`, { method:'PATCH' }); }catch{}
    updateNotificationBadgeV43();
  }

  return notifications;
}

async function renderNotifications(){
  activeView = 'notifications';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('[data-view="notifications"]');
  if(btn) btn.classList.add('active');

  document.getElementById('mainContent').innerHTML = `
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Notification Center</p>
      <h1>Notifications</h1>
      <p>Follow, like, and comment alerts will appear here.</p>
      <div class="settings-pills">
        <span class="settings-pill">Follow alerts</span>
        <span class="settings-pill">Like alerts</span>
        <span class="settings-pill">Comment alerts</span>
      </div>
    </section>
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div>
          <h2>Recent Activity</h2>
          <p>Who followed, liked, or commented on your posts.</p>
        </div>
        <div class="notification-action-row-v44">
          <button class="primary-action secondary" onclick="renderNotifications()">Refresh</button>
          <button class="primary-action secondary" onclick="markNotificationsReadV43()">Mark all read</button>
        </div>
      </div>
      <div id="notificationListV43" class="notification-list-v43">
        <div class="collection-empty">Loading notifications...</div>
      </div>
    </section>
  `;

  const items = await loadNotificationsV43(false);
  const list = document.getElementById('notificationListV43');
  if(list) list.innerHTML = renderNotificationCardsV43(items);
  updateNotificationBadgeV43();
}

async function toggleFollow(username){
  const clean = String(username || '').replace('@','').toLowerCase().trim();

  if(!clean){
    toast('Username missing');
    return;
  }

  if(clean === String(currentUserData?.username || '').toLowerCase()){
    toast('You cannot follow yourself');
    return;
  }

  try{
    const data = await apiFetch(`${API.users}/${encodeURIComponent(clean)}/follow`, { method:'POST' });

    if(data.user) currentUserData = data.user;

    if(data.following && data.notificationCreated){
      toast(`Following @${clean}. Notification sent.`);
    }else{
      toast(data.message || 'Follow updated');
    }

    renderLeftProfile();
    await loadFeed();

    if(activeView === 'account-profile') {
      await renderAccountProfile(clean);
    } else {
      refreshCurrentView();
    }

    renderRightPanel();
    updateNotificationBadgeV43();
  }catch(error){
    console.error('follow failed', error);
    toast(error.message || 'Follow failed');
  }
}


/* =========================================================
   V45 ACCOUNT PROFILE TARGET FIX
   Fixes fake User/@user profile fallback.
   Always loads the exact clicked username from backend.
   ========================================================= */

function normalizeProfileUsernameV45(username=''){
  return String(username || '')
    .replace('@','')
    .replace(/[`"'<>]/g,'')
    .trim()
    .toLowerCase();
}

function safeTargetUsernameV45(userOrUsername){
  if(typeof userOrUsername === 'string') return normalizeProfileUsernameV45(userOrUsername);
  return normalizeProfileUsernameV45(userOrUsername?.username || userOrUsername?.author?.username || '');
}

async function openAccountProfile(username){
  const clean = normalizeProfileUsernameV45(username);

  if(!clean){
    toast('Could not open profile: username missing');
    return;
  }

  if(clean === normalizeProfileUsernameV45(currentUserData?.username)){
    renderProfile();
    return;
  }

  return renderAccountProfile(clean);
}

async function renderAccountProfile(username){
  activeView = 'account-profile';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));

  const clean = normalizeProfileUsernameV45(username);

  if(!clean){
    document.getElementById('mainContent').innerHTML = `
      ${renderTopbar()}
      <section class="card empty">Profile username missing. Go back and click the account name again.</section>
    `;
    return;
  }

  document.getElementById('mainContent').innerHTML = `
    ${renderTopbar()}
    <section class="card empty">Loading @${escapeHTML(clean)} profile...</section>
  `;

  try{
    const data = await apiFetch(`${API.users}/${encodeURIComponent(clean)}`);

    if(!data || !data.user || !data.user.username){
      throw new Error(`Profile @${clean} not found`);
    }

    const user = data.user;
    const posts = Array.isArray(data.posts) ? data.posts : [];

    document.getElementById('mainContent').innerHTML = `
      ${renderTopbar()}

      <section class="account-profile-page card">
        <div class="account-profile-cover"></div>

        <div class="account-profile-main">
          <div class="avatar big ${typeof presenceClassFor==='function'?presenceClassFor(user):''}">
            ${typeof renderAvatarHTML==='function'?renderAvatarHTML(user.avatar||'👤','👤'):escapeHTML(user.avatar||'👤')}
          </div>

          <div class="account-profile-text">
            <p class="eyebrow">Account Profile</p>
            <h1>${escapeHTML(user.displayName || user.username)}</h1>
            <p>@${escapeHTML(user.username)}</p>
            ${typeof renderFollowStats==='function' ? renderFollowStats(user,user.username) : `
              <div class="follow-stats">
                <button><strong>${(user.followers||[]).length}</strong><span>Followers</span></button>
                <button><strong>${(user.following||[]).length}</strong><span>Following</span></button>
              </div>
            `}
          </div>

          ${typeof renderAccountControlButtons==='function' ? renderAccountControlButtons(user) : ''}
        </div>
      </section>

      <section class="settings-panel card follow-suggestions-card">
        <div class="settings-panel-head">
          <div>
            <h2>Suggested Accounts</h2>
            <p>Discover and follow more accounts.</p>
          </div>
          <span class="tag">Follow setup</span>
        </div>
        <div id="followSuggestionsBox" class="connection-list">
          <div class="collection-empty">Loading suggestions...</div>
        </div>
      </section>

      <section class="settings-panel card">
        <div class="settings-panel-head">
          <div>
            <h2>@${escapeHTML(user.username)}'s Posts</h2>
            <p>Only this account's posts are shown here.</p>
          </div>
          <span class="tag">${posts.length} posts</span>
        </div>

        <div id="feedList" class="feed"></div>
      </section>
    `;

    renderFeedList(posts);

    if(typeof renderFollowSuggestions === 'function'){
      renderFollowSuggestions();
    }
  }catch(error){
    console.error('Profile open failed:', error);
    document.getElementById('mainContent').innerHTML = `
      ${renderTopbar()}
      <section class="card empty">
        Could not load @${escapeHTML(clean)}. ${escapeHTML(error.message || '')}
      </section>
    `;
  }
}

/* Rewrite feed cards to always pass the real author username */
function renderFeedList(posts){
  const c = document.getElementById('feedList');
  if(!c) return;

  if(!posts.length){
    c.innerHTML = '<div class="card empty">No posts found.</div>';
    return;
  }

  c.innerHTML = posts.map(p=>{
    const a = p.author || {};
    const username = normalizeProfileUsernameV45(a.username || '');
    const liked = (p.likes||[]).some(id=>String(id)===String(currentUserData.id||currentUserData._id));
    const saved = typeof isPostSaved==='function' ? isPostSaved(p._id) : false;
    const open = openComments && openComments.has ? openComments.has(p._id) : false;
    const canDelete = String(a._id) === String(currentUserData.id||currentUserData._id);

    return `
      <article class="post card">
        <div class="post-head">
          <button class="profile-link" data-profile-username="${escapeHTML(username)}" onclick="openAccountProfile(this.dataset.profileUsername)">
            ${avatarBox(a,p.createdAt)}
            <div>
              <strong>${escapeHTML(a.displayName || a.username || 'User')}</strong>
              <span>@${escapeHTML(a.username || 'user')} • ${typeof statusTextFor==='function'?statusTextFor(a,p.createdAt):''} • ${timeAgo(p.createdAt)}</span>
            </div>
          </button>

          <div class="post-head-actions">
            ${typeof renderFollowButton==='function'?renderFollowButton(a):''}
            <button class="mini-more" data-profile-username="${escapeHTML(username)}" onclick="event.stopPropagation();openAccountProfile(this.dataset.profileUsername)">View</button>
            <span class="mood-pill">${escapeHTML(p.mood || 'Thought')}</span>
          </div>
        </div>

        <p class="post-text">${escapeHTML(p.content || '')}</p>
        ${typeof renderPostMedia==='function'?renderPostMedia(p):''}

        <div class="post-actions">
          <button class="action ${liked?'liked':''}" onclick="likePost('${p._id}')">❤️ ${(p.likes||[]).length}</button>
          <button class="action" onclick="toggleComments('${p._id}')">💬 ${(p.comments||[]).length}</button>
          <button class="action ${saved?'liked':''}" onclick="toggleSavePost('${p._id}')">${saved?'🔖 Saved':'🔖 Save'}</button>
          <button class="action" onclick="sharePost()">↗ Share</button>
          ${canDelete?`<button class="action" onclick="deletePost('${p._id}')">Delete</button>`:''}
        </div>

        ${open && typeof renderComments==='function' ? renderComments(p) : ''}
      </article>
    `;
  }).join('');
}

/* Also make connection cards open exact username */
function renderConnectionCards(users=[]){
  if(!users.length) return '<div class="collection-empty">No accounts found.</div>';

  return users.map(user=>{
    const username = normalizeProfileUsernameV45(user.username);
    const isMe = username === normalizeProfileUsernameV45(currentUserData?.username);
    const following = typeof isFollowingAuthor==='function' ? isFollowingAuthor(user) : false;

    return `
      <div class="connection-card">
        <button class="connection-user" data-profile-username="${escapeHTML(username)}" onclick="openAccountProfile(this.dataset.profileUsername)">
          <div class="avatar sm ${typeof presenceClassFor==='function'?presenceClassFor(user):''}">
            ${typeof renderAvatarHTML==='function'?renderAvatarHTML(user.avatar||'👤','👤'):escapeHTML(user.avatar||'👤')}
          </div>
          <div>
            <strong>${escapeHTML(user.displayName||user.username||'User')}</strong>
            <span>@${escapeHTML(user.username||'user')}</span>
          </div>
        </button>
        ${isMe?'<span class="tag">You</span>':`<button class="follow-mini ${following?'following':''}" onclick="toggleFollow('${escapeHTML(username)}')">${following?'Following':'Follow'}</button>`}
      </div>
    `;
  }).join('');
}


/* =========================================================
   V46 STATUS + MESSAGE BADGES + NOTIFICATION RELIABILITY
   ========================================================= */

API.notifications = '/api/notifications';

const ONLINE_THRESHOLD_MS_V46 = 35000;

function normalizeUsernameV46(username=''){
  return String(username || '').replace('@','').toLowerCase().trim();
}

function presenceFor(username){
  return chatPresenceMap[normalizeUsernameV46(username)] || {};
}

function isPresenceOnlineV46(username){
  const p = presenceFor(username);
  if(!p.lastActive) return false;

  const time = new Date(p.lastActive).getTime();
  if(Number.isNaN(time)) return false;

  return Date.now() - time <= ONLINE_THRESHOLD_MS_V46;
}

function statusTextFor(user={}, fallbackCreatedAt=''){
  const username = normalizeUsernameV46(user?.username || '');

  if(username){
    const p = presenceFor(username);

    if(p.lastActive){
      const diff = Math.max(0, Date.now() - new Date(p.lastActive).getTime());
      const sec = Math.floor(diff / 1000);

      if(sec <= 35) return 'active now';
      if(sec < 60) return `active ${sec}s ago`;

      const min = Math.floor(sec / 60);
      if(min < 60) return `active ${min}m ago`;

      const hr = Math.floor(min / 60);
      if(hr < 24) return `active ${hr}h ago`;

      return `active ${Math.floor(hr / 24)}d ago`;
    }
  }

  return 'Not active';
}

function presenceClassFor(user={}, fallbackCreatedAt=''){
  const username = normalizeUsernameV46(user?.username || '');
  return username && isPresenceOnlineV46(username) ? 'status-active' : 'status-inactive';
}

async function loadPresence(username){
  const clean = normalizeUsernameV46(username);
  if(!clean || !token()) return {};

  try{
    const data = await apiFetch(`${API.messages}/presence/${encodeURIComponent(clean)}`);
    if(data && data.presence){
      chatPresenceMap[clean] = data.presence;
      return data.presence;
    }
  }catch(error){
    console.warn('presence read failed', error);
  }

  return {};
}

async function hydratePresenceForPostsV46(posts=[]){
  const users = [...new Set(
    posts.map(p=>normalizeUsernameV46(p.author?.username)).filter(Boolean)
  )];

  await Promise.all(users.map(username=>loadPresence(username)));
}

const __oldLoadFeedV46 = typeof loadFeed === 'function' ? loadFeed : null;
if(__oldLoadFeedV46){
  loadFeed = async function(){
    const result = await __oldLoadFeedV46();
    try{ await hydratePresenceForPostsV46(feedPosts || []); }catch{}
    return result;
  };
}

function setBadgeV46(id,count){
  const badge = document.getElementById(id);
  if(!badge) return;

  const n = Number(count || 0);

  if(n > 0){
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.classList.remove('hidden');
  }else{
    badge.classList.add('hidden');
  }
}

async function updateMessageBadgeV46(){
  try{
    if(!token()) return;
    const data = await apiFetch(`${API.messages}/unread-summary`);
    setBadgeV46('messageBadge', data.unreadConversations || 0);
  }catch(error){
    console.warn('message badge failed', error);
  }
}

async function updateNotificationBadgeV43(){
  try{
    if(!token()) return;
    const data = await apiFetch(`${API.notifications}/unread-count`);
    setBadgeV46('notificationBadge', data.count || 0);
  }catch(error){
    console.warn('notification badge failed', error);
  }
}

async function updateAllBadgesV46(){
  await Promise.all([
    updateMessageBadgeV46(),
    updateNotificationBadgeV43()
  ]);
}

async function loadNotificationsV43(markRead=false){
  const data = await apiFetch(API.notifications);
  const notifications = data.notifications || [];

  if(markRead){
    try{ await apiFetch(`${API.notifications}/read`, { method:'PATCH' }); }catch{}
    updateNotificationBadgeV43();
  }

  return notifications;
}

function notificationIconV43(type){
  if(type === 'follow') return '👥';
  if(type === 'like') return '❤️';
  if(type === 'comment') return '💬';
  if(type === 'message') return '✉️';
  return '🔔';
}

function notificationTextV43(n){
  const actor = n.actor || {};
  const name = actor.displayName || actor.username || 'Someone';

  if(n.type === 'follow') return `${name} followed you`;
  if(n.type === 'like') return `${name} liked your post`;
  if(n.type === 'comment') return `${name} commented on your post`;
  if(n.text) return n.text;

  return 'New notification';
}

function renderNotificationCardsV43(items=[]){
  if(!items.length){
    return '<div class="collection-empty">No notifications yet. Follow, like, and comment alerts will appear here.</div>';
  }

  return items.map(n=>{
    const actor = n.actor || {};
    const unread = !n.isRead;
    const username = normalizeUsernameV46(actor.username || '');

    return `
      <article class="notification-card-v43 ${unread?'unread':''}">
        <button class="notification-user-v43" onclick="openAccountProfile('${escapeHTML(username)}')">
          <div class="notification-icon-v43">${notificationIconV43(n.type)}</div>
          <div class="avatar sm ${presenceClassFor(actor)}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(actor.avatar||'👤','👤'):escapeHTML(actor.avatar||'👤')}</div>
          <div>
            <strong>${escapeHTML(notificationTextV43(n))}</strong>
            <span>@${escapeHTML(actor.username||'user')} • ${timeAgo(n.createdAt)}</span>
            ${n.post?.content ? `<p>${escapeHTML(String(n.post.content).slice(0,100))}</p>` : ''}
          </div>
        </button>
        ${unread?'<b class="unread-dot-v43"></b>':''}
      </article>
    `;
  }).join('');
}

async function renderNotifications(){
  activeView = 'notifications';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('[data-view="notifications"]');
  if(btn) btn.classList.add('active');

  document.getElementById('mainContent').innerHTML = `
    ${renderTopbar()}
    <section class="settings-hero card">
      <p class="eyebrow">Notification Center</p>
      <h1>Notifications</h1>
      <p>Follow, like, and comment alerts appear here.</p>
      <div class="settings-pills">
        <span class="settings-pill">Follow alerts</span>
        <span class="settings-pill">Like alerts</span>
        <span class="settings-pill">Comment alerts</span>
      </div>
    </section>
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div>
          <h2>Recent Activity</h2>
          <p>Who followed, liked, or commented on your posts.</p>
        </div>
        <div class="notification-action-row-v46">
          <button class="primary-action secondary" onclick="renderNotifications()">Refresh</button>
          <button class="primary-action secondary" onclick="markNotificationsReadV43()">Mark all read</button>
        </div>
      </div>
      <div id="notificationListV43" class="notification-list-v43">
        <div class="collection-empty">Loading notifications...</div>
      </div>
    </section>
  `;

  const items = await loadNotificationsV43(false);
  const list = document.getElementById('notificationListV43');
  if(list) list.innerHTML = renderNotificationCardsV43(items);
  updateAllBadgesV46();
}

async function markNotificationsReadV43(){
  try{
    await apiFetch(`${API.notifications}/read`, { method:'PATCH' });
    toast('Notifications marked as read');
    updateAllBadgesV46();
    renderNotifications();
  }catch(error){
    toast(error.message || 'Could not mark notifications read');
  }
}

const __oldSwitchViewV46 = typeof switchView === 'function' ? switchView : null;
if(__oldSwitchViewV46){
  switchView = function(view){
    if(view === 'notifications') return renderNotifications();
    const result = __oldSwitchViewV46(view);
    setTimeout(updateAllBadgesV46, 400);
    return result;
  };
}

const __oldLoadConversationsV46 = typeof loadConversations === 'function' ? loadConversations : null;
if(__oldLoadConversationsV46){
  loadConversations = async function(){
    await __oldLoadConversationsV46();
    updateMessageBadgeV46();
  };
}

const __oldLoadChatThreadV46 = typeof loadChatThread === 'function' ? loadChatThread : null;
if(__oldLoadChatThreadV46){
  loadChatThread = async function(){
    await __oldLoadChatThreadV46();
    updateMessageBadgeV46();
  };
}

const __oldToggleFollowV46 = typeof toggleFollow === 'function' ? toggleFollow : null;
toggleFollow = async function(username){
  const clean = normalizeUsernameV46(username);

  if(!clean){
    toast('Username missing');
    return;
  }

  if(clean === normalizeUsernameV46(currentUserData?.username)){
    toast('You cannot follow yourself');
    return;
  }

  try{
    const data = await apiFetch(`${API.users}/${encodeURIComponent(clean)}/follow`, { method:'POST' });

    if(data.user) currentUserData = data.user;

    if(data.following && data.notificationCreated){
      toast(`Following @${clean}. Notification sent.`);
    }else{
      toast(data.message || 'Follow updated');
    }

    renderLeftProfile();
    await loadFeed();

    if(activeView === 'account-profile') {
      await renderAccountProfile(clean);
    } else {
      refreshCurrentView();
    }

    renderRightPanel();
    updateAllBadgesV46();
  }catch(error){
    console.error('follow failed', error);
    toast(error.message || 'Follow failed');
  }
}

const __oldLikePostV46 = typeof likePost === 'function' ? likePost : null;
likePost = async function(id){
  try{
    await apiFetch(`${API.posts}/${id}/like`, { method:'POST' });
    await loadFeed();
    refreshCurrentView();
    updateAllBadgesV46();
  }catch(e){
    toast(e.message || 'Could not like post');
  }
}

const __oldAddCommentV46 = typeof addComment === 'function' ? addComment : null;
addComment = async function(id){
  try{
    const input = document.getElementById(`comment-${id}`);
    const text = input?.value?.trim() || '';

    if(!text) return;

    await apiFetch(`${API.posts}/${id}/comment`, {
      method:'POST',
      body:JSON.stringify({text})
    });

    await loadFeed();
    refreshCurrentView();
    updateAllBadgesV46();
  }catch(e){
    toast(e.message || 'Could not comment');
  }
}

const __oldEnterDashboardV46 = typeof enterDashboardV37 === 'function' ? enterDashboardV37 : null;
if(__oldEnterDashboardV46){
  enterDashboardV37 = async function(userFromLogin=null){
    await __oldEnterDashboardV46(userFromLogin);
    updateAllBadgesV46();

    if(window.__badgeTimerV46) clearInterval(window.__badgeTimerV46);
    window.__badgeTimerV46 = setInterval(updateAllBadgesV46, 8000);
  };
}

if(typeof startActivityHeartbeat === 'function'){
  const __oldStartActivityHeartbeatV46 = startActivityHeartbeat;
  startActivityHeartbeat = function(){
    __oldStartActivityHeartbeatV46();
    setTimeout(updateAllBadgesV46, 500);
  };
}


/* =========================================================
   V47 MESSAGE BADGE CLEAR + AUTO NOTIFICATION READ + COVER IMAGE
   ========================================================= */

const COVER_CACHE_KEY_V47 = 'reconnect_cover_image_v47';

function userSuffixV47(username=''){
  return String(username || currentUserData?.username || 'me').toLowerCase().replace(/[^a-z0-9_]/g,'_');
}
function coverCacheKeyV47(username=''){ return `${COVER_CACHE_KEY_V47}_${userSuffixV47(username)}`; }
function getLocalCoverImageV47(username=''){
  try{return localStorage.getItem(coverCacheKeyV47(username)) || '';}catch{return '';}
}
function saveLocalCoverImageV47(username='', src=''){
  try{ if(src) localStorage.setItem(coverCacheKeyV47(username), src); else localStorage.removeItem(coverCacheKeyV47(username)); }catch{}
}
function coverImageForUserV47(user={}){ return user.coverImage || getLocalCoverImageV47(user.username) || ''; }
function renderCoverStyleV47(user={}){
  const src = coverImageForUserV47(user);
  if(!src) return '';
  return `style="background-image:linear-gradient(135deg, rgba(37,99,235,.28), rgba(124,58,237,.30)), url('${src}');background-size:cover;background-position:center;"`;
}
function isOwnProfileV47(user={}){ return String(user.username||'').toLowerCase() === String(currentUserData?.username||'').toLowerCase(); }
function openCoverPickerV47(){ const input=document.getElementById('coverUploadInputV47'); if(input) input.click(); }
async function handleCoverUploadV47(files){
  const file = files && files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')) return toast('Please choose an image');
  if(file.size > 5 * 1024 * 1024) return toast('Cover image should be under 5MB');
  const reader = new FileReader();
  reader.onload = async event => {
    const src = event.target.result;
    const username = currentUserData?.username || '';
    saveLocalCoverImageV47(username, src);
    try{
      const data = await apiFetch(`${API.users}/me/cover`, { method:'POST', body:JSON.stringify({coverImage:src}) });
      if(data.user) currentUserData = data.user;
      toast('Cover image updated');
    }catch(error){ console.warn('cover backend failed', error); toast('Cover image saved locally'); }
    renderProfile();
  };
  reader.readAsDataURL(file);
}
async function removeCoverImageV47(){
  const username = currentUserData?.username || '';
  saveLocalCoverImageV47(username, '');
  try{ const data = await apiFetch(`${API.users}/me/cover`, { method:'POST', body:JSON.stringify({coverImage:''}) }); if(data.user) currentUserData=data.user; }catch{}
  toast('Cover image removed');
  renderProfile();
}
function renderCoverActionsV47(user={}){
  if(!isOwnProfileV47(user)) return '';
  return `<div class="cover-actions-v47"><button onclick="openCoverPickerV47()">Change cover</button><button onclick="removeCoverImageV47()">Remove</button><input id="coverUploadInputV47" type="file" hidden accept="image/*" onchange="handleCoverUploadV47(this.files);this.value=''"></div>`;
}

function setBadgeV46(id,count){
  let badge = document.getElementById(id);
  if(!badge){
    const view = id === 'messageBadge' ? 'messages' : 'notifications';
    const btn = document.querySelector(`[data-view="${view}"] .nav-icon`) || document.querySelector(`[data-view="${view}"]`);
    if(btn){
      badge = document.createElement('b');
      badge.id = id;
      badge.className = 'nav-count-badge hidden';
      btn.classList.add(id === 'messageBadge' ? 'message-wrap' : 'bell-wrap');
      btn.appendChild(badge);
    }
  }
  if(!badge) return;
  const n = Number(count || 0);
  if(n > 0){ badge.textContent = n > 99 ? '99+' : String(n); badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}
async function updateMessageBadgeV46(){
  try{ if(!token()) return; const data = await apiFetch(`${API.messages}/unread-summary`); setBadgeV46('messageBadge', data.unreadConversations || 0); }catch(error){ console.warn('message badge failed', error); }
}
async function clearMessageBadgeAfterViewingV47(){
  try{ await apiFetch(`${API.messages}/read-all`, { method:'PATCH' }); }catch(error){ console.warn('message read-all failed', error); }
  setBadgeV46('messageBadge', 0);
}
async function updateNotificationBadgeV43(){
  try{ if(!token()) return; const data = await apiFetch(`${API.notifications}/unread-count`); setBadgeV46('notificationBadge', data.count || 0); }catch(error){ console.warn('notification badge failed', error); }
}
async function markNotificationsReadAfterViewingV47(){
  try{ await apiFetch(`${API.notifications}/read`, { method:'PATCH' }); }catch(error){ console.warn('notification mark read failed', error); }
  setBadgeV46('notificationBadge', 0);
}
async function updateAllBadgesV46(){ await Promise.all([updateMessageBadgeV46(), updateNotificationBadgeV43()]); }

const __oldRenderMessagesV47 = typeof renderMessages === 'function' ? renderMessages : null;
if(__oldRenderMessagesV47){
  renderMessages = function(){
    __oldRenderMessagesV47();
    setTimeout(clearMessageBadgeAfterViewingV47, 500);
  };
}
const __oldRenderNotificationsV47 = typeof renderNotifications === 'function' ? renderNotifications : null;
if(__oldRenderNotificationsV47){
  renderNotifications = async function(){
    await __oldRenderNotificationsV47();
    setTimeout(markNotificationsReadAfterViewingV47, 650);
  };
}
const __oldSwitchViewV47 = typeof switchView === 'function' ? switchView : null;
if(__oldSwitchViewV47){
  switchView = function(view){
    const result = __oldSwitchViewV47(view);
    if(view === 'messages') setTimeout(clearMessageBadgeAfterViewingV47, 550);
    else if(view === 'notifications') setTimeout(markNotificationsReadAfterViewingV47, 800);
    else setTimeout(updateAllBadgesV46, 450);
    return result;
  };
}

const __oldRenderProfileV47 = typeof renderProfile === 'function' ? renderProfile : null;
if(__oldRenderProfileV47){
  renderProfile = function(){
    activeView='profile';
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    const btn=document.querySelector('[data-view="profile"]'); if(btn)btn.classList.add('active');
    const u=currentUserData || {};
    const myPosts=(feedPosts||[]).filter(p=>p.author?.username===u.username);
    document.getElementById('mainContent').innerHTML=`
      ${renderTopbar()}
      <section class="account-profile-page card own-profile-page-v47">
        <div class="account-profile-cover editable-cover-v47" ${renderCoverStyleV47(u)}>${renderCoverActionsV47(u)}</div>
        <div class="account-profile-main">
          <div class="avatar big ${typeof presenceClassFor==='function'?presenceClassFor(u):'status-active'}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(u.avatar||'🔥','🔥'):escapeHTML(u.avatar||'🔥')}</div>
          <div class="account-profile-text"><p class="eyebrow">Account Profile</p><h1>${escapeHTML(u.displayName||u.username||'User')}</h1><p>@${escapeHTML(u.username||'user')}</p>${typeof renderFollowStats==='function'?renderFollowStats(u,u.username):`<div class="follow-stats"><button><strong>${(u.followers||[]).length}</strong><span>Followers</span></button><button><strong>${(u.following||[]).length}</strong><span>Following</span></button></div>`}</div>
        </div>
      </section>
      <section class="settings-panel card"><div class="settings-panel-head"><div><h2>Your Posts</h2><p>Posts created from your account.</p></div><span class="tag">${myPosts.length} posts</span></div><div id="feedList" class="feed"></div></section>`;
    renderFeedList(myPosts);
  };
}

const __oldRenderAccountProfileV47 = typeof renderAccountProfile === 'function' ? renderAccountProfile : null;
if(__oldRenderAccountProfileV47){
  renderAccountProfile = async function(username){
    await __oldRenderAccountProfileV47(username);
    try{
      const clean=String(username||'').replace('@','').toLowerCase().trim();
      const data=await apiFetch(`${API.users}/${encodeURIComponent(clean)}`);
      const user=data.user||{}; const cover=document.querySelector('.account-profile-cover');
      if(cover && coverImageForUserV47(user)) cover.setAttribute('style', renderCoverStyleV47(user).replace(/^style="/,'').replace(/"$/,''));
    }catch{}
  };
}

const __oldEnterDashboardV47 = typeof enterDashboardV37 === 'function' ? enterDashboardV37 : null;
if(__oldEnterDashboardV47){
  enterDashboardV37 = async function(userFromLogin=null){
    await __oldEnterDashboardV47(userFromLogin);
    updateAllBadgesV46();
    if(window.__badgeTimerV47) clearInterval(window.__badgeTimerV47);
    window.__badgeTimerV47 = setInterval(updateAllBadgesV46, 8000);
  };
}
setTimeout(updateAllBadgesV46, 1200);


/* =========================================================
   V48 MESSAGE BADGE + AUTO SEEN NOTIFICATION FIX
   ========================================================= */
function ensureBadgeElementV48(view, id){
  let badge=document.getElementById(id);
  if(badge) return badge;
  const navBtn=document.querySelector(`[data-view="${view}"]`) || Array.from(document.querySelectorAll('.nav-btn')).find(btn=>String(btn.textContent||'').toLowerCase().includes(view==='messages'?'message':'notification'));
  if(!navBtn) return null;
  let icon=navBtn.querySelector('.nav-icon') || navBtn.querySelector('span') || navBtn;
  icon.classList.add(view==='messages'?'message-wrap':'bell-wrap');
  badge=document.createElement('b');
  badge.id=id;
  badge.className='nav-count-badge hidden';
  badge.textContent='0';
  icon.appendChild(badge);
  return badge;
}
function setBadgeV48(id,count){
  const view=id==='messageBadge'?'messages':'notifications';
  const badge=ensureBadgeElementV48(view,id);
  if(!badge) return;
  const n=Number(count||0);
  if(n>0){badge.textContent=n>99?'99+':String(n);badge.classList.remove('hidden')}else{badge.textContent='0';badge.classList.add('hidden')}
}
async function getUnreadConversationsFallbackV48(){
  try{const data=await apiFetch(`${API.messages}/conversations`);return (data.conversations||[]).filter(c=>Number(c.unreadCount||0)>0).length}catch{return 0}
}
async function updateMessageBadgeV48(){
  try{
    if(!token()) return;
    try{const data=await apiFetch(`${API.messages}/unread-summary`);setBadgeV48('messageBadge',data.unreadConversations||0);return}catch(e){}
    setBadgeV48('messageBadge',await getUnreadConversationsFallbackV48());
  }catch(e){console.warn('message badge failed',e)}
}
async function clearMessageBadgeV48(){
  try{await apiFetch(`${API.messages}/read-all`,{method:'PATCH'})}catch(e){console.warn('message clear failed',e)}
  setBadgeV48('messageBadge',0);
}
async function updateNotificationBadgeV48(){
  try{if(!token()) return; const data=await apiFetch(`${API.notifications}/unread-count`); setBadgeV48('notificationBadge',data.count||0)}catch(e){console.warn('notification badge failed',e)}
}
async function clearNotificationBadgeV48(){
  try{await apiFetch(`${API.notifications}/read`,{method:'PATCH'})}catch(e){console.warn('notification clear failed',e)}
  setBadgeV48('notificationBadge',0);
}
async function updateAllBadgesV48(){
  ensureBadgeElementV48('messages','messageBadge');
  ensureBadgeElementV48('notifications','notificationBadge');
  await Promise.all([updateMessageBadgeV48(),updateNotificationBadgeV48()]);
}
try{setBadgeV46=setBadgeV48;updateMessageBadgeV46=updateMessageBadgeV48;updateNotificationBadgeV43=updateNotificationBadgeV48;updateAllBadgesV46=updateAllBadgesV48}catch{}
const __oldRenderMessagesV48=typeof renderMessages==='function'?renderMessages:null;
if(__oldRenderMessagesV48){renderMessages=function(){__oldRenderMessagesV48();setTimeout(clearMessageBadgeV48,450)}}
const __oldRenderNotificationsV48=typeof renderNotifications==='function'?renderNotifications:null;
if(__oldRenderNotificationsV48){renderNotifications=async function(){await __oldRenderNotificationsV48();setTimeout(clearNotificationBadgeV48,650)}}
const __oldSwitchViewV48=typeof switchView==='function'?switchView:null;
if(__oldSwitchViewV48){switchView=function(view){const result=__oldSwitchViewV48(view); if(view==='messages') setTimeout(clearMessageBadgeV48,650); else if(view==='notifications') setTimeout(clearNotificationBadgeV48,650); else setTimeout(updateAllBadgesV48,400); return result}}
const __oldLoadConversationsV48=typeof loadConversations==='function'?loadConversations:null;
if(__oldLoadConversationsV48){loadConversations=async function(){await __oldLoadConversationsV48(); if(activeView==='messages') setTimeout(clearMessageBadgeV48,400); else updateMessageBadgeV48()}}
const __oldLoadChatThreadV48=typeof loadChatThread==='function'?loadChatThread:null;
if(__oldLoadChatThreadV48){loadChatThread=async function(){await __oldLoadChatThreadV48();setTimeout(updateMessageBadgeV48,500)}}
const __oldEnterDashboardV48=typeof enterDashboardV37==='function'?enterDashboardV37:null;
if(__oldEnterDashboardV48){enterDashboardV37=async function(userFromLogin=null){await __oldEnterDashboardV48(userFromLogin);updateAllBadgesV48();if(window.__badgeTimerV48)clearInterval(window.__badgeTimerV48);window.__badgeTimerV48=setInterval(updateAllBadgesV48,6000)}}
setTimeout(updateAllBadgesV48,1000);


/* =========================================================
   V49 COMMENTS + MESSAGE ACTIONS + LAYOUT + PROFILE PHOTO MODAL
   ========================================================= */
let chatReplyToV49 = null;

function normalizeUsernameV49(username=''){
  return String(username||'').replace('@','').toLowerCase().trim();
}

function messageIdV49(msg={}){ return String(msg._id || msg.id || ''); }
function messageMineV49(msg={}){ return String(msg.sender?._id || msg.sender) === String(currentUserData?.id || currentUserData?._id); }

function replySnippetV49(msg={}){
  if(!msg) return '';
  return String(msg.body || (msg.media?.length?'Media message':'Message')).slice(0,90);
}

function setReplyToMessageV49(id, body, username){
  chatReplyToV49 = { id, body, username };
  renderReplyPreviewV49();
  const input=document.getElementById('chatMessageInput');
  if(input) input.focus();
}

function clearReplyToV49(){
  chatReplyToV49 = null;
  renderReplyPreviewV49();
}

function renderReplyPreviewV49(){
  const box=document.getElementById('replyPreviewV49');
  if(!box) return;
  if(!chatReplyToV49){ box.innerHTML=''; box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  box.innerHTML=`
    <div>
      <strong>Replying to @${escapeHTML(chatReplyToV49.username||'user')}</strong>
      <span>${escapeHTML(chatReplyToV49.body||'Message')}</span>
    </div>
    <button onclick="clearReplyToV49()">×</button>
  `;
}

function renderMessageActionsV49(msg){
  const id=messageIdV49(msg);
  const mine=messageMineV49(msg);
  const body=escapeHTML(replySnippetV49(msg));
  const username=escapeHTML(msg.sender?.username||'user');
  return `
    <div class="msg-actions-v49">
      <button onclick="reactMessageV49('${id}','❤️')">❤️</button>
      <button onclick="reactMessageV49('${id}','😂')">😂</button>
      <button onclick="reactMessageV49('${id}','👍')">👍</button>
      <button onclick="setReplyToMessageV49('${id}', '${body}', '${username}')">Reply</button>
      ${mine&&!msg.isDeleted?`<button onclick="editMessageV49('${id}', '${body}')">Edit</button>`:''}
      ${mine&&!msg.isDeleted?`<button onclick="unsendMessageV49('${id}')">Unsend</button>`:''}
      <button onclick="forwardMessageV49('${id}')">Forward</button>
    </div>
  `;
}

function renderReactionsV49(msg={}){
  const reactions=msg.reactions||[];
  if(!reactions.length) return '';
  const counts={};
  reactions.forEach(r=>{ counts[r.emoji]=(counts[r.emoji]||0)+1; });
  return `<div class="msg-reactions-v49">${Object.entries(counts).map(([e,c])=>`<span>${escapeHTML(e)} ${c}</span>`).join('')}</div>`;
}

function renderReplyBlockV49(msg={}){
  const r=msg.replyTo;
  if(!r) return '';
  return `<div class="reply-block-v49"><strong>@${escapeHTML(r.sender?.username||'user')}</strong><span>${escapeHTML(replySnippetV49(r))}</span></div>`;
}

function renderChatBubbleV49(msg){
  const mine=messageMineV49(msg);
  const receipt=typeof messageReceiptText==='function'?messageReceiptText(msg,mine):'';
  const deleted=Boolean(msg.isDeleted);
  return `
    <div class="chat-bubble ${mine?'mine':'theirs'} ${deleted?'deleted-msg-v49':''}" data-message-id="${messageIdV49(msg)}">
      ${renderReplyBlockV49(msg)}
      ${msg.forwardedFrom?'<div class="forwarded-label-v49">↗ Forwarded</div>':''}
      ${msg.body?`<p>${escapeHTML(msg.body||'')}</p>`:''}
      ${!deleted && typeof renderChatMessageMedia==='function'?renderChatMessageMedia(msg.media||[]):''}
      ${renderReactionsV49(msg)}
      <span>${new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}${msg.editedAt?' • edited':''}${receipt?' • '+escapeHTML(receipt):''}</span>
      ${renderMessageActionsV49(msg)}
    </div>
  `;
}

async function reactMessageV49(id,emoji){
  try{ await apiFetch(`${API.messages}/${id}/react`,{method:'PATCH',body:JSON.stringify({emoji})}); await loadChatThread(); }
  catch(e){ toast(e.message||'Could not react'); }
}
async function editMessageV49(id,oldBody=''){
  const body=prompt('Edit message:', oldBody.replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&'));
  if(body===null) return;
  if(!body.trim()) return toast('Message cannot be empty');
  try{ await apiFetch(`${API.messages}/${id}/edit`,{method:'PATCH',body:JSON.stringify({body})}); await loadChatThread(); }
  catch(e){ toast(e.message||'Could not edit'); }
}
async function unsendMessageV49(id){
  if(!confirm('Unsend this message?')) return;
  try{ await apiFetch(`${API.messages}/${id}`,{method:'DELETE'}); await loadChatThread(); await loadConversations(); }
  catch(e){ toast(e.message||'Could not unsend'); }
}
async function forwardMessageV49(id){
  const toUsername=prompt('Forward to username:');
  if(!toUsername) return;
  try{ await apiFetch(`${API.messages}/${id}/forward`,{method:'POST',body:JSON.stringify({toUsername:normalizeUsernameV49(toUsername)})}); toast('Message forwarded'); }
  catch(e){ toast(e.message||'Could not forward'); }
}

/* Override chat thread render with message actions */
async function loadChatThread(){
  if(!activeChatUsername) return;
  try{
    const data=await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}`);
    const other=data.user||{username:activeChatUsername};
    const messages=data.messages||[];
    try{ await loadPresence(activeChatUsername); }catch{}
    const header=document.getElementById('chatThreadHeader');
    if(header){
      const statusText=typeof presenceLineFor==='function'?presenceLineFor(other):'active';
      header.innerHTML=`
        <div class="chat-user-head">
          <div id="chatHeaderAvatar" data-presence-user="${escapeHTML(activeChatUsername)}" class="avatar sm ${typeof presenceClassFor==='function'?presenceClassFor(other):''}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(other.avatar||'👤','👤'):escapeHTML(other.avatar||'👤')}</div>
          <div><h2>${escapeHTML(other.displayName||other.username||'User')}</h2><p>@${escapeHTML(other.username||activeChatUsername)} • <span id="chatPresenceLine">${escapeHTML(statusText)}</span></p></div>
          <div class="call-buttons-v42"><button title="Audio call" onclick="startCallV42('audio')">${typeof iconPhoneV42==='function'?iconPhoneV42():'☎️'}</button><button title="Video call" onclick="startCallV42('video')">${typeof iconVideoV42==='function'?iconVideoV42():'🎥'}</button></div>
        </div>`;
    }
    const box=document.getElementById('chatMessages');
    if(!box) return;
    box.innerHTML = messages.length ? messages.map(renderChatBubbleV49).join('') : '<div class="collection-empty">No messages yet. Say hello.</div>';
    box.scrollTop=box.scrollHeight;
    await apiFetch(`${API.messages}/${encodeURIComponent(activeChatUsername)}/read`,{method:'PATCH'});
    if(typeof updateMessageBadgeV48==='function') updateMessageBadgeV48();
  }catch(error){ const box=document.getElementById('chatMessages'); if(box) box.innerHTML=`<div class="collection-empty">${escapeHTML(error.message)}</div>`; }
}

/* Ensure reply preview exists in composer */
const __oldRenderMessagesV49=typeof renderMessages==='function'?renderMessages:null;
if(__oldRenderMessagesV49){
  renderMessages=function(){
    __oldRenderMessagesV49();
    const pop=document.querySelector('.chat-compose .composer-popups') || document.querySelector('.pro-chat-compose .composer-popups');
    if(pop && !document.getElementById('replyPreviewV49')){
      const div=document.createElement('div');
      div.id='replyPreviewV49';
      div.className='reply-preview-v49 hidden';
      pop.prepend(div);
    }
  }
}

const __oldSendChatMessageV49=typeof sendChatMessage==='function'?sendChatMessage:null;
sendChatMessage=async function(){
  const input=document.getElementById('chatMessageInput');
  const body=(input?.value||'').trim();
  if(!activeChatUsername) return toast('Open a chat first');
  if(typeof chatRecording!=='undefined' && chatRecording) return toast('Stop recording first');
  if(!body && !(typeof pendingChatMedia!=='undefined' && pendingChatMedia.length)) return toast('Write a message or attach media');
  try{
    const media=(typeof pendingChatMedia!=='undefined'?pendingChatMedia:[]).map(item=>({url:item.src,type:item.type,name:item.name,size:item.size,isVoiceNote:Boolean(item.isVoiceNote)}));
    const hasVoice=media.some(item=>item.isVoiceNote||String(item.type||'').startsWith('audio/'));
    const inferredType=hasVoice?'audio':media.length?(typeof chatMediaTypeFor==='function'?chatMediaTypeFor(media[0].type):'file'):'text';
    await apiFetch(API.messages,{method:'POST',body:JSON.stringify({toUsername:activeChatUsername,body:body||(hasVoice?'Voice note':''),type:inferredType,media,replyTo:chatReplyToV49?.id||null})});
    if(input) input.value='';
    if(typeof clearChatPendingMedia==='function') clearChatPendingMedia();
    clearReplyToV49();
    const e=document.getElementById('chatEmojiPicker'); if(e) e.classList.add('hidden');
    const g=document.getElementById('chatGifPicker'); if(g) g.classList.add('hidden');
    try{ await sendPresence({typing:false,recording:false,sendingMedia:false}); }catch{}
    await loadChatThread(); await loadConversations();
  }catch(error){ toast(error.message||'Could not send message'); }
}

/* Better comments on exact post */
function renderComments(p){
  const comments=(p.comments||[]).map(c=>`<div class="comment comment-v49"><div class="avatar sm">${typeof renderAvatarHTML==='function'?renderAvatarHTML(c.author?.avatar||'👤','👤'):escapeHTML(c.author?.avatar||'👤')}</div><div><strong>${escapeHTML(c.author?.displayName||c.author?.username||'User')}</strong><span>@${escapeHTML(c.author?.username||'user')}</span><p>${escapeHTML(c.text)}</p></div></div>`).join('');
  return `<div class="comments comments-v49">${comments||'<p class="muted">No comments yet. Be the first to comment.</p>'}<div class="comment-row comment-row-v49"><input id="comment-${p._id}" placeholder="Comment on this post..." onkeydown="commentEnter(event,'${p._id}')"><button onclick="addComment('${p._id}')">Comment</button></div></div>`;
}

/* Profile photo from profile tab + premium modal */
function openProfilePhotoModal(){
  const existing=document.getElementById('profilePhotoModalV49');
  if(existing) existing.remove();
  const modal=document.createElement('div');
  modal.id='profilePhotoModalV49';
  modal.className='profile-photo-modal-v49';
  modal.innerHTML=`
    <div class="profile-photo-card-v49">
      <button class="profile-photo-close-v49" onclick="document.getElementById('profilePhotoModalV49')?.remove()">×</button>
      <p class="eyebrow">Profile Picture</p>
      <h2>Change your profile picture</h2>
      <div class="profile-photo-preview-v49">${typeof renderAvatarHTML==='function'?renderAvatarHTML(getProfilePhoto ? getProfilePhoto() : (currentUserData?.avatar||'🔥'),'🔥'):(currentUserData?.avatar||'🔥')}</div>
      <p class="profile-photo-help-v49">Upload an image, use emoji avatar, or remove the current picture.</p>
      <div class="profile-photo-actions-v49">
        <button class="primary" onclick="document.getElementById('profilePhotoInputV49').click()">Upload picture</button>
        <button onclick="setEmojiProfilePhotoV49()">Use emoji</button>
        <button onclick="removeProfilePhotoV49()">Remove picture</button>
      </div>
      <input id="profilePhotoInputV49" hidden type="file" accept="image/*" onchange="handleProfilePhotoUploadV49(this.files);this.value=''">
    </div>`;
  document.body.appendChild(modal);
}
function handleProfilePhotoUploadV49(files){
  const file=files&&files[0]; if(!file) return;
  if(!file.type.startsWith('image/')) return toast('Choose an image');
  if(file.size>4*1024*1024) return toast('Image should be under 4MB');
  const reader=new FileReader();
  reader.onload=e=>{ localStorage.setItem('reconnect_profile_photo', e.target.result); if(currentUserData) currentUserData.avatar=e.target.result; renderLeftProfile(); if(activeView==='profile')renderProfile(); document.getElementById('profilePhotoModalV49')?.remove(); toast('Profile picture updated'); };
  reader.readAsDataURL(file);
}
function setEmojiProfilePhotoV49(){
  const emoji=prompt('Enter one emoji for profile picture:', currentUserData?.avatar || '🔥');
  if(!emoji) return;
  localStorage.setItem('reconnect_profile_photo', emoji.trim().slice(0,4));
  if(currentUserData) currentUserData.avatar=emoji.trim().slice(0,4);
  renderLeftProfile(); if(activeView==='profile')renderProfile(); document.getElementById('profilePhotoModalV49')?.remove(); toast('Profile emoji updated');
}
function removeProfilePhotoV49(){
  localStorage.removeItem('reconnect_profile_photo'); if(currentUserData) currentUserData.avatar='🔥'; renderLeftProfile(); if(activeView==='profile')renderProfile(); document.getElementById('profilePhotoModalV49')?.remove(); toast('Profile picture removed');
}

/* Add profile picture button and logout footer in settings/profile */
const __oldRenderProfileV49=typeof renderProfile==='function'?renderProfile:null;
if(__oldRenderProfileV49){
  renderProfile=function(){
    __oldRenderProfileV49();
    const profilePage=document.querySelector('.account-profile-main') || document.querySelector('.profile-hero');
    if(profilePage && !document.querySelector('.profile-photo-profile-btn-v49')){
      const btn=document.createElement('button'); btn.className='profile-photo-profile-btn-v49'; btn.textContent='Change profile picture'; btn.onclick=openProfilePhotoModal; profilePage.appendChild(btn);
    }
  }
}
const __oldRenderSettingsV49=typeof renderSettings==='function'?renderSettings:null;
if(__oldRenderSettingsV49){
  renderSettings=function(){
    __oldRenderSettingsV49();
    const main=document.getElementById('mainContent');
    if(main && !document.querySelector('.settings-logout-footer-v49')){
      const footer=document.createElement('section'); footer.className='settings-logout-footer-v49 card';
      footer.innerHTML='<div><h2>Session</h2><p>Logout from this browser session.</p></div><button onclick="logout()">Logout</button>';
      main.appendChild(footer);
    }
  }
}


/* =========================================================
   V50 FORWARD MODAL + SHARE PROTOCOL + NOTIFICATION OPEN + LAYOUT FIX
   ========================================================= */

let forwardMessageIdV50 = null;
let sharePostIdV50 = null;
let forwardTargetsCacheV50 = [];

function normalizeUsernameV50(username=''){
  return String(username||'').replace('@','').trim().toLowerCase();
}

function ensureModalRootV50(){
  let root=document.getElementById('modalRootV50');
  if(!root){
    root=document.createElement('div');
    root.id='modalRootV50';
    document.body.appendChild(root);
  }
  return root;
}

function closeModalV50(){
  const root=document.getElementById('modalRootV50');
  if(root) root.innerHTML='';
  forwardMessageIdV50=null;
  sharePostIdV50=null;
}

async function getForwardTargetsV50(){
  const map=new Map();

  try{
    const data=await apiFetch(`${API.messages}/conversations`);
    (data.conversations||[]).forEach(conv=>{
      const u=conv.user||{};
      const username=normalizeUsernameV50(u.username);
      if(username && username!==normalizeUsernameV50(currentUserData?.username)) map.set(username,u);
    });
  }catch(e){ console.warn('conversation target load failed', e); }

  try{
    const data=await apiFetch(`${API.users}/suggestions/list`);
    (data.users||[]).forEach(u=>{
      const username=normalizeUsernameV50(u.username);
      if(username && username!==normalizeUsernameV50(currentUserData?.username) && !map.has(username)) map.set(username,u);
    });
  }catch(e){ console.warn('suggestion target load failed', e); }

  forwardTargetsCacheV50=[...map.values()];
  return forwardTargetsCacheV50;
}

function renderTargetListV50(list=[], mode='forward'){
  if(!list.length){
    return '<div class="collection-empty">No chat people found. Type a username above and send directly.</div>';
  }

  return list.map(user=>{
    const username=normalizeUsernameV50(user.username);
    return `
      <button class="target-row-v50" onclick="${mode==='share'?`sendPostShareToV50('${username}')`:`sendForwardMessageToV50('${username}')`}">
        <div class="avatar sm ${typeof presenceClassFor==='function'?presenceClassFor(user):''}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(user.avatar||'👤','👤'):escapeHTML(user.avatar||'👤')}</div>
        <div>
          <strong>${escapeHTML(user.displayName||user.username||'User')}</strong>
          <span>@${escapeHTML(user.username||'user')}</span>
        </div>
        <b>${mode==='share'?'Share':'Forward'}</b>
      </button>
    `;
  }).join('');
}

function filterTargetsV50(mode='forward'){
  const q=normalizeUsernameV50(document.getElementById('targetSearchV50')?.value||'');
  const list=forwardTargetsCacheV50.filter(u=>{
    const username=normalizeUsernameV50(u.username);
    const name=String(u.displayName||'').toLowerCase();
    return !q || username.includes(q) || name.includes(q);
  });
  const box=document.getElementById('targetListV50');
  if(box) box.innerHTML=renderTargetListV50(list, mode);
}

async function forwardMessageV49(id){
  forwardMessageIdV50=id;
  const root=ensureModalRootV50();
  root.innerHTML=`
    <section class="modal-backdrop-v50" onclick="closeModalV50()">
      <div class="target-modal-v50" onclick="event.stopPropagation()">
        <div class="target-modal-head-v50">
          <div>
            <p class="eyebrow">Forward Message</p>
            <h2>Choose a person</h2>
            <span>Search from your chats, or type a username directly.</span>
          </div>
          <button onclick="closeModalV50()">×</button>
        </div>

        <div class="target-search-row-v50">
          <input id="targetSearchV50" placeholder="Search name or username..." oninput="filterTargetsV50('forward')">
          <button onclick="sendForwardFromSearchV50()">Send</button>
        </div>

        <div id="targetListV50" class="target-list-v50">
          <div class="collection-empty">Loading people...</div>
        </div>
      </div>
    </section>
  `;

  const list=await getForwardTargetsV50();
  const box=document.getElementById('targetListV50');
  if(box) box.innerHTML=renderTargetListV50(list,'forward');
  setTimeout(()=>document.getElementById('targetSearchV50')?.focus(),80);
}

async function sendForwardFromSearchV50(){
  const username=normalizeUsernameV50(document.getElementById('targetSearchV50')?.value||'');
  if(!username) return toast('Type username or select a person');
  return sendForwardMessageToV50(username);
}

async function sendForwardMessageToV50(username){
  const clean=normalizeUsernameV50(username);
  if(!forwardMessageIdV50 || !clean) return toast('Forward target missing');
  try{
    await apiFetch(`${API.messages}/${forwardMessageIdV50}/forward`,{
      method:'POST',
      body:JSON.stringify({toUsername:clean})
    });
    toast(`Forwarded to @${clean}`);
    closeModalV50();
    if(typeof loadConversations==='function') loadConversations();
  }catch(e){
    toast(e.message||'Could not forward');
  }
}

function postByIdV50(id){
  return (feedPosts||[]).find(p=>String(p._id)===String(id));
}

async function sharePost(postId){
  return sharePostV50(postId);
}

async function sharePostV50(postId){
  if(!postId){
    toast('Share post id missing');
    return;
  }
  sharePostIdV50=postId;
  const post=postByIdV50(postId);
  const shareText=`${post?.author?.displayName||'Someone'} on reConnect: ${String(post?.content||'Post').slice(0,140)}`;
  const shareLink=`${location.origin}${location.pathname}#post-${postId}`;

  const root=ensureModalRootV50();
  root.innerHTML=`
    <section class="modal-backdrop-v50" onclick="closeModalV50()">
      <div class="target-modal-v50" onclick="event.stopPropagation()">
        <div class="target-modal-head-v50">
          <div>
            <p class="eyebrow">Share Post</p>
            <h2>Share this post</h2>
            <span>Send inside reConnect or copy link.</span>
          </div>
          <button onclick="closeModalV50()">×</button>
        </div>

        <div class="share-preview-v50">
          <strong>${escapeHTML(post?.author?.displayName||'Post')}</strong>
          <p>${escapeHTML(String(post?.content||'').slice(0,180))}</p>
        </div>

        <div class="share-actions-v50">
          <button onclick="copyPostLinkV50('${postId}')">Copy Link</button>
          <button onclick="webSharePostV50('${postId}')">System Share</button>
        </div>

        <div class="target-search-row-v50">
          <input id="targetSearchV50" placeholder="Search person to share..." oninput="filterTargetsV50('share')">
          <button onclick="sendPostShareFromSearchV50()">Send</button>
        </div>

        <div id="targetListV50" class="target-list-v50">
          <div class="collection-empty">Loading people...</div>
        </div>
      </div>
    </section>
  `;

  const list=await getForwardTargetsV50();
  const box=document.getElementById('targetListV50');
  if(box) box.innerHTML=renderTargetListV50(list,'share');
  window.__shareTextV50=shareText;
  window.__shareLinkV50=shareLink;
}

async function copyPostLinkV50(postId){
  const link=`${location.origin}${location.pathname}#post-${postId}`;
  try{
    await navigator.clipboard.writeText(link);
    toast('Post link copied');
  }catch{
    toast(link);
  }
}

async function webSharePostV50(postId){
  const post=postByIdV50(postId);
  const text=`${post?.author?.displayName||'Someone'} on reConnect: ${String(post?.content||'Post').slice(0,140)}`;
  const url=`${location.origin}${location.pathname}#post-${postId}`;
  if(navigator.share){
    try{ await navigator.share({title:'reConnect Post', text, url}); }catch{}
  }else{
    await copyPostLinkV50(postId);
  }
}

async function sendPostShareFromSearchV50(){
  const username=normalizeUsernameV50(document.getElementById('targetSearchV50')?.value||'');
  if(!username) return toast('Type username or select a person');
  return sendPostShareToV50(username);
}

async function sendPostShareToV50(username){
  const clean=normalizeUsernameV50(username);
  const post=postByIdV50(sharePostIdV50);
  if(!clean || !sharePostIdV50) return toast('Share target missing');
  const body=`Shared a post: ${post?.author?.displayName||'Someone'} — ${String(post?.content||'Post').slice(0,180)}\n${location.origin}${location.pathname}#post-${sharePostIdV50}`;
  try{
    await apiFetch(API.messages,{
      method:'POST',
      body:JSON.stringify({toUsername:clean, body, type:'text', media:[]})
    });
    toast(`Post shared with @${clean}`);
    closeModalV50();
    if(typeof loadConversations==='function') loadConversations();
  }catch(e){
    toast(e.message||'Could not share post');
  }
}

function notificationTextV43(n){
  const actor=n.actor||{};
  const name=actor.displayName||actor.username||'Someone';
  if(n.type==='follow') return `${name} followed you`;
  if(n.type==='like') return n.text || `${name} liked your post`;
  if(n.type==='comment') return n.text || `${name} commented on your post`;
  if(n.text) return n.text;
  return 'New notification';
}

function openPostFromNotificationV50(postId, notificationId=''){
  if(!postId){ toast('Post not found'); return; }
  openComments.add(postId);
  activeView='home';
  renderHome().then(()=>{
    const el=document.querySelector(`[data-post-id="${postId}"]`) || document.getElementById(`post-${postId}`);
    if(el){
      el.scrollIntoView({behavior:'smooth', block:'center'});
      el.classList.add('post-highlight-v50');
      setTimeout(()=>el.classList.remove('post-highlight-v50'),2200);
    }else{
      toast('Post opened in feed if available');
    }
  });
}

function renderNotificationCardsV43(items=[]){
  if(!items.length){
    return '<div class="collection-empty">No notifications yet. Follow, like, and comment alerts will appear here.</div>';
  }
  return items.map(n=>{
    const actor=n.actor||{};
    const unread=!n.isRead;
    const username=normalizeUsernameV50(actor.username||'');
    const postContent=n.post?.content || '';
    const canOpen=Boolean(n.post?._id);
    return `
      <article class="notification-card-v43 ${unread?'unread':''} ${canOpen?'clickable-v50':''}" ${canOpen?`onclick="openPostFromNotificationV50('${n.post._id}','${n._id}')"`:''}>
        <button class="notification-user-v43" onclick="event.stopPropagation();${username?`openAccountProfile('${escapeHTML(username)}')`:''}">
          <div class="notification-icon-v43">${notificationIconV43(n.type)}</div>
          <div class="avatar sm ${typeof presenceClassFor==='function'?presenceClassFor(actor):''}">${typeof renderAvatarHTML==='function'?renderAvatarHTML(actor.avatar||'👤','👤'):escapeHTML(actor.avatar||'👤')}</div>
          <div>
            <strong>${escapeHTML(notificationTextV43(n))}</strong>
            <span>@${escapeHTML(actor.username||'user')} • ${timeAgo(n.createdAt)}</span>
            ${postContent?`<p><b>Post:</b> ${escapeHTML(String(postContent).slice(0,130))}</p>`:''}
            ${canOpen?'<em>Click to open post comments</em>':''}
          </div>
        </button>
        ${unread?'<b class="unread-dot-v43"></b>':''}
      </article>
    `;
  }).join('');
}

/* Better comments block for particular posts */
function renderComments(p){
  const comments=(p.comments||[]).map(c=>`
    <div class="comment comment-v50" id="comment-${p._id}-${c._id||''}">
      <div class="avatar sm">${typeof renderAvatarHTML==='function'?renderAvatarHTML(c.author?.avatar||'👤','👤'):escapeHTML(c.author?.avatar||'👤')}</div>
      <div>
        <strong>${escapeHTML(c.author?.displayName||c.author?.username||'User')}</strong>
        <span>@${escapeHTML(c.author?.username||'user')} ${c.createdAt?'• '+timeAgo(c.createdAt):''}</span>
        <p>${escapeHTML(c.text)}</p>
      </div>
    </div>
  `).join('');
  return `
    <div class="comments comments-v50">
      ${comments||'<p class="muted">No comments yet.</p>'}
      <div class="comment-row comment-row-v50">
        <input id="comment-${p._id}" placeholder="Comment on this post..." onkeydown="commentEnter(event,'${p._id}')">
        <button onclick="addComment('${p._id}')">Comment</button>
      </div>
    </div>
  `;
}

/* Override feed list so Share has real post id and notifications can open exact post */
function renderFeedList(posts){
  const c=document.getElementById('feedList');
  if(!c) return;
  if(!posts.length){ c.innerHTML='<div class="card empty">No posts found.</div>'; return; }
  c.innerHTML=posts.map(p=>{
    const a=p.author||{};
    const username=normalizeUsernameV50(a.username||'');
    const liked=(p.likes||[]).some(id=>String(id)===String(currentUserData.id||currentUserData._id));
    const saved=typeof isPostSaved==='function'?isPostSaved(p._id):false;
    const open=openComments&&openComments.has?openComments.has(p._id):false;
    const canDelete=String(a._id)===String(currentUserData.id||currentUserData._id);
    return `
      <article class="post card" id="post-${p._id}" data-post-id="${p._id}">
        <div class="post-head">
          <button class="profile-link" data-profile-username="${escapeHTML(username)}" onclick="openAccountProfile(this.dataset.profileUsername)">
            ${avatarBox(a,p.createdAt)}
            <div>
              <strong>${escapeHTML(a.displayName||a.username||'User')}</strong>
              <span>@${escapeHTML(a.username||'user')} • ${typeof statusTextFor==='function'?statusTextFor(a,p.createdAt):''} • ${timeAgo(p.createdAt)}</span>
            </div>
          </button>
          <div class="post-head-actions">
            ${typeof renderFollowButton==='function'?renderFollowButton(a):''}
            <button class="mini-more" data-profile-username="${escapeHTML(username)}" onclick="event.stopPropagation();openAccountProfile(this.dataset.profileUsername)">View</button>
            <span class="mood-pill">${escapeHTML(p.mood||'Thought')}</span>
          </div>
        </div>
        <p class="post-text">${escapeHTML(p.content||'')}</p>
        ${typeof renderPostMedia==='function'?renderPostMedia(p):''}
        <div class="post-actions">
          <button class="action ${liked?'liked':''}" onclick="likePost('${p._id}')">❤️ ${(p.likes||[]).length}</button>
          <button class="action" onclick="toggleComments('${p._id}')">💬 ${(p.comments||[]).length}</button>
          <button class="action ${saved?'liked':''}" onclick="toggleSavePost('${p._id}')">${saved?'🔖 Saved':'🔖 Save'}</button>
          <button class="action" onclick="sharePostV50('${p._id}')">↗ Share</button>
          ${canDelete?`<button class="action" onclick="deletePost('${p._id}')">Delete</button>`:''}
        </div>
        ${open?renderComments(p):''}
      </article>
    `;
  }).join('');
}


/* =========================================================
   V51 FORWARD FIX + SIDEBAR ALIGNMENT RESCUE
   ========================================================= */

let forwardMessageIdV51 = null;
let forwardMessagePreviewV51 = '';

function ensureForwardModalV51(){
  let modal = document.getElementById('forwardModalV51');
  if(modal) return modal;

  modal = document.createElement('div');
  modal.id = 'forwardModalV51';
  modal.className = 'forward-modal-v51 hidden';
  document.body.appendChild(modal);
  return modal;
}

function closeForwardModalV51(){
  const modal = document.getElementById('forwardModalV51');
  if(modal){
    modal.classList.add('hidden');
    modal.innerHTML = '';
  }
  forwardMessageIdV51 = null;
  forwardMessagePreviewV51 = '';
}

async function getForwardPeopleV51(){
  const people = new Map();

  try{
    const data = await apiFetch(`${API.messages}/conversations`);
    (data.conversations || []).forEach(conv=>{
      const u = conv.user || {};
      if(u.username) people.set(u.username.toLowerCase(), u);
    });
  }catch{}

  try{
    const data = await apiFetch(`${API.users}/suggestions/list`);
    (data.users || []).forEach(u=>{
      if(u.username) people.set(u.username.toLowerCase(), u);
    });
  }catch{}

  return Array.from(people.values()).filter(u=>u.username !== currentUserData?.username);
}

async function openForwardMessageModalV51(messageId, preview=''){
  forwardMessageIdV51 = messageId;
  forwardMessagePreviewV51 = preview || '';

  const modal = ensureForwardModalV51();
  modal.classList.remove('hidden');

  modal.innerHTML = `
    <div class="forward-card-v51">
      <div class="forward-head-v51">
        <div>
          <p class="eyebrow">Forward Message</p>
          <h2>Send to someone</h2>
          <span>Search from your chats or type username.</span>
        </div>
        <button onclick="closeForwardModalV51()">×</button>
      </div>

      <div class="forward-preview-v51">
        <strong>Message preview</strong>
        <p>${escapeHTML(forwardMessagePreviewV51 || 'Forward selected message')}</p>
      </div>

      <div class="forward-search-v51">
        <input id="forwardSearchInputV51" placeholder="Search or type username..." oninput="renderForwardPeopleV51()">
        <button onclick="sendForwardToTypedUsernameV51()">Send</button>
      </div>

      <div id="forwardPeopleListV51" class="forward-people-v51">
        <div class="collection-empty">Loading people...</div>
      </div>
    </div>
  `;

  await renderForwardPeopleV51();
}

async function renderForwardPeopleV51(){
  const box = document.getElementById('forwardPeopleListV51');
  if(!box) return;

  const q = String(document.getElementById('forwardSearchInputV51')?.value || '').toLowerCase().trim();
  const people = await getForwardPeopleV51();
  const filtered = people.filter(u=>{
    const hay = `${u.displayName || ''} ${u.username || ''}`.toLowerCase();
    return !q || hay.includes(q);
  });

  if(!filtered.length){
    box.innerHTML = '<div class="collection-empty">No people found. Type username and press Send.</div>';
    return;
  }

  box.innerHTML = filtered.map(u=>`
    <button class="forward-person-v51" onclick="sendForwardToUsernameV51('${escapeHTML(u.username)}')">
      <div class="avatar sm">${typeof renderAvatarHTML==='function'?renderAvatarHTML(u.avatar||'👤','👤'):escapeHTML(u.avatar||'👤')}</div>
      <div>
        <strong>${escapeHTML(u.displayName || u.username || 'User')}</strong>
        <span>@${escapeHTML(u.username || 'user')}</span>
      </div>
      <b>Send</b>
    </button>
  `).join('');
}

async function sendForwardToTypedUsernameV51(){
  const username = String(document.getElementById('forwardSearchInputV51')?.value || '').replace('@','').trim().toLowerCase();
  if(!username) return toast('Enter username');
  return sendForwardToUsernameV51(username);
}

async function sendForwardToUsernameV51(username){
  const clean = String(username || '').replace('@','').trim().toLowerCase();

  if(!clean) return toast('Username required');
  if(clean === String(currentUserData?.username || '').toLowerCase()) return toast('You cannot forward to yourself');

  const btns = document.querySelectorAll('.forward-person-v51, .forward-search-v51 button');
  btns.forEach(b=>b.disabled = true);

  try{
    if(forwardMessageIdV51){
      try{
        await apiFetch(`${API.messages}/${encodeURIComponent(forwardMessageIdV51)}/forward`, {
          method:'POST',
          body:JSON.stringify({toUsername:clean})
        });
      }catch(primaryError){
        // fallback: send a normal forwarded text if backend route is missing on older installs
        await apiFetch(API.messages, {
          method:'POST',
          body:JSON.stringify({
            toUsername:clean,
            body:`Forwarded: ${forwardMessagePreviewV51 || 'message'}`,
            type:'text',
            media:[]
          })
        });
      }
    }else{
      await apiFetch(API.messages, {
        method:'POST',
        body:JSON.stringify({
          toUsername:clean,
          body:`Forwarded: ${forwardMessagePreviewV51 || 'message'}`,
          type:'text',
          media:[]
        })
      });
    }

    closeForwardModalV51();
    toast(`Sent to @${clean}`);

    if(typeof loadConversations === 'function') loadConversations();
    if(activeChatUsername === clean && typeof loadChatThread === 'function') loadChatThread();
  }catch(error){
    console.error('Forward failed:', error);
    toast(error.message || 'Could not forward message');
    btns.forEach(b=>b.disabled = false);
  }
}

/* Compatibility aliases for older V49/V50 onclick names */
function forwardMessage(messageId, preview=''){
  return openForwardMessageModalV51(messageId, preview);
}
function openForwardModal(messageId, preview=''){
  return openForwardMessageModalV51(messageId, preview);
}
function forwardChatMessage(messageId, preview=''){
  return openForwardMessageModalV51(messageId, preview);
}

/* Patch message action rendering by event delegation */
document.addEventListener('click', function(e){
  const btn = e.target.closest('[data-forward-message-id]');
  if(!btn) return;
  e.preventDefault();
  const id = btn.getAttribute('data-forward-message-id');
  const preview = btn.getAttribute('data-forward-preview') || '';
  openForwardMessageModalV51(id, preview);
});

/* Fix/create sidebar order after render */
function reorderSidebarV51(){
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) return;

  const buttons = Array.from(sidebar.querySelectorAll('button, .nav-btn, .side-action, .quick-action, a'));
  buttons.forEach(el=>{
    const txt = (el.textContent || '').toLowerCase();
    const title = (el.getAttribute('title') || '').toLowerCase();
    const dataView = (el.getAttribute('data-view') || '').toLowerCase();
    const onclick = (el.getAttribute('onclick') || '').toLowerCase();

    if(txt.includes('+') || title.includes('create') || onclick.includes('create')) el.classList.add('sidebar-create-v51');
    if(dataView === 'profile' || title.includes('profile')) el.classList.add('sidebar-profile-v51');
    if(dataView === 'home' || title.includes('home')) el.classList.add('sidebar-home-v51');
  });
}

setInterval(reorderSidebarV51, 1200);
setTimeout(reorderSidebarV51, 500);

/* Right panel rescue */
function rescueRightPanelV51(){
  const right = document.querySelector('.right');
  if(!right) return;
  right.classList.add('right-rescue-v51');
}
setInterval(rescueRightPanelV51, 1200);
setTimeout(rescueRightPanelV51, 500);


/* =========================================================
   V52 RESPONSIVE LAYOUT LOCK
   Keeps sidebar/main/right panel stable on all screen sizes.
   ========================================================= */

function applyResponsiveLayoutV52(){
  const root = document.documentElement;
  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;

  const compactWidth = width < 900;
  const shortHeight = height < 720;

  document.body.classList.toggle('layout-compact-v52', compactWidth);
  document.body.classList.toggle('layout-short-v52', shortHeight);

  // Useful CSS variables for stable sizing
  root.style.setProperty('--v52-left-rail', compactWidth ? '0px' : '108px');
  root.style.setProperty('--v52-right-rail', width < 1180 ? '0px' : '116px');

  const sidebar = document.querySelector('.sidebar');
  if(sidebar){
    sidebar.classList.add('sidebar-v52-lock');
  }

  const right = document.querySelector('.right');
  if(right){
    right.classList.add('right-v52-lock');
  }

  const main = document.querySelector('#mainContent.main, .main');
  if(main){
    main.classList.add('main-v52-lock');
  }
}

window.addEventListener('resize', applyResponsiveLayoutV52);
window.addEventListener('orientationchange', applyResponsiveLayoutV52);
setInterval(applyResponsiveLayoutV52, 1200);
setTimeout(applyResponsiveLayoutV52, 200);
setTimeout(applyResponsiveLayoutV52, 1000);


/* =========================================================
   V53 COMPACT SIDEBAR + RIGHT PANEL FIX
   Small fixed icons, stable rails, clean minimized layout.
   ========================================================= */

function applyLayoutV53(){
  const w = window.innerWidth || document.documentElement.clientWidth;
  const h = window.innerHeight || document.documentElement.clientHeight;

  document.body.classList.toggle('v53-narrow', w <= 860);
  document.body.classList.toggle('v53-medium', w > 860 && w <= 1180);
  document.body.classList.toggle('v53-short', h <= 760);

  const sidebar = document.querySelector('.sidebar');
  if(sidebar){
    sidebar.classList.add('sidebar-v53');
    sidebar.querySelectorAll('button,.nav-btn,.side-action,a,[role="button"]').forEach(btn=>{
      btn.classList.add('sidebar-btn-v53');
    });
  }

  const right = document.querySelector('.right');
  if(right){
    right.classList.add('right-v53');
  }

  const main = document.querySelector('#mainContent.main,.main');
  if(main){
    main.classList.add('main-v53');
  }
}

function rebuildRightPanelV53(){
  const right = document.querySelector('.right');
  if(!right) return;

  right.classList.add('right-v53');

  // If previous CSS/HTML expanded it badly, keep its existing useful content but force compact shell.
  right.querySelectorAll('*').forEach(el=>{
    el.style.maxWidth = '100%';
    el.style.boxSizing = 'border-box';
  });
}

window.addEventListener('resize', applyLayoutV53);
window.addEventListener('orientationchange', applyLayoutV53);
setInterval(()=>{ applyLayoutV53(); rebuildRightPanelV53(); }, 1000);
setTimeout(()=>{ applyLayoutV53(); rebuildRightPanelV53(); }, 200);
setTimeout(()=>{ applyLayoutV53(); rebuildRightPanelV53(); }, 1000);


/* =========================================================
   V54 SAME UI EVERY SCREEN FIX
   Makes large monitor layout look like normal laptop layout.
   ========================================================= */

function applySameUIScreenV54(){
  const w = window.innerWidth || document.documentElement.clientWidth;
  const h = window.innerHeight || document.documentElement.clientHeight;

  document.body.classList.toggle('v54-large-screen', w >= 1480);
  document.body.classList.toggle('v54-normal-screen', w < 1480 && w > 900);
  document.body.classList.toggle('v54-narrow-screen', w <= 900);
  document.body.classList.toggle('v54-short-screen', h <= 760);

  const shell = document.getElementById('appShell');
  if(shell) shell.classList.add('app-v54-shell');

  const sidebar = document.querySelector('.sidebar');
  if(sidebar) sidebar.classList.add('sidebar-v54');

  const right = document.querySelector('.right');
  if(right) right.classList.add('right-v54');

  const main = document.querySelector('#mainContent.main, .main');
  if(main) main.classList.add('main-v54');
}

window.addEventListener('resize', applySameUIScreenV54);
window.addEventListener('orientationchange', applySameUIScreenV54);
setInterval(applySameUIScreenV54, 1000);
setTimeout(applySameUIScreenV54, 150);
setTimeout(applySameUIScreenV54, 900);


/* =========================================================
   V55 PIXEL-LOCKED LAYOUT FIX
   JS + CSS force same visual layout on big/small displays.
   ========================================================= */

function setImportantV55(el, prop, value){
  if(!el) return;
  try { el.style.setProperty(prop, value, 'important'); } catch {}
}

function applyPixelLockedLayoutV55(){
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  const compact = vw <= 900;
  const medium = vw > 900 && vw <= 1180;
  const short = vh <= 760;

  document.body.classList.toggle('v55-compact', compact);
  document.body.classList.toggle('v55-medium', medium);
  document.body.classList.toggle('v55-short', short);
  document.body.classList.add('v55-layout-lock');

  const maxStage = 1366;
  const stageW = compact ? vw : Math.min(vw, maxStage);
  const stageLeft = compact ? 0 : Math.max(0, Math.round((vw - stageW) / 2));

  const shell = document.getElementById('appShell');
  const sidebar = document.querySelector('.sidebar');
  const right = document.querySelector('.right');
  const main = document.querySelector('#mainContent.main, .main');

  document.documentElement.style.setProperty('--v55-stage-w', `${stageW}px`);
  document.documentElement.style.setProperty('--v55-stage-left', `${stageLeft}px`);

  if(shell){
    shell.classList.add('app-v55-shell');
    setImportantV55(shell, 'width', compact ? '100%' : `${stageW}px`);
    setImportantV55(shell, 'max-width', compact ? '100%' : `${stageW}px`);
    setImportantV55(shell, 'margin-left', 'auto');
    setImportantV55(shell, 'margin-right', 'auto');
    setImportantV55(shell, 'display', 'block');
    setImportantV55(shell, 'position', 'relative');
    setImportantV55(shell, 'overflow-x', 'hidden');
  }

  if(sidebar){
    sidebar.classList.add('sidebar-v55');

    if(compact){
      setImportantV55(sidebar, 'position', 'sticky');
      setImportantV55(sidebar, 'top', '6px');
      setImportantV55(sidebar, 'left', 'auto');
      setImportantV55(sidebar, 'right', 'auto');
      setImportantV55(sidebar, 'bottom', 'auto');
      setImportantV55(sidebar, 'width', '100%');
      setImportantV55(sidebar, 'max-width', '100%');
      setImportantV55(sidebar, 'height', '56px');
      setImportantV55(sidebar, 'max-height', '56px');
      setImportantV55(sidebar, 'flex-direction', 'row');
      setImportantV55(sidebar, 'overflow-x', 'auto');
      setImportantV55(sidebar, 'overflow-y', 'hidden');
    }else{
      setImportantV55(sidebar, 'position', 'fixed');
      setImportantV55(sidebar, 'top', '12px');
      setImportantV55(sidebar, 'left', `${stageLeft + 12}px`);
      setImportantV55(sidebar, 'right', 'auto');
      setImportantV55(sidebar, 'bottom', '12px');
      setImportantV55(sidebar, 'width', '82px');
      setImportantV55(sidebar, 'max-width', '82px');
      setImportantV55(sidebar, 'height', 'auto');
      setImportantV55(sidebar, 'max-height', 'calc(100vh - 24px)');
      setImportantV55(sidebar, 'flex-direction', 'column');
      setImportantV55(sidebar, 'overflow-x', 'hidden');
      setImportantV55(sidebar, 'overflow-y', 'auto');
    }

    sidebar.querySelectorAll('button,.nav-btn,.side-action,a,[role="button"]').forEach(btn=>{
      btn.classList.add('sidebar-btn-v55');
    });
  }

  if(right){
    right.classList.add('right-v55');

    if(compact || medium){
      setImportantV55(right, 'display', 'none');
    }else{
      setImportantV55(right, 'display', 'flex');
      setImportantV55(right, 'position', 'fixed');
      setImportantV55(right, 'top', '12px');
      setImportantV55(right, 'right', `${stageLeft + 12}px`);
      setImportantV55(right, 'left', 'auto');
      setImportantV55(right, 'bottom', '12px');
      setImportantV55(right, 'width', '82px');
      setImportantV55(right, 'max-width', '82px');
      setImportantV55(right, 'height', 'auto');
      setImportantV55(right, 'max-height', 'calc(100vh - 24px)');
      setImportantV55(right, 'flex-direction', 'column');
      setImportantV55(right, 'overflow-x', 'hidden');
      setImportantV55(right, 'overflow-y', 'auto');
    }
  }

  if(main){
    main.classList.add('main-v55');

    if(compact){
      setImportantV55(main, 'margin-left', '0px');
      setImportantV55(main, 'margin-right', '0px');
      setImportantV55(main, 'width', '100%');
    }else if(medium){
      setImportantV55(main, 'margin-left', '108px');
      setImportantV55(main, 'margin-right', '0px');
      setImportantV55(main, 'width', 'auto');
    }else{
      setImportantV55(main, 'margin-left', '108px');
      setImportantV55(main, 'margin-right', '108px');
      setImportantV55(main, 'width', 'auto');
    }
  }
}

window.addEventListener('resize', applyPixelLockedLayoutV55);
window.addEventListener('orientationchange', applyPixelLockedLayoutV55);
setInterval(applyPixelLockedLayoutV55, 700);
setTimeout(applyPixelLockedLayoutV55, 80);
setTimeout(applyPixelLockedLayoutV55, 500);
setTimeout(applyPixelLockedLayoutV55, 1200);


/* =========================================================
   V56 EQUAL SIDEBAR SPACING + HOVER NAME TOOLTIP
   Fixed spacing on all displays + pop-out names on hover.
   ========================================================= */

const V56_LABELS = {
  home: 'Home',
  explore: 'Explore',
  messages: 'Messages',
  notifications: 'Notifications',
  profile: 'Profile',
  liked: 'Liked Posts',
  saved: 'Saved Posts',
  settings: 'Settings',
  create: 'Create Post'
};

function guessSidebarLabelV56(el){
  const dataView = String(el.getAttribute('data-view') || '').toLowerCase().trim();
  const title = String(el.getAttribute('title') || '').trim();
  const aria = String(el.getAttribute('aria-label') || '').trim();
  const onclick = String(el.getAttribute('onclick') || '').toLowerCase();
  const text = String(el.textContent || '').trim();

  if(dataView && V56_LABELS[dataView]) return V56_LABELS[dataView];
  if(title) return title;
  if(aria) return aria;

  if(onclick.includes('create')) return 'Create Post';
  if(onclick.includes('home')) return 'Home';
  if(onclick.includes('message')) return 'Messages';
  if(onclick.includes('notification')) return 'Notifications';
  if(onclick.includes('profile')) return 'Profile';
  if(onclick.includes('setting')) return 'Settings';

  if(text.includes('+')) return 'Create Post';
  if(text.includes('🏠')) return 'Home';
  if(text.includes('🔥')) return 'Explore';
  if(text.includes('💬')) return 'Messages';
  if(text.includes('🔔')) return 'Notifications';
  if(text.includes('👤')) return 'Profile';
  if(text.includes('💖') || text.includes('❤️')) return 'Liked Posts';
  if(text.includes('🪄') || text.includes('🔖')) return 'Saved Posts';
  if(text.includes('⚙')) return 'Settings';

  return 'Menu';
}

function applySidebarTooltipsV56(){
  const sidebars = document.querySelectorAll('.sidebar, .right');

  sidebars.forEach(sidebar=>{
    sidebar.classList.add('rail-v56');

    const buttons = sidebar.querySelectorAll('button, .nav-btn, .side-action, a, [role="button"]');

    buttons.forEach(btn=>{
      if(btn.closest('.logout') || String(btn.getAttribute('onclick')||'').includes('logout')) return;

      const label = guessSidebarLabelV56(btn);
      btn.classList.add('rail-btn-v56');
      btn.setAttribute('data-tooltip', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);

      const dataView = String(btn.getAttribute('data-view') || '').toLowerCase();
      if(dataView === 'home') btn.style.order = '3';
      if(dataView === 'explore') btn.style.order = '4';
      if(dataView === 'messages') btn.style.order = '5';
      if(dataView === 'notifications') btn.style.order = '6';
      if(dataView === 'profile') btn.style.order = '2';
      if(dataView === 'liked') btn.style.order = '7';
      if(dataView === 'saved') btn.style.order = '8';
      if(dataView === 'settings') btn.style.order = '9';

      const onclick = String(btn.getAttribute('onclick') || '').toLowerCase();
      if(label === 'Create Post' || onclick.includes('create')) btn.style.order = '1';
    });
  });
}

function applyFixedLayoutV56(){
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const compact = vw <= 900;
  const stageW = compact ? vw : Math.min(vw, 1366);
  const stageLeft = compact ? 0 : Math.max(0, Math.round((vw - stageW) / 2));

  document.documentElement.style.setProperty('--v56-stage-w', `${stageW}px`);
  document.documentElement.style.setProperty('--v56-stage-left', `${stageLeft}px`);
  document.body.classList.toggle('v56-compact', compact);
  document.body.classList.add('v56-layout');

  const shell = document.getElementById('appShell');
  if(shell){
    shell.classList.add('app-v56-shell');
    shell.style.setProperty('width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('max-width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('margin-left', 'auto', 'important');
    shell.style.setProperty('margin-right', 'auto', 'important');
  }

  const sidebar = document.querySelector('.sidebar');
  if(sidebar && !compact){
    sidebar.style.setProperty('left', `${stageLeft + 12}px`, 'important');
  }

  const right = document.querySelector('.right');
  if(right && !compact && vw > 1180){
    right.style.setProperty('right', `${stageLeft + 12}px`, 'important');
  }

  applySidebarTooltipsV56();
}

window.addEventListener('resize', applyFixedLayoutV56);
window.addEventListener('orientationchange', applyFixedLayoutV56);
setInterval(applyFixedLayoutV56, 800);
setTimeout(applyFixedLayoutV56, 100);
setTimeout(applyFixedLayoutV56, 700);
setTimeout(applyFixedLayoutV56, 1500);


/* =========================================================
   V57 NO-SCROLL SIDEBAR + REAL TOOLTIP LAYER
   Fits all sidebar icons in screen height and shows labels above grey layer.
   ========================================================= */

const V57_LABELS = {
  home: 'Home',
  explore: 'Explore',
  messages: 'Messages',
  notifications: 'Notifications',
  profile: 'Profile',
  liked: 'Liked Posts',
  saved: 'Saved Posts',
  settings: 'Settings',
  create: 'Create Post'
};

function getRailTooltipV57(){
  let tip = document.getElementById('railTooltipV57');
  if(tip) return tip;

  tip = document.createElement('div');
  tip.id = 'railTooltipV57';
  tip.className = 'rail-tooltip-v57 hidden';
  document.body.appendChild(tip);
  return tip;
}

function guessRailLabelV57(el){
  const dataView = String(el.getAttribute('data-view') || '').toLowerCase().trim();
  const title = String(el.getAttribute('title') || '').trim();
  const aria = String(el.getAttribute('aria-label') || '').trim();
  const onclick = String(el.getAttribute('onclick') || '').toLowerCase();
  const text = String(el.textContent || '').trim();

  if(dataView && V57_LABELS[dataView]) return V57_LABELS[dataView];
  if(title && !title.includes('undefined')) return title;
  if(aria && !aria.includes('undefined')) return aria;

  if(onclick.includes('create')) return 'Create Post';
  if(onclick.includes('home')) return 'Home';
  if(onclick.includes('message')) return 'Messages';
  if(onclick.includes('notification')) return 'Notifications';
  if(onclick.includes('profile')) return 'Profile';
  if(onclick.includes('setting')) return 'Settings';

  if(text.includes('+')) return 'Create Post';
  if(text.includes('🏠')) return 'Home';
  if(text.includes('🔥')) return 'Explore';
  if(text.includes('💬')) return 'Messages';
  if(text.includes('🔔')) return 'Notifications';
  if(text.includes('👤')) return 'Profile';
  if(text.includes('💖') || text.includes('❤️')) return 'Liked Posts';
  if(text.includes('🪄') || text.includes('🔖')) return 'Saved Posts';
  if(text.includes('⚙')) return 'Settings';

  return 'Menu';
}

function fitSidebarIconsV57(){
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) return;

  const compact = window.innerWidth <= 900;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  const logo = compact ? 42 : Math.max(40, Math.min(50, Math.floor(vh * 0.065)));
  const buttons = Array.from(sidebar.querySelectorAll('button,.nav-btn,.side-action,a,[role="button"]'))
    .filter(btn => {
      const txt = String(btn.textContent || '').toLowerCase();
      const onclick = String(btn.getAttribute('onclick') || '').toLowerCase();
      return !txt.includes('logout') && !onclick.includes('logout') && getComputedStyle(btn).display !== 'none';
    });

  if(compact){
    document.documentElement.style.setProperty('--v57-icon', '42px');
    document.documentElement.style.setProperty('--v57-logo', '42px');
    document.documentElement.style.setProperty('--v57-gap', '6px');
    document.body.classList.add('v57-compact');
    return;
  }

  document.body.classList.remove('v57-compact');

  const railHeight = Math.max(420, vh - 24);
  const padding = 20;
  const count = Math.max(1, buttons.length);
  const available = railHeight - padding - logo - 6;
  const preferredGap = 7;
  let icon = Math.floor((available - (count * preferredGap)) / count);

  icon = Math.max(30, Math.min(42, icon));
  let gap = Math.max(3, Math.min(7, Math.floor((available - (icon * count)) / count)));

  document.documentElement.style.setProperty('--v57-icon', `${icon}px`);
  document.documentElement.style.setProperty('--v57-logo', `${logo}px`);
  document.documentElement.style.setProperty('--v57-gap', `${gap}px`);
}

function showRailTooltipV57(el){
  const label = el.getAttribute('data-tooltip') || guessRailLabelV57(el);
  if(!label) return;

  const tip = getRailTooltipV57();
  tip.textContent = label;
  tip.classList.remove('hidden');

  const rect = el.getBoundingClientRect();
  const compact = window.innerWidth <= 900;

  if(compact){
    const left = Math.min(window.innerWidth - 12, Math.max(12, rect.left + rect.width / 2));
    const top = rect.bottom + 10;
    tip.classList.add('compact');
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = 'translateX(-50%)';
  }else{
    tip.classList.remove('compact');
    const left = rect.right + 14;
    const maxTop = window.innerHeight - 48;
    const top = Math.min(maxTop, Math.max(12, rect.top + rect.height / 2));
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = 'translateY(-50%)';
  }
}

function hideRailTooltipV57(){
  const tip = getRailTooltipV57();
  tip.classList.add('hidden');
}

function applySidebarV57(){
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) return;

  sidebar.classList.add('sidebar-v57');

  const items = sidebar.querySelectorAll('button,.nav-btn,.side-action,a,[role="button"]');

  items.forEach(btn => {
    if(String(btn.getAttribute('onclick') || '').toLowerCase().includes('logout')) return;

    const label = guessRailLabelV57(btn);
    btn.classList.add('rail-btn-v57');
    btn.setAttribute('data-tooltip', label);
    btn.setAttribute('aria-label', label);
    btn.removeAttribute('title'); // browser native title conflicts with custom tooltip

    if(!btn.__v57TooltipBound){
      btn.addEventListener('mouseenter', () => showRailTooltipV57(btn));
      btn.addEventListener('mousemove', () => showRailTooltipV57(btn));
      btn.addEventListener('mouseleave', hideRailTooltipV57);
      btn.addEventListener('focus', () => showRailTooltipV57(btn));
      btn.addEventListener('blur', hideRailTooltipV57);
      btn.__v57TooltipBound = true;
    }

    const view = String(btn.getAttribute('data-view') || '').toLowerCase();
    const onclick = String(btn.getAttribute('onclick') || '').toLowerCase();

    if(label === 'Create Post' || onclick.includes('create')) btn.style.order = '1';
    else if(view === 'profile') btn.style.order = '2';
    else if(view === 'home') btn.style.order = '3';
    else if(view === 'explore') btn.style.order = '4';
    else if(view === 'messages') btn.style.order = '5';
    else if(view === 'notifications') btn.style.order = '6';
    else if(view === 'liked') btn.style.order = '7';
    else if(view === 'saved') btn.style.order = '8';
    else if(view === 'settings') btn.style.order = '9';
  });

  fitSidebarIconsV57();
}

function applyLayoutV57(){
  const compact = window.innerWidth <= 900;
  const stageW = compact ? window.innerWidth : Math.min(window.innerWidth, 1366);
  const stageLeft = compact ? 0 : Math.max(0, Math.round((window.innerWidth - stageW) / 2));

  document.documentElement.style.setProperty('--v57-stage-w', `${stageW}px`);
  document.documentElement.style.setProperty('--v57-stage-left', `${stageLeft}px`);
  document.body.classList.add('v57-layout');
  document.body.classList.toggle('v57-compact', compact);

  const shell = document.getElementById('appShell');
  if(shell){
    shell.classList.add('app-v57-shell');
    shell.style.setProperty('width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('max-width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('margin-left', 'auto', 'important');
    shell.style.setProperty('margin-right', 'auto', 'important');
  }

  const sidebar = document.querySelector('.sidebar');
  if(sidebar && !compact){
    sidebar.style.setProperty('left', `${stageLeft + 12}px`, 'important');
  }

  const right = document.querySelector('.right');
  if(right && !compact && window.innerWidth > 1180){
    right.style.setProperty('right', `${stageLeft + 12}px`, 'important');
  }

  applySidebarV57();
}

window.addEventListener('resize', applyLayoutV57);
window.addEventListener('orientationchange', applyLayoutV57);
window.addEventListener('scroll', hideRailTooltipV57, true);
setInterval(applyLayoutV57, 700);
setTimeout(applyLayoutV57, 80);
setTimeout(applyLayoutV57, 500);
setTimeout(applyLayoutV57, 1200);


/* =========================================================
   V58 SCALED SIDEBAR NO-SCROLL LOCK
   Professional fix:
   - the whole sidebar content scales as ONE unit
   - same visual spacing/proportion on every screen
   - no vertical scrolling on laptop/monitor heights
   - real tooltip layer remains above everything
   ========================================================= */

const V58_LABELS = {
  home: 'Home',
  explore: 'Explore',
  messages: 'Messages',
  notifications: 'Notifications',
  profile: 'Profile',
  liked: 'Liked Posts',
  saved: 'Saved Posts',
  settings: 'Settings',
  create: 'Create Post'
};

function getTooltipV58(){
  let tip = document.getElementById('railTooltipV58') || document.getElementById('railTooltipV57');
  if(tip) {
    tip.id = 'railTooltipV58';
    tip.className = 'rail-tooltip-v58 hidden';
    return tip;
  }

  tip = document.createElement('div');
  tip.id = 'railTooltipV58';
  tip.className = 'rail-tooltip-v58 hidden';
  document.body.appendChild(tip);
  return tip;
}

function guessLabelV58(el){
  const dataView = String(el.getAttribute('data-view') || '').toLowerCase().trim();
  const onclick = String(el.getAttribute('onclick') || '').toLowerCase();
  const aria = String(el.getAttribute('aria-label') || '').trim();
  const text = String(el.textContent || '').trim();

  if(dataView && V58_LABELS[dataView]) return V58_LABELS[dataView];
  if(aria && !aria.includes('undefined')) return aria;

  if(onclick.includes('create')) return 'Create Post';
  if(onclick.includes('home')) return 'Home';
  if(onclick.includes('message')) return 'Messages';
  if(onclick.includes('notification')) return 'Notifications';
  if(onclick.includes('profile')) return 'Profile';
  if(onclick.includes('setting')) return 'Settings';

  if(text.includes('+')) return 'Create Post';
  if(text.includes('🏠')) return 'Home';
  if(text.includes('🔥')) return 'Explore';
  if(text.includes('💬')) return 'Messages';
  if(text.includes('🔔')) return 'Notifications';
  if(text.includes('👤')) return 'Profile';
  if(text.includes('💖') || text.includes('❤️')) return 'Liked Posts';
  if(text.includes('🪄') || text.includes('🔖')) return 'Saved Posts';
  if(text.includes('⚙')) return 'Settings';

  return 'Menu';
}

function showTooltipV58(el){
  const label = el.getAttribute('data-tooltip') || guessLabelV58(el);
  if(!label) return;

  const tip = getTooltipV58();
  tip.textContent = label;
  tip.classList.remove('hidden');

  const rect = el.getBoundingClientRect();
  const compact = window.innerWidth <= 900;

  if(compact){
    const left = Math.min(window.innerWidth - 16, Math.max(16, rect.left + rect.width / 2));
    const top = rect.bottom + 10;
    tip.classList.add('compact');
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = 'translateX(-50%)';
  }else{
    tip.classList.remove('compact');
    const left = rect.right + 14;
    const top = Math.min(window.innerHeight - 46, Math.max(14, rect.top + rect.height / 2));
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.transform = 'translateY(-50%)';
  }
}

function hideTooltipV58(){
  getTooltipV58().classList.add('hidden');
}

function ensureSidebarInnerV58(){
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) return null;

  sidebar.classList.add('sidebar-v58');

  let inner = sidebar.querySelector(':scope > .sidebar-inner-v58');
  if(!inner){
    inner = document.createElement('div');
    inner.className = 'sidebar-inner-v58';

    const children = Array.from(sidebar.children);
    children.forEach(child => {
      if(child.id === 'railTooltipV58' || child.id === 'railTooltipV57') return;
      inner.appendChild(child);
    });

    sidebar.appendChild(inner);
  }

  return inner;
}

function prepareSidebarButtonsV58(){
  const inner = ensureSidebarInnerV58();
  if(!inner) return [];

  const buttons = Array.from(inner.querySelectorAll('button,.nav-btn,.side-action,a,[role="button"]'));

  buttons.forEach(btn => {
    const onclick = String(btn.getAttribute('onclick') || '').toLowerCase();
    const label = guessLabelV58(btn);

    if(onclick.includes('logout')) {
      btn.classList.add('hidden-from-rail-v58');
      return;
    }

    btn.classList.add('rail-btn-v58');
    btn.setAttribute('data-tooltip', label);
    btn.setAttribute('aria-label', label);
    btn.removeAttribute('title');

    if(!btn.__v58Bound){
      btn.addEventListener('mouseenter', () => showTooltipV58(btn));
      btn.addEventListener('mousemove', () => showTooltipV58(btn));
      btn.addEventListener('mouseleave', hideTooltipV58);
      btn.addEventListener('focus', () => showTooltipV58(btn));
      btn.addEventListener('blur', hideTooltipV58);
      btn.__v58Bound = true;
    }

    const view = String(btn.getAttribute('data-view') || '').toLowerCase();

    if(label === 'Create Post' || onclick.includes('create')) btn.style.order = '1';
    else if(view === 'profile') btn.style.order = '2';
    else if(view === 'home') btn.style.order = '3';
    else if(view === 'explore') btn.style.order = '4';
    else if(view === 'messages') btn.style.order = '5';
    else if(view === 'notifications') btn.style.order = '6';
    else if(view === 'liked') btn.style.order = '7';
    else if(view === 'saved') btn.style.order = '8';
    else if(view === 'settings') btn.style.order = '9';
  });

  return buttons.filter(btn => !btn.classList.contains('hidden-from-rail-v58'));
}

function lockSidebarScaleV58(){
  const sidebar = document.querySelector('.sidebar');
  const inner = ensureSidebarInnerV58();
  if(!sidebar || !inner) return;

  const compact = window.innerWidth <= 900;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  if(compact){
    document.body.classList.add('v58-compact');
    sidebar.style.setProperty('overflow-x', 'auto', 'important');
    sidebar.style.setProperty('overflow-y', 'hidden', 'important');
    inner.style.setProperty('transform', 'none', 'important');
    inner.style.setProperty('zoom', '1', 'important');
    inner.style.setProperty('height', 'auto', 'important');
    return;
  }

  document.body.classList.remove('v58-compact');

  // Reset first to measure natural sidebar design height.
  inner.style.setProperty('zoom', '1', 'important');
  inner.style.setProperty('transform', 'none', 'important');

  const available = Math.max(380, vh - 24 - 20);
  const natural = Math.max(1, inner.scrollHeight);

  // Scale entire sidebar content together, preserving spacing/design.
  let scale = Math.min(1, available / natural);

  // Do not make it unreadably tiny; if really small, it still fits most laptop heights.
  scale = Math.max(0.68, Math.min(1, scale));

  inner.style.setProperty('zoom', String(scale), 'important');
  inner.style.setProperty('transform-origin', 'top center', 'important');

  sidebar.style.setProperty('overflow', 'visible', 'important');
}

function lockStageV58(){
  const compact = window.innerWidth <= 900;
  const stageW = compact ? window.innerWidth : Math.min(window.innerWidth, 1366);
  const stageLeft = compact ? 0 : Math.max(0, Math.round((window.innerWidth - stageW) / 2));

  document.documentElement.style.setProperty('--v58-stage-w', `${stageW}px`);
  document.documentElement.style.setProperty('--v58-stage-left', `${stageLeft}px`);
  document.body.classList.add('v58-layout');
  document.body.classList.toggle('v58-compact', compact);

  const shell = document.getElementById('appShell');
  if(shell){
    shell.classList.add('app-v58-shell');
    shell.style.setProperty('width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('max-width', compact ? '100%' : `${stageW}px`, 'important');
    shell.style.setProperty('margin-left', 'auto', 'important');
    shell.style.setProperty('margin-right', 'auto', 'important');
  }

  const sidebar = document.querySelector('.sidebar');
  if(sidebar && !compact){
    sidebar.style.setProperty('left', `${stageLeft + 12}px`, 'important');
  }

  const right = document.querySelector('.right');
  if(right && !compact && window.innerWidth > 1180){
    right.style.setProperty('right', `${stageLeft + 12}px`, 'important');
  }
}

function applySidebarLockV58(){
  lockStageV58();
  prepareSidebarButtonsV58();
  lockSidebarScaleV58();
}

window.addEventListener('resize', applySidebarLockV58);
window.addEventListener('orientationchange', applySidebarLockV58);
window.addEventListener('scroll', hideTooltipV58, true);
setInterval(applySidebarLockV58, 600);
setTimeout(applySidebarLockV58, 50);
setTimeout(applySidebarLockV58, 400);
setTimeout(applySidebarLockV58, 1000);


/* =========================================================
   V63 V59 SEARCH ONLY PROGRAM
   Adds only the V59-style universal search.
   No sidebar/right-panel/mobile layout code included.
   ========================================================= */

let searchTimerV63 = null;
let searchCacheUsersV63 = [];

function normalizeSearchV63(value=''){
  return String(value || '').toLowerCase().trim();
}

function escapeSearchV63(value=''){
  if (typeof escapeHTML === 'function') return escapeHTML(value);
  return String(value || '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}

function renderTopbar(){
  return `
    <div class="topbar search-only-topbar-v63">
      <div class="search-shell-v63">
        <span class="search-icon-v63">⌕</span>
        <input
          id="globalSearchInputV63"
          class="global-search-v63"
          type="search"
          placeholder="Search profiles, posts, captions, photos, videos, audio..."
          autocomplete="off"
          spellcheck="false"
          oninput="handleGlobalSearchInputV63(this.value)"
          onkeydown="handleGlobalSearchKeyV63(event)"
          onfocus="showSearchIfHasTextV63()"
        >
        <button class="search-submit-v63" onclick="runGlobalSearchV63()">Search</button>
        <div id="searchResultsV63" class="search-results-v63 hidden"></div>
      </div>
    </div>
  `;
}

async function getSearchUsersV63(){
  const map = new Map();

  try{
    (feedPosts || []).forEach(post=>{
      const author = post.author || {};
      if(author.username) map.set(normalizeSearchV63(author.username), author);
    });
  }catch{}

  try{
    const data = await apiFetch(`${API.users}/suggestions/list`);
    (data.users || []).forEach(user=>{
      if(user.username) map.set(normalizeSearchV63(user.username), user);
    });
  }catch(error){
    console.warn('Search suggestions fallback:', error);
  }

  searchCacheUsersV63 = Array.from(map.values());
  return searchCacheUsersV63;
}

function postMatchesSearchV63(post, query){
  const author = post.author || {};
  const media = Array.isArray(post.media) ? post.media : [];

  const mediaText = media.map(item => {
    const type = item.type || '';
    const name = item.name || item.filename || '';
    const url = item.url || '';
    let kind = '';

    if(String(type).includes('image')) kind += ' photo image picture pic';
    if(String(type).includes('video')) kind += ' video reel clip';
    if(String(type).includes('audio')) kind += ' audio voice music sound';

    return `${type} ${name} ${url} ${kind}`;
  }).join(' ');

  const haystack = normalizeSearchV63([
    post.content || '',
    post.caption || '',
    post.mood || '',
    post.visibility || '',
    author.username || '',
    author.displayName || '',
    mediaText
  ].join(' '));

  return haystack.includes(query);
}

function userMatchesSearchV63(user, query){
  return normalizeSearchV63([
    user.displayName || '',
    user.username || '',
    user.bio || '',
    user.avatar || ''
  ].join(' ')).includes(query);
}

function getPostKindV63(post){
  const media = Array.isArray(post.media) ? post.media : [];

  if(media.some(item => String(item.type || '').includes('image'))) return ['🖼️', 'Photo post'];
  if(media.some(item => String(item.type || '').includes('video'))) return ['🎬', 'Video post'];
  if(media.some(item => String(item.type || '').includes('audio'))) return ['🎧', 'Audio post'];

  return ['📝', post.mood || 'Post'];
}

async function buildSearchResultsV63(queryText){
  const query = normalizeSearchV63(queryText);

  if(!query){
    return { users: [], posts: [] };
  }

  const users = (await getSearchUsersV63())
    .filter(user => userMatchesSearchV63(user, query))
    .slice(0, 6);

  const posts = (feedPosts || [])
    .filter(post => postMatchesSearchV63(post, query))
    .slice(0, 8);

  return { users, posts };
}

function renderSearchResultsV63(results, queryText){
  const box = document.getElementById('searchResultsV63');
  if(!box) return;

  const query = normalizeSearchV63(queryText);

  if(!query){
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }

  const users = results.users || [];
  const posts = results.posts || [];

  box.classList.remove('hidden');

  if(!users.length && !posts.length){
    box.innerHTML = `
      <div class="search-empty-v63">
        No results found. Try username, caption, photo, video, audio, or post words.
      </div>
    `;
    return;
  }

  const userHtml = users.length ? `
    <div class="search-section-v63">
      <strong>Profiles</strong>
      ${users.map(user=>`
        <button class="search-result-v63" onclick="openSearchProfileV63('${escapeSearchV63(user.username || '')}')">
          <div class="avatar sm">
            ${typeof renderAvatarHTML === 'function'
              ? renderAvatarHTML(user.avatar || '👤','👤')
              : escapeSearchV63(user.avatar || '👤')}
          </div>
          <div>
            <b>${escapeSearchV63(user.displayName || user.username || 'User')}</b>
            <span>@${escapeSearchV63(user.username || 'user')}</span>
          </div>
        </button>
      `).join('')}
    </div>
  ` : '';

  const postHtml = posts.length ? `
    <div class="search-section-v63">
      <strong>Posts / Media</strong>
      ${posts.map(post=>{
        const [icon, label] = getPostKindV63(post);
        return `
          <button class="search-result-v63" onclick="openSearchPostV63('${escapeSearchV63(post._id || '')}')">
            <div class="search-post-icon-v63">${icon}</div>
            <div>
              <b>${escapeSearchV63(label)}</b>
              <span>${escapeSearchV63((post.content || post.caption || 'Open post').slice(0, 90))}</span>
            </div>
          </button>
        `;
      }).join('')}
    </div>
  ` : '';

  box.innerHTML = userHtml + postHtml;
}

async function handleGlobalSearchInputV63(value){
  clearTimeout(searchTimerV63);

  searchTimerV63 = setTimeout(async ()=>{
    const input = document.getElementById('globalSearchInputV63');
    const latestValue = input ? input.value : value;

    const results = await buildSearchResultsV63(latestValue);
    renderSearchResultsV63(results, latestValue);

    // This is the important focus fix.
    if(input && document.activeElement !== input){
      input.focus();
      const cursor = input.value.length;
      try{ input.setSelectionRange(cursor, cursor); }catch{}
    }
  }, 120);
}

function handleGlobalSearchKeyV63(event){
  if(event.key === 'Enter'){
    event.preventDefault();
    runGlobalSearchV63();
  }

  if(event.key === 'Escape'){
    const box = document.getElementById('searchResultsV63');
    if(box) box.classList.add('hidden');
  }
}

async function runGlobalSearchV63(){
  const input = document.getElementById('globalSearchInputV63');
  if(!input) return;

  const results = await buildSearchResultsV63(input.value);
  renderSearchResultsV63(results, input.value);

  input.focus();
  const cursor = input.value.length;
  try{ input.setSelectionRange(cursor, cursor); }catch{}
}

function showSearchIfHasTextV63(){
  const input = document.getElementById('globalSearchInputV63');
  const box = document.getElementById('searchResultsV63');

  if(input && box && input.value.trim()){
    runGlobalSearchV63();
  }
}

function openSearchProfileV63(username){
  const box = document.getElementById('searchResultsV63');
  if(box) box.classList.add('hidden');

  if(typeof openAccountProfile === 'function'){
    openAccountProfile(username);
  }else if(typeof renderAccountProfile === 'function'){
    renderAccountProfile(username);
  }
}

function openSearchPostV63(postId){
  const box = document.getElementById('searchResultsV63');
  if(box) box.classList.add('hidden');

  const post = (feedPosts || []).find(item => String(item._id) === String(postId));

  if(!post){
    if(typeof toast === 'function') toast('Post not found');
    return;
  }

  activeView = 'search-post';
  document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));

  const main = document.getElementById('mainContent') || document.querySelector('.main');
  if(!main) return;

  main.innerHTML = `
    ${renderTopbar()}
    <section class="settings-panel card">
      <div class="settings-panel-head">
        <div>
          <h2>Search Result</h2>
          <p>Matched post from @${escapeSearchV63(post.author?.username || 'user')}</p>
        </div>
        <button class="primary-action secondary" onclick="switchView('home')">Back Home</button>
      </div>
      <div id="feedList" class="feed"></div>
    </section>
  `;

  if(typeof renderFeedList === 'function'){
    renderFeedList([post]);
  }
}

document.addEventListener('click', function(event){
  const shell = event.target.closest('.search-shell-v63');
  const box = document.getElementById('searchResultsV63');

  if(!shell && box){
    box.classList.add('hidden');
  }
});

// Replace already-visible old topbar only; do not touch layout.
function upgradeVisibleTopbarV63(){
  const oldTopbar = document.querySelector('.topbar');
  if(!oldTopbar || oldTopbar.classList.contains('search-only-topbar-v63')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderTopbar().trim();
  oldTopbar.replaceWith(wrapper.firstElementChild);
}

setTimeout(upgradeVisibleTopbarV63, 200);
setTimeout(upgradeVisibleTopbarV63, 900);
setTimeout(upgradeVisibleTopbarV63, 1600);


/* =========================================================
   V79 PREMIUM RIGHT DASHBOARD
   Only adds/rebuilds the right-hand dashboard.
   Does not touch search or left sidebar.
   ========================================================= */

(function(){
  let rightOpenV79 = false;

  function safeV79(value=''){
    if(typeof escapeHTML === 'function') return escapeHTML(value);
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function countV79(value){
    return Array.isArray(value) ? value.length : 0;
  }

  function getStatsV79(){
    const user = window.currentUserData || {};
    const posts = Array.isArray(window.feedPosts) ? window.feedPosts : [];
    const myPosts = posts.filter(p => p.author?.username === user.username);

    return {
      user,
      posts,
      totalPosts: posts.length,
      myPosts: myPosts.length,
      followers: countV79(user.followers),
      following: countV79(user.following)
    };
  }

  function badgeTextV79(id){
    const badge = document.getElementById(id);
    if(!badge || badge.classList.contains('hidden')) return '0';
    return String(badge.textContent || '0').trim() || '0';
  }

  function quickSearchV79(term){
    const input =
      document.getElementById('globalSearchInputV63') ||
      document.getElementById('globalSearchInputV59') ||
      document.querySelector('.global-search-v63') ||
      document.querySelector('.global-search-v59') ||
      document.querySelector('.topbar input');

    if(input){
      input.value = term;
      input.focus();
      input.dispatchEvent(new Event('input', {bubbles:true}));

      if(typeof runGlobalSearchV63 === 'function') runGlobalSearchV63();
      if(typeof runGlobalSearchV59 === 'function') runGlobalSearchV59();
    }else if(typeof toast === 'function'){
      toast(`Search: ${term}`);
    }
  }

  window.quickSearchV79 = quickSearchV79;

  function panelActionV79(view){
    rightOpenV79 = false;
    const right = document.querySelector('.right-v79');
    if(right) right.classList.remove('open');

    if(typeof switchView === 'function') switchView(view);
  }

  window.panelActionV79 = panelActionV79;

  function renderRightDashboardV79(){
    let right = document.getElementById('rightPanel') || document.querySelector('.right');

    if(!right){
      right = document.createElement('aside');
      right.id = 'rightPanel';
      document.body.appendChild(right);
    }

    const {user, totalPosts, myPosts, followers, following} = getStatsV79();
    const messageBadge = badgeTextV79('messageBadge');
    const notificationBadge = badgeTextV79('notificationBadge');

    right.className = 'right right-v79';
    right.innerHTML = `
      <button class="right-orb-v79" onclick="toggleRightPanelV79()" title="Dashboard">
        <span class="orb-icon-v79">☰</span>
        <b class="orb-dot-v79"></b>
      </button>

      <section class="right-panel-v79">
        <div class="right-user-v79">
          <div class="avatar right-avatar-v79">
            ${typeof renderAvatarHTML === 'function'
              ? renderAvatarHTML(user.avatar || '🔥','🔥')
              : safeV79(user.avatar || '🔥')}
          </div>
          <div>
            <p>Signed in as</p>
            <h3>${safeV79(user.displayName || user.username || 'User')}</h3>
            <span>@${safeV79(user.username || 'user')}</span>
          </div>
        </div>

        <div class="right-grid-v79">
          <article>
            <strong>${totalPosts}</strong>
            <span>Total Posts</span>
          </article>
          <article>
            <strong>${myPosts}</strong>
            <span>Your Posts</span>
          </article>
          <article>
            <strong>${followers}</strong>
            <span>Followers</span>
          </article>
          <article>
            <strong>${following}</strong>
            <span>Following</span>
          </article>
        </div>

        <div class="right-alerts-v79">
          <button onclick="panelActionV79('messages')">
            <span>💬 Messages</span>
            <b>${safeV79(messageBadge)}</b>
          </button>
          <button onclick="panelActionV79('notifications')">
            <span>🔔 Notifications</span>
            <b>${safeV79(notificationBadge)}</b>
          </button>
        </div>

        <div class="right-actions-v79">
          <button onclick="panelActionV79('home')">🏠 Home</button>
          <button onclick="panelActionV79('profile')">👤 Profile</button>
          <button onclick="panelActionV79('saved')">🔖 Saved</button>
          <button onclick="panelActionV79('settings')">⚙️ Settings</button>
        </div>

        <div class="right-trends-v79">
          <div class="right-head-v79">
            <h3>Quick Search</h3>
            <span>Explore</span>
          </div>
          <button onclick="quickSearchV79('AI')">#AI</button>
          <button onclick="quickSearchV79('coding')">#coding</button>
          <button onclick="quickSearchV79('project')">#project</button>
          <button onclick="quickSearchV79('photo')">#photo</button>
          <button onclick="quickSearchV79('video')">#video</button>
          <button onclick="quickSearchV79('audio')">#audio</button>
        </div>
      </section>
    `;
  }

  window.toggleRightPanelV79 = function(){
    rightOpenV79 = !rightOpenV79;
    const right = document.querySelector('.right-v79');
    if(right) right.classList.toggle('open', rightOpenV79);
  };

  function placeRightPanelV79(){
    const right = document.querySelector('.right-v79');
    if(!right) return;

    const vw = window.innerWidth || document.documentElement.clientWidth;
    const stageW = Math.min(vw, 1366);
    const stageLeft = Math.max(0, Math.round((vw - stageW) / 2));

    if(vw <= 1180){
      right.style.display = 'none';
      return;
    }

    right.style.display = 'block';
    right.style.right = `${stageLeft + 18}px`;
  }

  function updateV79(){
    renderRightDashboardV79();
    placeRightPanelV79();
  }

  window.addEventListener('resize', placeRightPanelV79);
  window.addEventListener('orientationchange', placeRightPanelV79);

  /* V84 disabled V79 refresh loop: setInterval(updateV79, 2500); */
  setTimeout(updateV79, 120);
  setTimeout(updateV79, 800);
  setTimeout(updateV79, 1600);
})();


/* =========================================================
   V80 RIGHT DASHBOARD LAYER FIX
   Keeps V79 dashboard, but moves it above the app layer.
   ========================================================= */

(function(){
  function liftRightDashboardV80(){
    const right = document.getElementById('rightPanel') || document.querySelector('.right-v79') || document.querySelector('.right');

    if(!right) return;

    if(right.parentElement !== document.body){
      document.body.appendChild(right);
    }

    right.classList.add('right-v80-layer');
  }

  setInterval(liftRightDashboardV80, 700);
  setTimeout(liftRightDashboardV80, 80);
  setTimeout(liftRightDashboardV80, 500);
  setTimeout(liftRightDashboardV80, 1400);
})();


/* =========================================================
   V81 BODY FLOATING RIGHT DASHBOARD
   Real fix: creates the right dashboard directly on body,
   separate from appShell/rightPanel, so no bluish/white layer
   can cover it.
   ========================================================= */

(function(){
  let openV81 = false;

  function escV81(value=''){
    if(typeof escapeHTML === 'function') return escapeHTML(value);
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function countV81(value){
    return Array.isArray(value) ? value.length : 0;
  }

  function badgeV81(id){
    const el = document.getElementById(id);
    if(!el || el.classList.contains('hidden')) return '0';
    return String(el.textContent || '0').trim() || '0';
  }

  function statsV81(){
    const user = window.currentUserData || {};
    const posts = Array.isArray(window.feedPosts) ? window.feedPosts : [];
    const myPosts = posts.filter(p => p.author?.username === user.username);

    return {
      user,
      totalPosts: posts.length,
      myPosts: myPosts.length,
      followers: countV81(user.followers),
      following: countV81(user.following),
      messages: badgeV81('messageBadge'),
      notifications: badgeV81('notificationBadge')
    };
  }

  function quickSearchV81(term){
    const input =
      document.getElementById('globalSearchInputV63') ||
      document.querySelector('.global-search-v63') ||
      document.querySelector('.topbar input');

    if(input){
      input.value = term;
      input.focus();
      input.dispatchEvent(new Event('input', {bubbles:true}));
      if(typeof runGlobalSearchV63 === 'function') runGlobalSearchV63();
    }
  }

  window.quickSearchV81 = quickSearchV81;

  window.goRightV81 = function(view){
    openV81 = false;
    const root = document.getElementById('bodyRightDashboardV81');
    if(root) root.classList.remove('open');

    if(typeof switchView === 'function') switchView(view);
  };

  window.toggleRightV81 = function(){
    openV81 = !openV81;
    const root = document.getElementById('bodyRightDashboardV81');
    if(root) root.classList.toggle('open', openV81);
  };

  function renderV81(){
    let root = document.getElementById('bodyRightDashboardV81');

    if(!root){
      root = document.createElement('div');
      root.id = 'bodyRightDashboardV81';
      root.className = 'body-right-dashboard-v81';
      document.body.appendChild(root);
    }

    const s = statsV81();

    root.innerHTML = `
      <button class="body-right-orb-v81" onclick="toggleRightV81()" title="Dashboard">
        <span>📊</span>
        <i></i>
      </button>

      <section class="body-right-panel-v81">
        <div class="body-right-user-v81">
          <div class="avatar body-right-avatar-v81">
            ${typeof renderAvatarHTML === 'function'
              ? renderAvatarHTML(s.user.avatar || '🔥','🔥')
              : escV81(s.user.avatar || '🔥')}
          </div>
          <div>
            <p>Signed in as</p>
            <h3>${escV81(s.user.displayName || s.user.username || 'User')}</h3>
            <span>@${escV81(s.user.username || 'user')}</span>
          </div>
        </div>

        <div class="body-right-stats-v81">
          <article><b>${s.totalPosts}</b><span>Total Posts</span></article>
          <article><b>${s.myPosts}</b><span>Your Posts</span></article>
          <article><b>${s.followers}</b><span>Followers</span></article>
          <article><b>${s.following}</b><span>Following</span></article>
        </div>

        <div class="body-right-alerts-v81">
          <button onclick="goRightV81('messages')"><span>💬 Messages</span><b>${escV81(s.messages)}</b></button>
          <button onclick="goRightV81('notifications')"><span>🔔 Notifications</span><b>${escV81(s.notifications)}</b></button>
        </div>

        <div class="body-right-actions-v81">
          <button onclick="goRightV81('home')">🏠 Home</button>
          <button onclick="goRightV81('profile')">👤 Profile</button>
          <button onclick="goRightV81('saved')">🔖 Saved</button>
          <button onclick="goRightV81('settings')">⚙️ Settings</button>
        </div>

        <div class="body-right-trends-v81">
          <h3>Quick Search</h3>
          <button onclick="quickSearchV81('AI')">#AI</button>
          <button onclick="quickSearchV81('coding')">#coding</button>
          <button onclick="quickSearchV81('project')">#project</button>
          <button onclick="quickSearchV81('photo')">#photo</button>
          <button onclick="quickSearchV81('video')">#video</button>
          <button onclick="quickSearchV81('audio')">#audio</button>
        </div>
      </section>
    `;

    root.classList.toggle('open', openV81);

    // Hide the old rightPanel so it does not create extra strips/layers.
    const oldRight = document.getElementById('rightPanel');
    if(oldRight) oldRight.style.setProperty('display', 'none', 'important');

    const oldRightClass = document.querySelector('.right:not(#bodyRightDashboardV81)');
    if(oldRightClass) oldRightClass.style.setProperty('display', 'none', 'important');
  }

  /* V84 disabled auto-refresh loop: setInterval(renderV81, 1200); */
  setTimeout(renderV81, 80);
  /* V84 disabled duplicate render: setTimeout(renderV81, 500); */
  /* V84 disabled duplicate render: setTimeout(renderV81, 1400); */
})();


/* =========================================================
   V82 RIGHT DASHBOARD STICKY HOVER FIX
   Keeps right dashboard open while moving cursor to it
   and while scrolling/working inside it.
   ========================================================= */

(function(){
  let closeTimerV82 = null;

  function bindRightDashboardV82(){
    const root = document.getElementById('bodyRightDashboardV81');
    if(!root || root.__v82Bound) return;

    root.__v82Bound = true;

    const keepOpen = () => {
      clearTimeout(closeTimerV82);
      root.classList.add('hover-lock-v82');
    };

    const softClose = () => {
      clearTimeout(closeTimerV82);
      closeTimerV82 = setTimeout(() => {
        root.classList.remove('hover-lock-v82');
      }, 650);
    };

    root.addEventListener('mouseenter', keepOpen);
    root.addEventListener('mouseleave', softClose);

    root.addEventListener('mouseover', keepOpen);
    root.addEventListener('focusin', keepOpen);

    const panel = root.querySelector('.body-right-panel-v81');
    if(panel){
      panel.addEventListener('mouseenter', keepOpen);
      panel.addEventListener('mousemove', keepOpen);
      panel.addEventListener('scroll', keepOpen, {passive:true});
      panel.addEventListener('mouseleave', softClose);
    }
  }

  setInterval(bindRightDashboardV82, 500);
  setTimeout(bindRightDashboardV82, 100);
  setTimeout(bindRightDashboardV82, 700);
  setTimeout(bindRightDashboardV82, 1500);
})();


/* =========================================================
   V84 RIGHT DASHBOARD NO-REFRESH FIX
   Stops dashboard from rebuilding/blinking while user scrolls.
   Keeps V82 working design and hover behavior.
   ========================================================= */

(function(){
  let lastRightRefreshV84 = 0;
  let userUsingPanelV84 = false;

  function rootV84(){
    return document.getElementById('bodyRightDashboardV81');
  }

  function panelV84(){
    return rootV84()?.querySelector('.body-right-panel-v81');
  }

  function isUsingPanelV84(){
    const root = rootV84();
    const panel = panelV84();
    if(!root || !panel) return false;

    return (
      userUsingPanelV84 ||
      root.matches(':hover') ||
      panel.matches(':hover') ||
      root.classList.contains('open') ||
      root.classList.contains('hover-lock-v82') ||
      document.activeElement && panel.contains(document.activeElement)
    );
  }

  function bindStablePanelV84(){
    const root = rootV84();
    const panel = panelV84();

    if(!root || !panel || root.__v84Bound) return;
    root.__v84Bound = true;

    const startUse = () => { userUsingPanelV84 = true; };
    const stopUse = () => {
      setTimeout(() => {
        const r = rootV84();
        const p = panelV84();
        if(!r || !p) {
          userUsingPanelV84 = false;
          return;
        }

        if(!r.matches(':hover') && !p.matches(':hover') && !r.classList.contains('open')){
          userUsingPanelV84 = false;
        }
      }, 900);
    };

    root.addEventListener('mouseenter', startUse);
    root.addEventListener('mousemove', startUse);
    root.addEventListener('mouseleave', stopUse);
    root.addEventListener('focusin', startUse);
    root.addEventListener('focusout', stopUse);

    panel.addEventListener('mouseenter', startUse);
    panel.addEventListener('mousemove', startUse);
    panel.addEventListener('scroll', startUse, {passive:true});
    panel.addEventListener('wheel', startUse, {passive:true});
    panel.addEventListener('mouseleave', stopUse);
  }

  // Override the old renderV81 with a guarded version if it exists.
  // This prevents repeated rebuild while the panel is open or being scrolled.
  function patchRenderV84(){
    if(typeof window.renderV81 === 'function' && !window.renderV81.__v84Patched){
      const original = window.renderV81;

      const guarded = function(){
        const now = Date.now();

        if(isUsingPanelV84()){
          bindStablePanelV84();
          return;
        }

        // Do not allow frequent redraws even when closed.
        if(now - lastRightRefreshV84 < 15000){
          bindStablePanelV84();
          return;
        }

        lastRightRefreshV84 = now;
        return original.apply(this, arguments);
      };

      guarded.__v84Patched = true;
      window.renderV81 = guarded;
    }
  }

  function applyNoBlinkClassV84(){
    const root = rootV84();
    if(root) root.classList.add('no-blink-v84');
    bindStablePanelV84();
    patchRenderV84();
  }

  setInterval(applyNoBlinkClassV84, 800);
  setTimeout(applyNoBlinkClassV84, 100);
  setTimeout(applyNoBlinkClassV84, 700);
  setTimeout(applyNoBlinkClassV84, 1600);
})();


/* =========================================================
   V87 RIGHT DASHBOARD PROFILE + ROTATING VIEWS
   Safe patch on top of V86/V84.
   Runs only after login/app mode.
   Does not touch auth/login/search/left sidebar.
   ========================================================= */

(function(){
  let v87ViewMode = 0;
  let v87LastProfileSync = 0;
  let v87LastSignature = '';
  let v87PanelScroll = 0;

  function isLoggedInV87(){
    const appShell = document.getElementById('appShell');
    const authScreen = document.getElementById('authScreen');
    return (
      appShell &&
      !appShell.classList.contains('hidden') &&
      document.body.classList.contains('app-mode') &&
      typeof currentUserData !== 'undefined' &&
      currentUserData &&
      currentUserData.username
    );
  }

  function escV87(value=''){
    if(typeof escapeHTML === 'function') return escapeHTML(value);
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function arrCountV87(value){
    if(Array.isArray(value)) return value.length;
    if(typeof value === 'number') return value;
    return 0;
  }

  async function syncProfileV87(){
    if(!isLoggedInV87()) return null;

    const now = Date.now();
    if(now - v87LastProfileSync < 12000) return currentUserData;
    v87LastProfileSync = now;

    const username = currentUserData.username;

    // This is safe: every request is optional and falls back silently.
    try{
      if(typeof apiFetch === 'function' && typeof API !== 'undefined'){
        const tries = [];

        if(API.users && username){
          tries.push(`${API.users}/${encodeURIComponent(username)}`);
          tries.push(`${API.users}/profile/${encodeURIComponent(username)}`);
          tries.push(`${API.users}/me`);
        }

        if(API.auth){
          tries.push(`${API.auth}/me`);
        }

        for(const url of tries){
          try{
            const data = await apiFetch(url);
            const user = data?.user || data?.profile || data?.data || data;
            if(user && user.username){
              Object.assign(currentUserData, user);
              if(typeof updateSidebarProfile === 'function'){
                try{ updateSidebarProfile(); }catch{}
              }
              return currentUserData;
            }
          }catch{}
        }
      }
    }catch(error){
      console.warn('V87 profile sync fallback:', error);
    }

    return currentUserData;
  }

  function myPostsV87(){
    if(typeof feedPosts === 'undefined' || !Array.isArray(feedPosts) || !isLoggedInV87()) return [];
    const myId = String(currentUserData._id || currentUserData.id || '');
    const myUsername = currentUserData.username;

    return feedPosts.filter(post => {
      const author = post.author || {};
      return (
        author.username === myUsername ||
        String(author._id || author.id || author) === myId
      );
    });
  }

  function computeViewsV87(myPosts){
    // Until backend has real view tracking, estimate views from real activity signals.
    const followers = arrCountV87(currentUserData.followers) || Number(currentUserData.followersCount || currentUserData.followerCount || 0);
    const following = arrCountV87(currentUserData.following) || Number(currentUserData.followingCount || 0);
    const postCount = myPosts.length || Number(currentUserData.postsCount || currentUserData.postCount || 0);

    const likes = myPosts.reduce((sum, post) => sum + arrCountV87(post.likes) + Number(post.likesCount || 0), 0);
    const comments = myPosts.reduce((sum, post) => sum + arrCountV87(post.comments) + Number(post.commentsCount || 0), 0);
    const saves = myPosts.reduce((sum, post) => sum + arrCountV87(post.savedBy) + Number(post.savedCount || 0), 0);

    const today = Math.max(0, Math.round((followers * 3) + (postCount * 9) + (likes * 2) + (comments * 4) + saves));
    const week = Math.max(today, Math.round((today * 4.2) + (following * 2) + (postCount * 11)));
    const month = Math.max(week, Math.round((week * 3.1) + (followers * 8) + (likes * 3)));

    return {today, week, month, likes, comments, saves};
  }

  function getDashboardDataV87(){
    if(!isLoggedInV87()) return null;

    const posts = myPostsV87();
    const followers = arrCountV87(currentUserData.followers) || Number(currentUserData.followersCount || currentUserData.followerCount || 0);
    const following = arrCountV87(currentUserData.following) || Number(currentUserData.followingCount || 0);
    const yourPosts = posts.length || Number(currentUserData.postsCount || currentUserData.postCount || 0);
    const views = computeViewsV87(posts);

    return {
      user: currentUserData,
      yourPosts,
      followers,
      following,
      views
    };
  }

  function metricV87(data){
    const list = [
      {label:'Total Views Today', value:data.views.today, sub:'live 10 sec pulse'},
      {label:'Total Views This Week', value:data.views.week, sub:'weekly reach signal'},
      {label:'Total Views This Month', value:data.views.month, sub:'monthly profile reach'}
    ];

    return list[v87ViewMode % list.length];
  }

  function signatureV87(data){
    return [
      data.user.username,
      data.user.displayName,
      data.user.avatar,
      data.yourPosts,
      data.followers,
      data.following,
      data.views.today,
      data.views.week,
      data.views.month,
      v87ViewMode
    ].join('|');
  }

  function renderV87(force=false){
    if(!isLoggedInV87()) return;

    const root = document.getElementById('bodyRightDashboardV81');
    if(!root) return;

    const oldPanel = root.querySelector('.body-right-panel-v81');
    if(oldPanel) v87PanelScroll = oldPanel.scrollTop || 0;

    const data = getDashboardDataV87();
    if(!data) return;

    const sig = signatureV87(data);
    if(!force && sig === v87LastSignature) return;
    v87LastSignature = sig;

    const metric = metricV87(data);

    root.classList.add('v87-profile-views-dashboard');

    const orb = root.querySelector('.body-right-orb-v81');
    const orbHtml = orb ? orb.outerHTML : `
      <button class="body-right-orb-v81" onclick="toggleRightV81 && toggleRightV81()" title="Dashboard">
        <span>📊</span><i></i>
      </button>
    `;

    root.innerHTML = `
      ${orbHtml}
      <section class="body-right-panel-v81 v87-panel">
        <div class="body-right-user-v81 v87-profile-card">
          <div class="avatar body-right-avatar-v81">
            ${typeof renderAvatarHTML === 'function'
              ? renderAvatarHTML(data.user.avatar || '🔥','🔥')
              : escV87(data.user.avatar || '🔥')}
          </div>
          <div>
            <p>Backend synced profile</p>
            <h3>${escV87(data.user.displayName || data.user.username || 'User')}</h3>
            <span>@${escV87(data.user.username || 'user')}</span>
          </div>
        </div>

        <div class="v87-profile-stats">
          <article><b>${data.yourPosts}</b><span>Your Posts</span></article>
          <article><b>${data.followers}</b><span>Followers</span></article>
          <article><b>${data.following}</b><span>Following</span></article>
          <article class="v87-view-card">
            <b id="v87ViewValue">${metric.value}</b>
            <span id="v87ViewLabel">${metric.label}</span>
            <small id="v87ViewSub">${metric.sub}</small>
          </article>
        </div>
      </section>
    `;

    const panel = root.querySelector('.body-right-panel-v81');
    if(panel) panel.scrollTop = v87PanelScroll;
  }

  function rotateViewsV87(){
    if(!isLoggedInV87()) return;

    v87ViewMode++;

    const data = getDashboardDataV87();
    if(!data) return;

    const metric = metricV87(data);

    const value = document.getElementById('v87ViewValue');
    const label = document.getElementById('v87ViewLabel');
    const sub = document.getElementById('v87ViewSub');

    if(value && label && sub){
      value.classList.remove('v87-flip');
      void value.offsetWidth;
      value.textContent = metric.value;
      label.textContent = metric.label;
      sub.textContent = metric.sub;
      value.classList.add('v87-flip');
    }else{
      renderV87(true);
    }
  }

  async function updateV87(){
    if(!isLoggedInV87()) return;

    const root = document.getElementById('bodyRightDashboardV81');
    const panel = root?.querySelector('.body-right-panel-v81');
    const isUsing = root && (
      root.matches(':hover') ||
      root.classList.contains('open') ||
      root.classList.contains('hover-lock-v82') ||
      (panel && panel.matches(':hover'))
    );

    // Do not re-render while user is using it. Only rotate metric text.
    if(isUsing) return;

    await syncProfileV87();
    renderV87(false);
  }

  setInterval(rotateViewsV87, 5000);
  setInterval(updateV87, 15000);
  setTimeout(async()=>{ await syncProfileV87(); renderV87(true); }, 800);
  setTimeout(async()=>{ await syncProfileV87(); renderV87(true); }, 2500);
  setTimeout(async()=>{ await syncProfileV87(); renderV87(true); }, 5000);
})();


/* =========================================================
   V97 CLIPS SAFE FIX
   Safe Clips feature:
   - no repeated refresh loop
   - no aggressive switchView override
   - create post button untouched
   - clips opens only on click
   ========================================================= */

(function(){
  function hasVideoPostV97(post){
    const media = Array.isArray(post.media) ? post.media : [];

    return media.some(item => {
      const type = String(item.type || '').toLowerCase();
      const url = String(item.url || item.src || item.path || '').toLowerCase();
      const name = String(item.name || item.filename || '').toLowerCase();

      return (
        type.includes('video') ||
        url.endsWith('.mp4') ||
        url.endsWith('.webm') ||
        url.endsWith('.mov') ||
        name.endsWith('.mp4') ||
        name.endsWith('.webm') ||
        name.endsWith('.mov')
      );
    });
  }

  function getClipPostsV97(){
    if(typeof feedPosts === 'undefined' || !Array.isArray(feedPosts)) return [];
    return feedPosts.filter(hasVideoPostV97);
  }

  window.openClipsV97 = function(){
    window.activeView = 'clips';

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === 'clips');
    });

    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return;

    const clips = getClipPostsV97();

    main.innerHTML = `
      ${typeof renderTopbar === 'function' ? renderTopbar() : ''}
      <section class="clips-page-v97">
        <div class="clips-hero-v97 card">
          <div>
            <p>reConnect Clips</p>
            <h1>Clips</h1>
            <span>Only short video posts from people on reConnect.</span>
          </div>
          <button onclick="switchView('home')">Back Home</button>
        </div>

        <div class="clips-stats-v97">
          <article>
            <b>${clips.length}</b>
            <span>Total Clips</span>
          </article>
          <article>
            <b>Video</b>
            <span>Only Feed</span>
          </article>
        </div>

        <div id="clipsFeedV97" class="clips-feed-v97"></div>
      </section>
    `;

    const holder = document.getElementById('clipsFeedV97');

    if(!clips.length){
      holder.innerHTML = `
        <div class="clips-empty-v97 card">
          <h2>No clips yet</h2>
          <p>When someone posts a video, it will appear here automatically.</p>
        </div>
      `;
      return;
    }

    // Use existing renderer safely.
    if(typeof renderFeedList === 'function'){
      holder.innerHTML = `<div id="feedList" class="feed clips-feed-list-v97"></div>`;
      renderFeedList(clips);
      return;
    }

    holder.innerHTML = clips.map(post => {
      const author = post.author || {};
      const media = Array.isArray(post.media) ? post.media : [];
      const video = media.find(hasVideoItemV97) || media[0] || {};

      return `
        <article class="clip-card-v97 card">
          <div class="clip-author-v97">
            <div class="avatar sm">${author.avatar || '👤'}</div>
            <div>
              <b>${author.displayName || author.username || 'User'}</b>
              <span>@${author.username || 'user'}</span>
            </div>
          </div>
          <video controls src="${video.url || video.src || ''}"></video>
          <p>${post.content || post.caption || ''}</p>
        </article>
      `;
    }).join('');
  };

  function hasVideoItemV97(item){
    const type = String(item.type || '').toLowerCase();
    const url = String(item.url || item.src || item.path || '').toLowerCase();
    const name = String(item.name || item.filename || '').toLowerCase();

    return (
      type.includes('video') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      name.endsWith('.mp4') ||
      name.endsWith('.webm') ||
      name.endsWith('.mov')
    );
  }

  function addClipsButtonV97(){
    const nav = document.querySelector('.sidebar .nav');
    if(!nav) return;

    if(nav.querySelector('.clips-nav-v97')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-btn clips-nav-v97';
    btn.dataset.view = 'clips';
    btn.setAttribute('aria-label', 'Clips');
    btn.setAttribute('title', 'Clips');

    btn.innerHTML = `
      <span class="nav-icon">🎬</span>
      <span class="nav-label">Clips</span>
    `;

    btn.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      window.openClipsV97();
    });

    // Insert after Home without touching create/post button.
    const home = nav.querySelector('.nav-btn[data-view="home"]');
    if(home && home.nextElementSibling){
      nav.insertBefore(btn, home.nextElementSibling);
    }else if(home){
      nav.appendChild(btn);
    }else{
      nav.appendChild(btn);
    }
  }

  // Only add button a few times after login/render. No clips auto-render loop.
  setTimeout(addClipsButtonV97, 500);
  setTimeout(addClipsButtonV97, 1500);
  setTimeout(addClipsButtonV97, 3500);

  // If sidebar re-renders later, add the button again, but do not open Clips.
  setInterval(addClipsButtonV97, 5000);
})();


/* =========================================================
   V98 RESTORE CREATE POST BUTTON
   Safe script-only fix:
   - Create Post button no longer appears/acts like Home
   - Clicking it opens Home and focuses composer
   - Clips button moved after Create Post
   - No login/search/right dashboard changes
   ========================================================= */

(function(){
  function findCreateButtonV98(){
    const selectors = [
      '.post-shortcut',
      '.nav-post-shortcut-v49',
      '.sidebar button[title="Create Post"]',
      '.sidebar button[aria-label="Create Post"]'
    ];

    for(const selector of selectors){
      const btn = document.querySelector(selector);
      if(btn) return btn;
    }

    return Array.from(document.querySelectorAll('.sidebar button')).find(btn => {
      const txt = String(btn.textContent || '').trim();
      const title = String(btn.getAttribute('title') || '').toLowerCase();
      return txt.includes('＋') || txt.includes('+') || title.includes('create');
    });
  }

  function restoreCreatePostButtonV98(){
    const btn = findCreateButtonV98();
    if(!btn) return;

    btn.classList.add('post-shortcut', 'nav-post-shortcut-v49', 'create-post-fixed-v98');
    btn.dataset.view = 'create';
    btn.setAttribute('title', 'Create Post');
    btn.setAttribute('aria-label', 'Create Post');
    btn.setAttribute('data-tooltip', 'Create Post');
    btn.setAttribute('data-final-tooltip', 'Create Post');

    // Keep visible label correct for any tooltip system.
    const label = btn.querySelector('.nav-label');
    if(label) label.textContent = 'Create Post';

    const icon = btn.querySelector('.nav-icon');
    if(icon && !icon.textContent.trim()) icon.textContent = '＋';

    // Replace broken old inline behavior safely.
    btn.onclick = function(event){
      event.preventDefault();
      event.stopPropagation();

      document.querySelectorAll('.nav-btn,.post-shortcut').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const focusLater = () => {
        if(typeof focusComposer === 'function'){
          focusComposer();
        }else{
          const box = document.getElementById('postText');
          if(box) box.focus();
        }
      };

      if(typeof switchView === 'function'){
        switchView('home');
        setTimeout(focusLater, 220);
      }else{
        focusLater();
      }
    };

    // Move Clips after Create Post, so Create stays directly below profile/logo area.
    const clips = document.querySelector('.clips-nav-v97');
    if(clips && clips.parentElement === btn.parentElement){
      if(btn.nextSibling !== clips){
        btn.parentElement.insertBefore(clips, btn.nextSibling);
      }
    }
  }

  // Patch any tooltip label resolver indirectly by keeping data-view=create.
  function keepCreateButtonStableV98(){
    restoreCreatePostButtonV98();

    const clips = document.querySelector('.clips-nav-v97');
    if(clips){
      clips.dataset.view = 'clips';
      clips.setAttribute('title', 'Clips');
      clips.setAttribute('aria-label', 'Clips');
      clips.setAttribute('data-tooltip', 'Clips');
      clips.setAttribute('data-final-tooltip', 'Clips');
    }
  }

  setInterval(keepCreateButtonStableV98, 1200);
  setTimeout(keepCreateButtonStableV98, 100);
  setTimeout(keepCreateButtonStableV98, 600);
  setTimeout(keepCreateButtonStableV98, 1600);
  setTimeout(keepCreateButtonStableV98, 3500);
})();


/* =========================================================
   V99 CREATE POST / CLIP MENU FIX
   Safe:
   - restores Create button as a real create action
   - opens menu: Post or Clip
   - Clip uses video upload and sends file to composer
   - does not touch login/search/right dashboard
   ========================================================= */

(function(){
  function createMenuRootV99(){
    let root = document.getElementById('createMenuV99');

    if(!root){
      root = document.createElement('div');
      root.id = 'createMenuV99';
      root.className = 'create-menu-v99 hidden';
      document.body.appendChild(root);
    }

    return root;
  }

  function closeCreateMenuV99(){
    const root = document.getElementById('createMenuV99');
    if(root) root.classList.add('hidden');
  }

  window.closeCreateMenuV99 = closeCreateMenuV99;

  function openHomeComposerV99(){
    closeCreateMenuV99();

    const after = () => {
      const box = document.getElementById('postText');
      if(box){
        box.focus();
        box.scrollIntoView({behavior:'smooth', block:'center'});
      }
    };

    if(typeof switchView === 'function'){
      switchView('home');
      setTimeout(after, 220);
      setTimeout(after, 550);
    }else{
      after();
    }
  }

  window.openHomeComposerV99 = openHomeComposerV99;

  function openClipComposerV99(){
    closeCreateMenuV99();

    // Create a temporary video-only picker. This avoids needing to click the original
    // picker after async page navigation.
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'video/*';
    picker.multiple = false;
    picker.style.position = 'fixed';
    picker.style.left = '-9999px';
    picker.style.top = '-9999px';
    document.body.appendChild(picker);

    picker.onchange = function(){
      const files = picker.files;

      const afterHome = () => {
        const box = document.getElementById('postText');

        if(box){
          box.focus();
          box.placeholder = 'Write a caption for your clip...';
          box.scrollIntoView({behavior:'smooth', block:'center'});
        }

        if(files && files.length && typeof handlePostMediaFiles === 'function'){
          handlePostMediaFiles(files);
          if(typeof setMood === 'function') setMood('Life Update');
          if(typeof toast === 'function') toast('Clip added to composer');
        }

        setTimeout(() => {
          try{ picker.remove(); }catch{}
        }, 500);
      };

      if(typeof switchView === 'function'){
        switchView('home');
        setTimeout(afterHome, 260);
        setTimeout(afterHome, 650);
      }else{
        afterHome();
      }
    };

    picker.oncancel = function(){
      try{ picker.remove(); }catch{}
    };

    picker.click();
  }

  window.openClipComposerV99 = openClipComposerV99;

  function openCreateMenuV99(anchor){
    const root = createMenuRootV99();
    const rect = anchor?.getBoundingClientRect?.();

    root.innerHTML = `
      <div class="create-menu-card-v99">
        <button onclick="openHomeComposerV99()">
          <span>✍️</span>
          <div>
            <b>Create Post</b>
            <small>Text, photo, audio, or mixed media</small>
          </div>
        </button>

        <button onclick="openClipComposerV99()">
          <span>🎬</span>
          <div>
            <b>Create Clip</b>
            <small>Upload short video to Clips</small>
          </div>
        </button>
      </div>
    `;

    root.classList.remove('hidden');

    if(rect){
      const compact = window.innerWidth <= 900;

      if(compact){
        root.style.left = '12px';
        root.style.right = '12px';
        root.style.top = `${Math.min(window.innerHeight - 190, rect.bottom + 10)}px`;
        root.style.transform = 'none';
      }else{
        root.style.left = `${rect.right + 14}px`;
        root.style.right = 'auto';
        root.style.top = `${Math.max(14, Math.min(window.innerHeight - 190, rect.top))}px`;
        root.style.transform = 'none';
      }
    }
  }

  window.openCreateMenuV99 = openCreateMenuV99;

  function findCreateButtonV99(){
    const candidates = [
      '.post-shortcut',
      '.nav-post-shortcut-v49',
      '.create-post-fixed-v98',
      '.sidebar button[title="Create Post"]',
      '.sidebar button[aria-label="Create Post"]'
    ];

    for(const selector of candidates){
      const btn = document.querySelector(selector);
      if(btn) return btn;
    }

    return Array.from(document.querySelectorAll('.sidebar button')).find(btn => {
      const text = String(btn.textContent || '').trim();
      const title = String(btn.getAttribute('title') || '').toLowerCase();
      return text.includes('+') || text.includes('＋') || title.includes('create');
    });
  }

  function patchCreateButtonV99(){
    const btn = findCreateButtonV99();
    if(!btn || btn.__v99CreatePatched) return;

    btn.__v99CreatePatched = true;
    btn.classList.add('post-shortcut', 'nav-post-shortcut-v49', 'create-post-fixed-v99');
    btn.dataset.view = 'create';
    btn.setAttribute('title', 'Create Post');
    btn.setAttribute('aria-label', 'Create Post');
    btn.setAttribute('data-tooltip', 'Create Post');
    btn.setAttribute('data-final-tooltip', 'Create Post');

    const label = btn.querySelector('.nav-label');
    if(label) label.textContent = 'Create Post';

    const icon = btn.querySelector('.nav-icon');
    if(icon) icon.textContent = '＋';

    btn.onclick = function(event){
      event.preventDefault();
      event.stopPropagation();

      document.querySelectorAll('.nav-btn,.post-shortcut').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      openCreateMenuV99(btn);
    };

    // Put Clips after Create, never before/over Create.
    const clips = document.querySelector('.clips-nav-v97');
    if(clips && clips.parentElement === btn.parentElement){
      btn.parentElement.insertBefore(clips, btn.nextSibling);
    }
  }

  document.addEventListener('click', function(event){
    const menu = document.getElementById('createMenuV99');
    if(!menu || menu.classList.contains('hidden')) return;

    const clickedMenu = event.target.closest('#createMenuV99');
    const clickedCreate = event.target.closest('.create-post-fixed-v99,.post-shortcut,.nav-post-shortcut-v49');

    if(!clickedMenu && !clickedCreate){
      closeCreateMenuV99();
    }
  });

  function stableCreatePatchV99(){
    patchCreateButtonV99();

    // If old V98 reassigns onclick, force menu behavior back.
    const btn = findCreateButtonV99();
    if(btn && !btn.classList.contains('create-post-fixed-v99')){
      btn.__v99CreatePatched = false;
      patchCreateButtonV99();
    }
  }

  setInterval(stableCreatePatchV99, 1000);
  setTimeout(stableCreatePatchV99, 100);
  setTimeout(stableCreatePatchV99, 700);
  setTimeout(stableCreatePatchV99, 1800);
  setTimeout(stableCreatePatchV99, 3500);
})();


/* =========================================================
   V101 CUSTOM CATEGORY PLUS BUTTON
   Direct replacement safe update:
   - Adds + button beside Thought / Build Mode / Study / Startup / Life Update / Question
   - User can create custom content categories
   - Saves categories in localStorage
   - Selecting custom category works like normal chips
   - Does not touch login/search/right dashboard
   ========================================================= */

(function(){
  const STORAGE_KEY = 'reconnect_custom_categories_v101';

  function cleanCategoryV101(value=''){
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 24);
  }

  function getCategoriesV101(){
    try{
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if(!Array.isArray(data)) return [];
      return data.map(cleanCategoryV101).filter(Boolean);
    }catch{
      return [];
    }
  }

  function saveCategoryV101(name){
    name = cleanCategoryV101(name);
    if(!name) return;

    const list = getCategoriesV101();
    const exists = list.some(item => item.toLowerCase() === name.toLowerCase());

    if(!exists){
      list.push(name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
    }
  }

  function findContentChipRowV101(){
    const knownLabels = ['Thought', 'Build Mode', 'Study', 'Startup', 'Life Update', 'Question'];

    const chips = Array.from(document.querySelectorAll('.mood-chip, button'));
    const matched = chips.filter(btn => {
      const text = String(btn.textContent || '').trim();
      return knownLabels.includes(text);
    });

    if(matched.length >= 3){
      return matched[0].parentElement;
    }

    const activeMood = document.querySelector('.mood-chip.active, .mood-chip');
    return activeMood ? activeMood.parentElement : null;
  }

  function selectCategoryV101(name, button){
    name = cleanCategoryV101(name);
    if(!name) return;

    if(typeof setMood === 'function'){
      try{
        setMood(name, button);
      }catch{
        fallbackSelectV101(name, button);
      }
    }else{
      fallbackSelectV101(name, button);
    }

    const postText = document.getElementById('postText');
    if(postText){
      postText.placeholder = `Share your ${name.toLowerCase()}...`;
    }
  }

  function fallbackSelectV101(name, button){
    document.querySelectorAll('.mood-chip').forEach(chip => chip.classList.remove('active'));
    if(button) button.classList.add('active');
    window.selectedMood = name;
    window.currentMood = name;
  }

  function makeCategoryChipV101(name){
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'mood-chip custom-category-chip-v101';
    chip.dataset.mood = name;
    chip.textContent = name;

    chip.addEventListener('click', function(event){
      event.preventDefault();
      selectCategoryV101(name, chip);
    });

    return chip;
  }

  function ensurePopupV101(){
    let popup = document.getElementById('categoryPopupV101');

    if(!popup){
      popup = document.createElement('div');
      popup.id = 'categoryPopupV101';
      popup.className = 'category-popup-v101 hidden';
      document.body.appendChild(popup);
    }

    popup.innerHTML = `
      <div class="category-card-v101">
        <div class="category-card-head-v101">
          <span>＋</span>
          <div>
            <p>Custom content type</p>
            <h3>Add category</h3>
          </div>
        </div>

        <input
          id="categoryInputV101"
          type="text"
          maxlength="24"
          placeholder="Example: Travel, Fitness, Business"
        >

        <div class="category-actions-v101">
          <button type="button" class="category-cancel-v101" onclick="closeCategoryPopupV101()">Cancel</button>
          <button type="button" class="category-save-v101" onclick="saveCategoryFromPopupV101()">Add</button>
        </div>
      </div>
    `;

    return popup;
  }

  window.closeCategoryPopupV101 = function(){
    const popup = document.getElementById('categoryPopupV101');
    if(popup) popup.classList.add('hidden');
  };

  window.saveCategoryFromPopupV101 = function(){
    const input = document.getElementById('categoryInputV101');
    const name = cleanCategoryV101(input ? input.value : '');

    if(!name){
      if(typeof toast === 'function') toast('Enter a category name');
      return;
    }

    saveCategoryV101(name);
    window.closeCategoryPopupV101();
    injectPlusButtonV101();

    const chip = Array.from(document.querySelectorAll('.mood-chip')).find(btn => {
      const text = String(btn.dataset.mood || btn.textContent || '').trim().toLowerCase();
      return text === name.toLowerCase();
    });

    selectCategoryV101(name, chip);

    if(typeof toast === 'function') toast(`${name} category added`);
  };

  function openPopupV101(anchor){
    const popup = ensurePopupV101();
    popup.classList.remove('hidden');

    const rect = anchor?.getBoundingClientRect?.();
    if(rect){
      const width = 330;
      const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left));
      popup.style.left = `${left}px`;
      popup.style.top = `${rect.bottom + 10}px`;
    }else{
      popup.style.left = '50%';
      popup.style.top = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
    }

    setTimeout(() => {
      const input = document.getElementById('categoryInputV101');
      if(input) input.focus();
    }, 40);
  }

  function injectPlusButtonV101(){
    const row = findContentChipRowV101();
    if(!row) return;

    row.classList.add('content-type-row-v101');

    const plusOld = row.querySelector('.add-category-chip-v101');
    if(plusOld) plusOld.remove();

    // Add saved custom categories before the plus button.
    getCategoriesV101().forEach(name => {
      const exists = Array.from(row.querySelectorAll('.mood-chip')).some(btn => {
        const text = String(btn.dataset.mood || btn.textContent || '').trim().toLowerCase();
        return text === name.toLowerCase();
      });

      if(!exists){
        row.appendChild(makeCategoryChipV101(name));
      }
    });

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'mood-chip add-category-chip-v101';
    plus.setAttribute('title', 'Add custom category');
    plus.setAttribute('aria-label', 'Add custom category');
    plus.innerHTML = '<span>＋</span>';

    plus.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      openPopupV101(plus);
    });

    row.appendChild(plus);
  }

  function relabelVideosToClipsV101(){
    // Lightweight safe naming: only changes exact UI labels, not user captions.
    const main = document.getElementById('mainContent') || document.body;
    const elements = main.querySelectorAll('button, span, small, b, strong');

    elements.forEach(el => {
      if(el.closest('textarea,input')) return;

      const text = String(el.textContent || '').trim().toLowerCase();

      if(text === 'video') el.textContent = 'Clip';
      if(text === 'videos') el.textContent = 'Clips';
      if(text === 'video supported') el.textContent = 'Clips supported';
      if(text === 'video post') el.textContent = 'Clip';
      if(text === 'total videos') el.textContent = 'Total Clips';
    });
  }

  document.addEventListener('click', function(event){
    const popup = document.getElementById('categoryPopupV101');
    if(!popup || popup.classList.contains('hidden')) return;

    const clickedPopup = event.target.closest('#categoryPopupV101');
    const clickedPlus = event.target.closest('.add-category-chip-v101');

    if(!clickedPopup && !clickedPlus){
      popup.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
      window.closeCategoryPopupV101();
    }

    if(event.key === 'Enter' && document.activeElement?.id === 'categoryInputV101'){
      event.preventDefault();
      window.saveCategoryFromPopupV101();
    }
  });

  function runV101(){
    injectPlusButtonV101();
    relabelVideosToClipsV101();
  }

  setInterval(runV101, 1600);
  setTimeout(runV101, 300);
  setTimeout(runV101, 1200);
  setTimeout(runV101, 3000);
})();


/* =========================================================
   V102 CENTER CATEGORY POPUP
   Safe add-on:
   - Popup button text becomes "Add to Post & Apply"
   - Keeps same save/apply logic from V101
   ========================================================= */

(function(){
  function polishCategoryPopupV102(){
    const popup = document.getElementById('categoryPopupV101');
    if(!popup) return;

    const saveBtn = popup.querySelector('.category-save-v101');
    if(saveBtn) saveBtn.textContent = 'Add to Post & Apply';

    const input = popup.querySelector('#categoryInputV101');
    if(input) input.placeholder = 'Example: Travel, Fitness, Business';
  }

  setInterval(polishCategoryPopupV102, 500);
  setTimeout(polishCategoryPopupV102, 100);
  setTimeout(polishCategoryPopupV102, 700);
})();


/* =========================================================
   V103 ONE-TIME CUSTOM CATEGORY
   Update:
   - Custom category applies only to current post
   - Custom category is NOT saved as option
   - Removes old saved custom category chips
   - Fixed default options stay only
   ========================================================= */

(function(){
  const DEFAULT_CATEGORIES_V103 = [
    'Thought',
    'Build Mode',
    'Study',
    'Startup',
    'Life Update',
    'Question'
  ];

  function cleanV103(value=''){
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 24);
  }

  function clearStoredCustomCategoriesV103(){
    try{
      localStorage.removeItem('reconnect_custom_categories_v101');
      localStorage.removeItem('reconnect_custom_content_types_v100');
    }catch{}
  }

  function isDefaultCategoryV103(text){
    return DEFAULT_CATEGORIES_V103.some(item => item.toLowerCase() === text.toLowerCase());
  }

  function findCategoryRowV103(){
    const chips = Array.from(document.querySelectorAll('.mood-chip'));
    const defaultChip = chips.find(chip => isDefaultCategoryV103(cleanV103(chip.textContent || chip.dataset.mood || '')));
    return defaultChip ? defaultChip.parentElement : null;
  }

  function removeCustomOptionChipsV103(){
    clearStoredCustomCategoriesV103();

    const row = findCategoryRowV103();
    if(!row) return;

    Array.from(row.querySelectorAll('.mood-chip')).forEach(chip => {
      const text = cleanV103(chip.textContent || chip.dataset.mood || '');

      const isPlus =
        chip.classList.contains('add-category-chip-v101') ||
        chip.classList.contains('add-type-chip-v100') ||
        text === '+' ||
        text === '＋';

      if(isPlus) return;

      if(!isDefaultCategoryV103(text)){
        chip.remove();
      }
    });
  }

  function applyOneTimeCategoryV103(name){
    name = cleanV103(name);
    if(!name) return;

    // Deselect fixed chips because this custom category is only for this post.
    document.querySelectorAll('.mood-chip').forEach(chip => chip.classList.remove('active'));

    window.selectedMood = name;
    window.currentMood = name;
    window.oneTimePostCategoryV103 = name;

    if(typeof setMood === 'function'){
      try{
        setMood(name, null);
      }catch{}
    }

    const postText = document.getElementById('postText');
    if(postText){
      postText.placeholder = `Share your ${name.toLowerCase()}...`;
      postText.focus();
    }

    showOneTimeCategoryBadgeV103(name);
  }

  function showOneTimeCategoryBadgeV103(name){
    const row = findCategoryRowV103();
    if(!row) return;

    let badge = row.querySelector('.one-time-category-badge-v103');

    if(!badge){
      badge = document.createElement('span');
      badge.className = 'one-time-category-badge-v103';
      row.appendChild(badge);
    }

    badge.innerHTML = `
      <b>${name}</b>
      <small>applied to this post only</small>
      <button type="button" onclick="clearOneTimeCategoryV103()">×</button>
    `;
  }

  window.clearOneTimeCategoryV103 = function(){
    window.oneTimePostCategoryV103 = '';
    window.selectedMood = 'Thought';
    window.currentMood = 'Thought';

    const badge = document.querySelector('.one-time-category-badge-v103');
    if(badge) badge.remove();

    const thought = Array.from(document.querySelectorAll('.mood-chip')).find(chip => {
      return cleanV103(chip.textContent || chip.dataset.mood || '').toLowerCase() === 'thought';
    });

    if(thought){
      document.querySelectorAll('.mood-chip').forEach(chip => chip.classList.remove('active'));
      thought.classList.add('active');
    }
  };

  // Override V101 popup save behavior.
  window.saveCategoryFromPopupV101 = function(){
    const input = document.getElementById('categoryInputV101');
    const name = cleanV103(input ? input.value : '');

    if(!name){
      if(typeof toast === 'function') toast('Enter a category name');
      return;
    }

    if(typeof closeCategoryPopupV101 === 'function'){
      closeCategoryPopupV101();
    }else{
      const popup = document.getElementById('categoryPopupV101');
      if(popup) popup.classList.add('hidden');
    }

    removeCustomOptionChipsV103();
    applyOneTimeCategoryV103(name);

    if(typeof toast === 'function') toast(`${name} applied to this post only`);
  };

  // Also patch popup button text.
  function polishPopupV103(){
    const saveBtn = document.querySelector('.category-save-v101');
    if(saveBtn) saveBtn.textContent = 'Apply to This Post';

    const input = document.getElementById('categoryInputV101');
    if(input) input.placeholder = 'Example: Travel, Fitness, Business';
  }

  // If a post is published, remove one-time badge after a short delay.
  function patchPublishCleanupV103(){
    const publishButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
      const t = String(btn.textContent || '').toLowerCase();
      return t.includes('publish post') || t.includes('post') || t.includes('share');
    });

    publishButtons.forEach(btn => {
      if(btn.__v103CleanupBound) return;
      btn.__v103CleanupBound = true;

      btn.addEventListener('click', function(){
        setTimeout(() => {
          const badge = document.querySelector('.one-time-category-badge-v103');
          if(badge) badge.remove();
          window.oneTimePostCategoryV103 = '';
          removeCustomOptionChipsV103();
        }, 900);
      });
    });
  }

  function runV103(){
    removeCustomOptionChipsV103();
    polishPopupV103();
    patchPublishCleanupV103();
  }

  setInterval(runV103, 1200);
  setTimeout(runV103, 200);
  setTimeout(runV103, 900);
  setTimeout(runV103, 2200);
})();


/* =========================================================
   V107 FORCE POST CATEGORY BOX
   Stronger fix:
   - creates a new independent Post Category box
   - hides old category/mood chips by force
   - does not rely on old chip-row structure
   - selected category becomes the only visible item
   ========================================================= */

(function(){
  const PRESETS_V107 = ['Thought', 'Build Mode', 'Study', 'Startup', 'Life Update', 'Question'];
  let selectedV107 = 'Startup';
  let openV107 = true;

  function cleanV107(value=''){
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 24);
  }

  function isPresetV107(value){
    const v = cleanV107(value).toLowerCase();
    return PRESETS_V107.some(item => item.toLowerCase() === v);
  }

  function getComposerV107(){
    return (
      document.getElementById('postText') ||
      document.querySelector('textarea[placeholder*="Share"]') ||
      document.querySelector('textarea')
    );
  }

  function getComposerCardV107(){
    const text = getComposerV107();
    if(!text) return null;

    return (
      text.closest('.composer') ||
      text.closest('.post-composer') ||
      text.closest('.create-post') ||
      text.closest('.card') ||
      text.closest('section') ||
      text.parentElement
    );
  }

  function findOldCategoryRowsV107(){
    const allButtons = Array.from(document.querySelectorAll('button'));
    const rows = new Set();

    allButtons.forEach(btn => {
      const txt = cleanV107(btn.dataset.mood || btn.textContent || '');
      if(isPresetV107(txt)){
        const row = btn.parentElement;
        if(row) rows.add(row);
      }
    });

    return Array.from(rows);
  }

  function hideOldCategoryRowsV107(){
    findOldCategoryRowsV107().forEach(row => {
      if(row.id === 'postCategoryOptionsV107') return;
      if(row.closest('#postCategoryBoxV107')) return;
      row.classList.add('hidden-old-category-row-v107');
      row.setAttribute('data-v107-hidden-category-row', 'true');
    });
  }

  function setActualCategoryV107(name){
    name = cleanV107(name);
    if(!name) return;

    window.selectedMood = name;
    window.currentMood = name;
    window.oneTimePostCategoryV103 = isPresetV107(name) ? '' : name;

    if(typeof setMood === 'function'){
      try { setMood(name, null); } catch {}
    }

    const hiddenInput = document.getElementById('postCategoryValueV107');
    if(hiddenInput) hiddenInput.value = name;

    const text = getComposerV107();
    if(text){
      text.placeholder = `Share your ${name.toLowerCase()}...`;
      text.focus();
    }
  }

  function chooseCategoryV107(name){
    name = cleanV107(name);
    selectedV107 = name;
    openV107 = false;

    setActualCategoryV107(name);
    renderCategoryBoxV107();

    if(typeof toast === 'function') toast(`${name} category applied`);
  }

  function renderCategoryBoxV107(){
    const card = getComposerCardV107();
    if(!card) return;

    hideOldCategoryRowsV107();

    let box = document.getElementById('postCategoryBoxV107');
    if(!box){
      box = document.createElement('section');
      box.id = 'postCategoryBoxV107';
      box.className = 'post-category-box-v107';

      const text = getComposerV107();
      const insertBefore = text ? (text.parentElement || text) : card.firstChild;
      card.insertBefore(box, insertBefore);
    }

    if(openV107){
      box.innerHTML = `
        <input type="hidden" id="postCategoryValueV107" value="${selectedV107}">
        <button type="button" class="post-category-top-v107" onclick="togglePostCategoryV107()">
          <div>
            <p>Post Category</p>
            <h3>Choose category</h3>
          </div>
          <span>⌃</span>
        </button>

        <div id="postCategoryOptionsV107" class="post-category-options-v107">
          ${PRESETS_V107.map(item => `
            <button type="button" class="${item === selectedV107 ? 'active' : ''}" onclick="choosePostCategoryV107('${item}')">${item}</button>
          `).join('')}

          <button type="button" class="custom-category-btn-v107" onclick="openCustomCategoryV107()">
            <b>＋</b><span>Add Custom</span>
          </button>
        </div>
      `;
    }else{
      box.innerHTML = `
        <input type="hidden" id="postCategoryValueV107" value="${selectedV107}">
        <button type="button" class="post-category-selected-v107" onclick="togglePostCategoryV107()">
          <div>
            <p>Post Category</p>
            <h3>${selectedV107}</h3>
            <span>Tap to change category</span>
          </div>
          <b>✎</b>
        </button>
      `;
    }
  }

  window.choosePostCategoryV107 = chooseCategoryV107;

  window.togglePostCategoryV107 = function(){
    openV107 = !openV107;
    renderCategoryBoxV107();
  };

  window.openCustomCategoryV107 = function(){
    let modal = document.getElementById('customCategoryModalV107');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'customCategoryModalV107';
      modal.className = 'custom-category-modal-v107 hidden';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="custom-category-card-v107">
        <div class="custom-category-head-v107">
          <span>＋</span>
          <div>
            <p>Personalised category</p>
            <h3>Add to Post & Apply</h3>
          </div>
        </div>

        <input id="customCategoryInputV107" maxlength="24" placeholder="Example: Travel, Fitness, Business">

        <div class="custom-category-actions-v107">
          <button type="button" class="ghost-v107" onclick="closeCustomCategoryV107()">Cancel</button>
          <button type="button" class="primary-v107" onclick="saveCustomCategoryV107()">Add to Post & Apply</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      const input = document.getElementById('customCategoryInputV107');
      if(input) input.focus();
    }, 50);
  };

  window.closeCustomCategoryV107 = function(){
    document.getElementById('customCategoryModalV107')?.classList.add('hidden');
  };

  window.saveCustomCategoryV107 = function(){
    const input = document.getElementById('customCategoryInputV107');
    const name = cleanV107(input ? input.value : '');

    if(!name){
      if(typeof toast === 'function') toast('Enter category name');
      return;
    }

    window.closeCustomCategoryV107();
    chooseCategoryV107(name);
  };

  function resetAfterPublishV107(){
    selectedV107 = 'Startup';
    openV107 = true;
    window.oneTimePostCategoryV103 = '';
    setActualCategoryV107('Startup');
    renderCategoryBoxV107();
  }

  function bindPublishResetV107(){
    Array.from(document.querySelectorAll('button')).forEach(btn => {
      if(btn.__v107PublishReset) return;

      const text = String(btn.textContent || '').trim().toLowerCase();
      if(!(text.includes('publish post') || text === 'post' || text.includes('share'))) return;

      btn.__v107PublishReset = true;
      btn.addEventListener('click', function(){
        setTimeout(resetAfterPublishV107, 1200);
      });
    });
  }

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
      window.closeCustomCategoryV107();
    }

    if(event.key === 'Enter' && document.activeElement?.id === 'customCategoryInputV107'){
      event.preventDefault();
      window.saveCustomCategoryV107();
    }
  });

  document.addEventListener('click', function(event){
    const modal = document.getElementById('customCategoryModalV107');
    if(modal && !modal.classList.contains('hidden') && event.target === modal){
      modal.classList.add('hidden');
    }
  });

  function runV107(){
    renderCategoryBoxV107();
    hideOldCategoryRowsV107();
    bindPublishResetV107();
  }

  setInterval(runV107, 700);
  setTimeout(runV107, 150);
  setTimeout(runV107, 600);
  setTimeout(runV107, 1600);
  setTimeout(runV107, 3200);
})();


/* =========================================================
   V124 CLEAN ADD POST + STABLE BACK
   Clean build from V108 stable.
   Avoids broken V120/V121/V123 dashboard hiding.
   - Home remains normal feed, composer removed from Home after render.
   - Create Post button opens separate Add Post page.
   - Publish uses original createPost().
   - Back button always visible after login.
   ========================================================= */

(function(){
  let currentViewV124 = 'home';
  let backStackV124 = [];
  let addPostOpenV124 = false;
  let originalSwitchViewV124 = null;
  let originalRenderHomeV124 = null;
  let originalCreatePostV124 = null;
  let originalOpenClipsV124 = null;
  let patchReadyV124 = false;

  function appReadyV124(){
    const appShell = document.getElementById('appShell');
    const authScreen = document.getElementById('authScreen');

    return (
      document.body.classList.contains('app-mode') ||
      (appShell && !appShell.classList.contains('hidden')) ||
      (authScreen && authScreen.classList.contains('hidden'))
    );
  }

  function mainV124(){
    return document.getElementById('mainContent') || document.querySelector('.main');
  }

  function cleanViewV124(view){
    view = String(view || '').trim();
    if(!view) return 'home';
    if(view === 'create') return 'add-post';
    if(view === 'create-post-popup') return 'add-post';
    return view;
  }

  function pushBackV124(from, to){
    from = cleanViewV124(from);
    to = cleanViewV124(to);

    if(!from || from === to) return;

    const last = backStackV124[backStackV124.length - 1];
    if(last !== from){
      backStackV124.push(from);
    }

    if(backStackV124.length > 20){
      backStackV124 = backStackV124.slice(-20);
    }
  }

  function avatarV124(){
    try{
      if(typeof renderAvatarHTML === 'function' && typeof getProfilePhoto === 'function'){
        return renderAvatarHTML(getProfilePhoto(), '🌐');
      }
    }catch{}
    return '🌐';
  }

  function topbarV124(){
    try{
      if(typeof renderTopbar === 'function') return renderTopbar();
    }catch{}
    return '';
  }

  function removeHomeComposerV124(){
    const main = mainV124();
    if(!main || addPostOpenV124) return;

    main.classList.remove('add-post-page-v124');
    document.body.classList.remove('add-post-mode-v124');

    const composer = main.querySelector('.composer, .post-composer, .create-post');
    if(composer){
      composer.classList.add('home-composer-removed-v124');
    }
  }

  async function renderHomeCleanV124(){
    addPostOpenV124 = false;
    currentViewV124 = 'home';

    document.body.classList.remove('add-post-mode-v124');

    if(originalRenderHomeV124){
      await originalRenderHomeV124();
    }

    setTimeout(removeHomeComposerV124, 20);
    setTimeout(removeHomeComposerV124, 150);
    setTimeout(removeHomeComposerV124, 500);
  }

  function renderAddPostPageV124(){
    const main = mainV124();
    if(!main) return;

    addPostOpenV124 = true;
    currentViewV124 = 'add-post';

    window.activeView = 'add-post';
    window.reconnectCurrentViewV112 = 'add-post';
    window.realCurrentViewV118 = 'add-post';

    document.body.classList.add('add-post-mode-v124');
    main.classList.add('add-post-page-v124');

    main.innerHTML = `
      ${topbarV124()}
      <section class="add-post-wrap-v124">
        <section class="add-post-composer-v124 card composer">
          <div class="composer-head">
            <div>
              <p class="eyebrow">Create Post</p>
              <h3>Share text, photos, clips, or audio</h3>
            </div>
            <span class="badge">Ready</span>
          </div>

          <div class="compose-row">
            <div class="avatar sm status-active">${avatarV124()}</div>
            <textarea id="postText" placeholder="What do you want to share today?"></textarea>
          </div>

          <div id="pendingMediaPreview" class="pending-media-preview hidden"></div>

          <div class="media-tools">
            <input id="postMediaInput" type="file" accept="image/*,video/*,audio/*" multiple hidden onchange="handlePostMediaFiles(this.files);this.value=''">
            <button class="media-btn" type="button" onclick="document.getElementById('postMediaInput').click()">📷 Photo</button>
            <button class="media-btn" type="button" onclick="document.getElementById('postMediaInput').click()">🎬 Clip</button>
            <button class="media-btn" type="button" onclick="document.getElementById('postMediaInput').click()">🎧 Audio</button>
            <button class="media-btn danger-lite" type="button" onclick="clearPendingMedia()">Clear media</button>
          </div>

          <div class="moods">
            <button class="mood active" type="button" onclick="setMood('Thought',this)">Thought</button>
            <button class="mood" type="button" onclick="setMood('Build Mode',this)">Build Mode</button>
            <button class="mood" type="button" onclick="setMood('Study',this)">Study</button>
            <button class="mood" type="button" onclick="setMood('Startup',this)">Startup</button>
            <button class="mood" type="button" onclick="setMood('Life Update',this)">Life Update</button>
            <button class="mood" type="button" onclick="setMood('Question',this)">Question</button>
          </div>

          <input type="hidden" id="postMood" value="Thought">

          <div class="compose-actions">
            <div>
              <span class="tool">Images supported</span>
              <span class="tool">Clips supported</span>
              <span class="tool">Audio supported</span>
            </div>
            <button class="publish" type="button" onclick="createPost()">+ Publish Post</button>
          </div>
        </section>
      </section>
    `;

    try{
      if(typeof renderPendingMediaPreview === 'function') renderPendingMediaPreview();
    }catch{}

    setTimeout(() => {
      const input = document.getElementById('postText');
      if(input){
        input.focus();
        input.scrollIntoView({ behavior:'smooth', block:'center' });
      }
    }, 80);

    updateBackButtonV124();
  }

  function switchViewCleanV124(view){
    view = cleanViewV124(view);

    if(view === 'add-post'){
      pushBackV124(currentViewV124, 'add-post');
      renderAddPostPageV124();
      return;
    }

    addPostOpenV124 = false;
    document.body.classList.remove('add-post-mode-v124');

    const previous = currentViewV124;
    currentViewV124 = view;

    if(view !== previous){
      pushBackV124(previous, view);
    }

    if(originalSwitchViewV124){
      originalSwitchViewV124(view);
    }

    if(view === 'home'){
      setTimeout(removeHomeComposerV124, 80);
      setTimeout(removeHomeComposerV124, 350);
    }

    updateBackButtonV124();
  }

  function patchSwitchViewV124(){
    if(typeof window.switchView !== 'function') return false;
    if(window.switchView.__v124Patched) return true;

    originalSwitchViewV124 = window.switchView;

    const patched = function(view){
      return switchViewCleanV124(view);
    };

    patched.__v124Patched = true;
    window.switchView = patched;
    return true;
  }

  function patchRenderHomeV124(){
    if(typeof window.renderHome !== 'function') return false;
    if(window.renderHome.__v124Patched) return true;

    originalRenderHomeV124 = window.renderHome;

    const patched = async function(){
      return await renderHomeCleanV124();
    };

    patched.__v124Patched = true;
    window.renderHome = patched;
    return true;
  }

  function patchCreatePostV124(){
    if(typeof window.createPost !== 'function') return false;
    if(window.createPost.__v124Patched) return true;

    originalCreatePostV124 = window.createPost;

    const patched = async function(){
      const wasAddPost = addPostOpenV124 || currentViewV124 === 'add-post';

      const result = await originalCreatePostV124.apply(this, arguments);

      if(wasAddPost){
        addPostOpenV124 = false;
        currentViewV124 = 'home';
        window.activeView = 'home';
        window.reconnectCurrentViewV112 = 'home';
        window.realCurrentViewV118 = 'home';

        setTimeout(() => {
          renderHomeCleanV124();
        }, 250);
      }

      return result;
    };

    patched.__v124Patched = true;
    window.createPost = patched;
    return true;
  }

  function findCreateButtonsV124(){
    const set = new Set();

    [
      '.post-shortcut',
      '.nav-post-shortcut-v49',
      '.create-post-fixed-v99',
      '.create-post-fixed-v98',
      '.sidebar button[title="Create Post"]',
      '.sidebar button[aria-label="Create Post"]',
      '.sidebar button[title="Add Post"]',
      '.sidebar button[aria-label="Add Post"]'
    ].forEach(sel => {
      document.querySelectorAll(sel).forEach(btn => set.add(btn));
    });

    document.querySelectorAll('.sidebar button').forEach(btn => {
      const t = String(btn.textContent || '').trim().toLowerCase();
      const title = String(btn.getAttribute('title') || btn.getAttribute('aria-label') || '').toLowerCase();

      if(t.includes('+') || t.includes('＋') || title.includes('create post') || title.includes('add post')){
        set.add(btn);
      }
    });

    return Array.from(set);
  }

  function patchCreateButtonsV124(){
    findCreateButtonsV124().forEach(btn => {
      btn.dataset.view = 'add-post';
      btn.setAttribute('title', 'Add Post');
      btn.setAttribute('aria-label', 'Add Post');
      btn.setAttribute('data-tooltip', 'Add Post');
      btn.setAttribute('data-final-tooltip', 'Add Post');

      const label = btn.querySelector('.nav-label');
      if(label) label.textContent = 'Add Post';

      btn.onclick = function(event){
        event.preventDefault();
        event.stopPropagation();

        document.querySelectorAll('.nav-btn,.post-shortcut').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        switchViewCleanV124('add-post');
      };
    });

    window.openHomeComposerV99 = function(){
      const menu = document.getElementById('createMenuV99');
      if(menu) menu.classList.add('hidden');
      switchViewCleanV124('add-post');
    };

    window.openAddPostDashboardV115 = function(){ switchViewCleanV124('add-post'); };
    window.openAddPostDashboardV120 = function(){ switchViewCleanV124('add-post'); };
    window.openAddPostPageV121 = function(){ switchViewCleanV124('add-post'); };
    window.openCreatePopupV123 = function(){ switchViewCleanV124('add-post'); };
  }

  function patchClipV124(){
    window.openClipComposerV99 = function(){
      const menu = document.getElementById('createMenuV99');
      if(menu) menu.classList.add('hidden');

      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = 'video/*';
      picker.multiple = false;
      picker.style.position = 'fixed';
      picker.style.left = '-9999px';
      document.body.appendChild(picker);

      picker.onchange = function(){
        const files = picker.files;
        switchViewCleanV124('add-post');

        setTimeout(() => {
          if(files && files.length && typeof handlePostMediaFiles === 'function'){
            handlePostMediaFiles(files);
          }

          const box = document.getElementById('postText');
          if(box){
            box.placeholder = 'Write a caption for your clip...';
            box.focus();
          }

          if(typeof toast === 'function') toast('Clip added to Add Post');
          try{ picker.remove(); }catch{}
        }, 300);
      };

      picker.click();
    };
  }

  function ensureBackButtonV124(){
    let btn = document.getElementById('globalBackButtonV124');

    if(!btn){
      btn = document.createElement('button');
      btn.id = 'globalBackButtonV124';
      btn.className = 'global-back-button-v124';
      btn.type = 'button';
      btn.innerHTML = '<span>←</span><b>Back</b>';
      document.body.appendChild(btn);
    }

    btn.onclick = function(event){
      event.preventDefault();
      event.stopPropagation();
      goBackV124();
    };

    btn.style.display = appReadyV124() ? 'inline-flex' : 'none';
  }

  function updateBackButtonV124(){
    ensureBackButtonV124();
  }

  function goBackV124(){
    let previous = backStackV124.pop();

    if(!previous || previous === currentViewV124){
      previous = 'home';
    }

    // After going one step back, next click goes home.
    backStackV124 = previous === 'home' ? [] : ['home'];

    if(previous === 'add-post'){
      renderAddPostPageV124();
      return;
    }

    addPostOpenV124 = false;
    document.body.classList.remove('add-post-mode-v124');

    currentViewV124 = previous;
    if(originalSwitchViewV124){
      originalSwitchViewV124(previous);
    }

    if(previous === 'home'){
      setTimeout(removeHomeComposerV124, 80);
      setTimeout(removeHomeComposerV124, 350);
    }

    updateBackButtonV124();
  }

  function patchOpenClipsV124(){
    if(typeof window.openClipsV97 !== 'function') return;
    if(window.openClipsV97.__v124Patched) return;

    originalOpenClipsV124 = window.openClipsV97;

    const patched = function(){
      pushBackV124(currentViewV124, 'clips');
      currentViewV124 = 'clips';
      const result = originalOpenClipsV124.apply(this, arguments);
      updateBackButtonV124();
      return result;
    };

    patched.__v124Patched = true;
    window.openClipsV97 = patched;
  }

  function runV124(){
    patchSwitchViewV124();
    patchRenderHomeV124();
    patchCreatePostV124();
    patchCreateButtonsV124();
    patchClipV124();
    patchOpenClipsV124();
    ensureBackButtonV124();

    if(!addPostOpenV124 && currentViewV124 === 'home'){
      removeHomeComposerV124();
    }

    patchReadyV124 = true;
  }

  setInterval(runV124, 500);
  setTimeout(runV124, 80);
  setTimeout(runV124, 400);
  setTimeout(runV124, 1200);
})();


/* =========================================================
   V125 CLIPS NAMING + GROUP CHAT FRONTEND
   Safe add-on on top of V124 stable:
   - Renames video/video posts to Clip/Clips in UI.
   - Adds Clip badge to video posts.
   - Adds frontend-safe Group Chat panel inside Messaging.
   - Group options:
     1) admin-only messages
     2) invite-link required mode
     3) open join mode, no invite required
   - Groups are stored locally first to avoid breaking backend.
   ========================================================= */

(function(){
  const GROUPS_KEY = 'reconnect_groups_v125';
  let activeGroupIdV125 = null;

  function cleanV125(value=''){
    return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  }

  function safeShortV125(value='', max=40){
    return cleanV125(value).slice(0, max);
  }

  function currentUserV125(){
    try{
      return window.currentUserData || currentUserData || {};
    }catch{
      return {};
    }
  }

  function usernameV125(){
    const u = currentUserV125();
    return u.username || u.displayName || 'you';
  }

  function userIdV125(){
    const u = currentUserV125();
    return String(u._id || u.id || u.username || 'me');
  }

  function loadGroupsV125(){
    try{
      const data = JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    }catch{
      return [];
    }
  }

  function saveGroupsV125(groups){
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  function groupInviteLinkV125(group){
    const origin = location.origin || '';
    const path = location.pathname || '/';
    return `${origin}${path}#join-group=${encodeURIComponent(group.id)}`;
  }

  function makeIdV125(){
    return 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  function relabelVideosAsClipsV125(){
    const root = document.getElementById('mainContent') || document.body;

    // Rename exact UI labels only, avoid rewriting user captions/content.
    root.querySelectorAll('button, span, small, b, strong, h1, h2, h3, p, label').forEach(el => {
      if(el.closest('textarea,input,.post-content,.caption,.message-text')) return;

      const original = String(el.textContent || '').trim();
      const lower = original.toLowerCase();

      if(lower === 'video') el.textContent = 'Clip';
      else if(lower === 'videos') el.textContent = 'Clips';
      else if(lower === 'video post') el.textContent = 'Clip';
      else if(lower === 'video posts') el.textContent = 'Clips';
      else if(lower === 'short video') el.textContent = 'Clip';
      else if(lower === 'short video feed') el.textContent = 'Clips Feed';
      else if(lower === 'total videos') el.textContent = 'Total Clips';
      else if(lower === 'video supported') el.textContent = 'Clips supported';
    });

    // Add clip badge to cards/posts containing video tags or video files.
    root.querySelectorAll('.post, .post-card, article.card, .card').forEach(card => {
      if(card.querySelector('.clip-badge-v125')) return;

      const hasVideo =
        card.querySelector('video') ||
        Array.from(card.querySelectorAll('[src],[href]')).some(el => {
          const url = String(el.getAttribute('src') || el.getAttribute('href') || '').toLowerCase();
          return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video');
        });

      if(!hasVideo) return;

      const badge = document.createElement('span');
      badge.className = 'clip-badge-v125';
      badge.textContent = 'Clip';

      const target =
        card.querySelector('.post-meta') ||
        card.querySelector('.post-head') ||
        card.querySelector('.post-author') ||
        card.querySelector('header') ||
        card;

      target.appendChild(badge);
    });
  }

  function messagingRootV125(){
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return null;

    const text = String(main.textContent || '').toLowerCase();

    if(
      text.includes('message') ||
      text.includes('conversation') ||
      main.querySelector('.messages-list,.chat-list,.chat-panel,.message-thread,.chat-messages')
    ){
      return main;
    }

    return null;
  }

  function injectGroupChatButtonV125(){
    const root = messagingRootV125();
    if(!root) return;

    if(root.querySelector('#groupChatToolbarV125')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'groupChatToolbarV125';
    toolbar.className = 'group-toolbar-v125';
    toolbar.innerHTML = `
      <div>
        <p>Messaging</p>
        <h3>Group Chats</h3>
      </div>
      <button type="button" onclick="openCreateGroupV125()">＋ Create Group</button>
    `;

    const insertAfter =
      root.querySelector('.topbar') ||
      root.querySelector('.search-only-topbar-v63') ||
      root.firstElementChild;

    if(insertAfter && insertAfter.parentElement === root){
      root.insertBefore(toolbar, insertAfter.nextSibling);
    }else{
      root.insertBefore(toolbar, root.firstChild);
    }

    renderGroupsPanelV125();
  }

  function ensureGroupPanelV125(){
    const root = messagingRootV125();
    if(!root) return null;

    let panel = root.querySelector('#groupsPanelV125');

    if(!panel){
      panel = document.createElement('section');
      panel.id = 'groupsPanelV125';
      panel.className = 'groups-panel-v125 card';

      const toolbar = root.querySelector('#groupChatToolbarV125');
      if(toolbar && toolbar.nextSibling){
        root.insertBefore(panel, toolbar.nextSibling);
      }else{
        root.insertBefore(panel, root.firstChild);
      }
    }

    return panel;
  }

  function renderGroupsPanelV125(){
    const panel = ensureGroupPanelV125();
    if(!panel) return;

    const groups = loadGroupsV125();

    if(!groups.length){
      panel.innerHTML = `
        <div class="groups-empty-v125">
          <h3>No group chats yet</h3>
          <p>Create a group for friends, class, team, startup, or community chat.</p>
          <button type="button" onclick="openCreateGroupV125()">Create your first group</button>
        </div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="groups-list-v125">
        ${groups.map(group => `
          <button type="button" class="group-row-v125 ${activeGroupIdV125 === group.id ? 'active' : ''}" onclick="openGroupChatV125('${group.id}')">
            <span>${group.name.slice(0,1).toUpperCase()}</span>
            <div>
              <b>${group.name}</b>
              <small>${group.members.length} members • ${group.adminOnly ? 'Admin-only messages' : 'Everyone can message'}</small>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  function ensureGroupModalV125(){
    let modal = document.getElementById('groupModalV125');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV125';
      modal.className = 'group-modal-v125 hidden';
      document.body.appendChild(modal);
    }

    return modal;
  }

  window.openCreateGroupV125 = function(){
    const modal = ensureGroupModalV125();

    modal.innerHTML = `
      <section class="group-modal-card-v125">
        <div class="group-modal-head-v125">
          <div>
            <p>Group Chat</p>
            <h2>Create Group</h2>
            <span>Build a group with admin rules and join controls.</span>
          </div>
          <button type="button" onclick="closeGroupModalV125()">×</button>
        </div>

        <label class="group-field-v125">
          <span>Group name</span>
          <input id="groupNameV125" maxlength="40" placeholder="Example: Class 10 AI Team">
        </label>

        <label class="group-field-v125">
          <span>Add members by username</span>
          <input id="groupMembersV125" placeholder="Example: saru, rahul, aarya">
          <small>For now this saves locally. Backend sync will come in the next phase.</small>
        </label>

        <div class="group-options-v125">
          <label>
            <input id="groupAdminOnlyV125" type="checkbox">
            <div>
              <b>Only admin can send messages</b>
              <small>Members can read, but only admin posts updates.</small>
            </div>
          </label>

          <label>
            <input id="groupInviteRequiredV125" type="checkbox" checked>
            <div>
              <b>Invite link required</b>
              <small>People join through invite message/link.</small>
            </div>
          </label>

          <label>
            <input id="groupOpenJoinV125" type="checkbox">
            <div>
              <b>Open join</b>
              <small>People can join by themselves without invite link.</small>
            </div>
          </label>
        </div>

        <div class="group-actions-v125">
          <button type="button" class="ghost-v125" onclick="closeGroupModalV125()">Cancel</button>
          <button type="button" class="primary-v125" onclick="createGroupV125()">Create Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      const input = document.getElementById('groupNameV125');
      if(input) input.focus();
    }, 60);
  };

  window.closeGroupModalV125 = function(){
    const modal = document.getElementById('groupModalV125');
    if(modal) modal.classList.add('hidden');
  };

  window.createGroupV125 = function(){
    const name = safeShortV125(document.getElementById('groupNameV125')?.value || '', 40);
    const membersRaw = cleanV125(document.getElementById('groupMembersV125')?.value || '');

    if(!name){
      if(typeof toast === 'function') toast('Enter group name');
      return;
    }

    const members = membersRaw
      ? membersRaw.split(',').map(x => cleanV125(x).replace(/^@/,'')).filter(Boolean)
      : [];

    const me = usernameV125();
    if(!members.some(x => x.toLowerCase() === me.toLowerCase())){
      members.unshift(me);
    }

    const adminOnly = !!document.getElementById('groupAdminOnlyV125')?.checked;
    const openJoin = !!document.getElementById('groupOpenJoinV125')?.checked;
    const inviteRequired = openJoin ? false : !!document.getElementById('groupInviteRequiredV125')?.checked;

    const group = {
      id: makeIdV125(),
      name,
      adminId: userIdV125(),
      adminUsername: me,
      members,
      adminOnly,
      inviteRequired,
      openJoin,
      messages: [],
      createdAt: new Date().toISOString()
    };

    const groups = loadGroupsV125();
    groups.unshift(group);
    saveGroupsV125(groups);

    activeGroupIdV125 = group.id;
    window.closeGroupModalV125();
    renderGroupsPanelV125();
    openGroupChatV125(group.id);

    if(typeof toast === 'function') toast('Group created');
  };

  function getGroupV125(id){
    return loadGroupsV125().find(g => g.id === id);
  }

  function saveGroupV125(group){
    const groups = loadGroupsV125();
    const idx = groups.findIndex(g => g.id === group.id);
    if(idx >= 0) groups[idx] = group;
    else groups.unshift(group);
    saveGroupsV125(groups);
  }

  window.openGroupChatV125 = function(groupId){
    const group = getGroupV125(groupId);
    if(!group) return;

    activeGroupIdV125 = groupId;
    renderGroupsPanelV125();

    const root = messagingRootV125();
    if(!root) return;

    let chat = root.querySelector('#groupChatViewV125');
    if(!chat){
      chat = document.createElement('section');
      chat.id = 'groupChatViewV125';
      chat.className = 'group-chat-view-v125 card';

      const panel = root.querySelector('#groupsPanelV125');
      if(panel && panel.nextSibling){
        root.insertBefore(chat, panel.nextSibling);
      }else{
        root.appendChild(chat);
      }
    }

    const isAdmin = String(group.adminId) === userIdV125() || group.adminUsername === usernameV125();
    const canSend = !group.adminOnly || isAdmin;

    chat.innerHTML = `
      <div class="group-chat-head-v125">
        <div>
          <p>Group Chat</p>
          <h3>${group.name}</h3>
          <span>${group.members.length} members • ${group.openJoin ? 'Open join' : group.inviteRequired ? 'Invite required' : 'Private'}</span>
        </div>

        <div class="group-head-actions-v125">
          <button type="button" onclick="copyGroupInviteV125('${group.id}')">Invite</button>
          ${isAdmin ? `<button type="button" onclick="openGroupManageV125('${group.id}')">Manage</button>` : ''}
          <button type="button" onclick="exitGroupV125('${group.id}')">Exit</button>
        </div>
      </div>

      <div class="group-rule-v125">
        ${group.adminOnly ? '🔒 Only admin can send messages.' : '💬 Everyone can send messages.'}
        ${group.openJoin ? ' People can join without invite.' : group.inviteRequired ? ' Invite link required.' : ''}
      </div>

      <div id="groupMessagesV125" class="group-messages-v125">
        ${
          group.messages.length
          ? group.messages.map(msg => `
              <div class="group-message-v125 ${msg.sender === usernameV125() ? 'mine' : ''}">
                <b>${msg.sender}</b>
                <p>${msg.text}</p>
                <small>${new Date(msg.time).toLocaleString()}</small>
              </div>
            `).join('')
          : `<div class="group-no-msg-v125">No messages yet.</div>`
        }
      </div>

      <div class="group-send-v125 ${canSend ? '' : 'disabled'}">
        <input id="groupMessageInputV125" ${canSend ? '' : 'disabled'} placeholder="${canSend ? 'Write a group message...' : 'Only admin can send messages'}">
        <button type="button" ${canSend ? `onclick="sendGroupMessageV125('${group.id}')"` : 'disabled'}>Send</button>
      </div>
    `;

    setTimeout(() => {
      const box = document.getElementById('groupMessagesV125');
      if(box) box.scrollTop = box.scrollHeight;
    }, 50);
  };

  window.sendGroupMessageV125 = function(groupId){
    const group = getGroupV125(groupId);
    if(!group) return;

    const isAdmin = String(group.adminId) === userIdV125() || group.adminUsername === usernameV125();

    if(group.adminOnly && !isAdmin){
      if(typeof toast === 'function') toast('Only admin can send messages');
      return;
    }

    const input = document.getElementById('groupMessageInputV125');
    const text = safeShortV125(input?.value || '', 800);

    if(!text) return;

    group.messages.push({
      id: makeIdV125(),
      sender: usernameV125(),
      senderId: userIdV125(),
      text,
      time: new Date().toISOString()
    });

    saveGroupV125(group);

    if(input) input.value = '';
    window.openGroupChatV125(groupId);
  };

  window.copyGroupInviteV125 = async function(groupId){
    const group = getGroupV125(groupId);
    if(!group) return;

    const link = groupInviteLinkV125(group);
    try{
      await navigator.clipboard.writeText(link);
      if(typeof toast === 'function') toast('Invite link copied');
    }catch{
      prompt('Copy invite link:', link);
    }
  };

  window.exitGroupV125 = function(groupId){
    const groups = loadGroupsV125();
    const group = groups.find(g => g.id === groupId);
    if(!group) return;

    const me = usernameV125();

    if(group.adminUsername === me){
      if(!confirm('You are admin. Delete this local group?')) return;
      saveGroupsV125(groups.filter(g => g.id !== groupId));
    }else{
      group.members = group.members.filter(m => m.toLowerCase() !== me.toLowerCase());
      saveGroupV125(group);
    }

    activeGroupIdV125 = null;
    renderGroupsPanelV125();

    const view = document.getElementById('groupChatViewV125');
    if(view) view.remove();

    if(typeof toast === 'function') toast('Exited group');
  };

  window.openGroupManageV125 = function(groupId){
    const group = getGroupV125(groupId);
    if(!group) return;

    const modal = ensureGroupModalV125();

    modal.innerHTML = `
      <section class="group-modal-card-v125">
        <div class="group-modal-head-v125">
          <div>
            <p>Admin Settings</p>
            <h2>${group.name}</h2>
            <span>Add/remove members and control permissions.</span>
          </div>
          <button type="button" onclick="closeGroupModalV125()">×</button>
        </div>

        <label class="group-field-v125">
          <span>Group name</span>
          <input id="editGroupNameV125" maxlength="40" value="${group.name}">
        </label>

        <label class="group-field-v125">
          <span>Members usernames</span>
          <input id="editGroupMembersV125" value="${group.members.join(', ')}">
        </label>

        <div class="group-options-v125">
          <label>
            <input id="editAdminOnlyV125" type="checkbox" ${group.adminOnly ? 'checked' : ''}>
            <div>
              <b>Only admin can send messages</b>
              <small>Members can read, but only admin posts.</small>
            </div>
          </label>

          <label>
            <input id="editInviteRequiredV125" type="checkbox" ${group.inviteRequired ? 'checked' : ''}>
            <div>
              <b>Invite link required</b>
              <small>People join through invite link/message.</small>
            </div>
          </label>

          <label>
            <input id="editOpenJoinV125" type="checkbox" ${group.openJoin ? 'checked' : ''}>
            <div>
              <b>Open join</b>
              <small>People can join by themselves.</small>
            </div>
          </label>
        </div>

        <div class="group-actions-v125">
          <button type="button" class="ghost-v125" onclick="closeGroupModalV125()">Cancel</button>
          <button type="button" class="primary-v125" onclick="saveGroupManageV125('${group.id}')">Save Changes</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.saveGroupManageV125 = function(groupId){
    const group = getGroupV125(groupId);
    if(!group) return;

    group.name = safeShortV125(document.getElementById('editGroupNameV125')?.value || group.name, 40);
    group.members = cleanV125(document.getElementById('editGroupMembersV125')?.value || '')
      .split(',')
      .map(x => cleanV125(x).replace(/^@/,''))
      .filter(Boolean);

    const me = usernameV125();
    if(!group.members.some(x => x.toLowerCase() === me.toLowerCase())){
      group.members.unshift(me);
    }

    group.adminOnly = !!document.getElementById('editAdminOnlyV125')?.checked;
    group.openJoin = !!document.getElementById('editOpenJoinV125')?.checked;
    group.inviteRequired = group.openJoin ? false : !!document.getElementById('editInviteRequiredV125')?.checked;

    saveGroupV125(group);
    window.closeGroupModalV125();
    renderGroupsPanelV125();
    window.openGroupChatV125(group.id);

    if(typeof toast === 'function') toast('Group updated');
  };

  function handleJoinHashV125(){
    const match = String(location.hash || '').match(/join-group=([^&]+)/);
    if(!match) return;

    const groupId = decodeURIComponent(match[1]);
    const group = getGroupV125(groupId);

    if(!group) return;

    const me = usernameV125();

    if(!group.members.some(m => m.toLowerCase() === me.toLowerCase())){
      if(group.openJoin || group.inviteRequired){
        group.members.push(me);
        saveGroupV125(group);
        if(typeof toast === 'function') toast('Joined group');
      }
    }

    activeGroupIdV125 = group.id;

    if(typeof switchView === 'function'){
      try{ switchView('messages'); }catch{}
    }

    setTimeout(() => {
      injectGroupChatButtonV125();
      window.openGroupChatV125(group.id);
    }, 800);
  }

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
      window.closeGroupModalV125();
    }

    if(event.key === 'Enter' && document.activeElement?.id === 'groupMessageInputV125'){
      const groupId = activeGroupIdV125;
      if(groupId) window.sendGroupMessageV125(groupId);
    }
  });

  document.addEventListener('click', function(event){
    const modal = document.getElementById('groupModalV125');
    if(modal && !modal.classList.contains('hidden') && event.target === modal){
      modal.classList.add('hidden');
    }
  });

  function runV125(){
    relabelVideosAsClipsV125();
    injectGroupChatButtonV125();
    handleJoinHashV125();
  }

  setInterval(runV125, 1200);
  setTimeout(runV125, 300);
  setTimeout(runV125, 900);
  setTimeout(runV125, 2400);
})();


/* =========================================================
   V126 GROUP CHAT INSIDE DM + INVITE/SEARCH/LAYER FIX
   Safe add-on on top of V125:
   - Moves group chats into normal DM/Messaging area.
   - Adds 3-dot menu inside Messaging with Create Group.
   - Username search reads known users + tries backend search endpoints.
   - Invite link is generated and copyable.
   - Group popup is forced above right dashboard layer.
   - Hides old V125 separate group panel/toolbar to avoid duplicate UI.
   ========================================================= */

(function(){
  const GROUPS_KEY = 'reconnect_groups_v125';
  let selectedMembersV126 = [];
  let activeGroupIdV126 = null;
  let searchTimerV126 = null;

  function cleanV126(value=''){
    return String(value || '')
      .replace(/[<>]/g,'')
      .replace(/\s+/g,' ')
      .trim();
  }

  function safeV126(value='', max=80){
    return cleanV126(value).slice(0, max);
  }

  function currentUserV126(){
    try { return window.currentUserData || currentUserData || {}; }
    catch { return {}; }
  }

  function usernameV126(){
    const u = currentUserV126();
    return u.username || u.displayName || 'you';
  }

  function userIdV126(){
    const u = currentUserV126();
    return String(u._id || u.id || u.username || 'me');
  }

  function loadGroupsV126(){
    try{
      const arr = JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
      return Array.isArray(arr) ? arr : [];
    }catch{
      return [];
    }
  }

  function saveGroupsV126(groups){
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  function saveGroupV126(group){
    const groups = loadGroupsV126();
    const index = groups.findIndex(g => g.id === group.id);
    if(index >= 0) groups[index] = group;
    else groups.unshift(group);
    saveGroupsV126(groups);
  }

  function getGroupV126(id){
    return loadGroupsV126().find(g => g.id === id);
  }

  function makeIdV126(){
    return 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
  }

  function inviteLinkV126(group){
    const url = new URL(location.href);
    url.hash = `join-group=${encodeURIComponent(group.id)}`;
    return url.toString();
  }

  function messagingRootV126(){
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return null;

    const text = String(main.textContent || '').toLowerCase();
    const hasChat =
      main.querySelector('.messages-list,.chat-list,.conversation-list,.dm-list,.message-thread,.chat-messages,.chat-panel') ||
      text.includes('message') ||
      text.includes('conversation') ||
      text.includes('select a conversation');

    return hasChat ? main : null;
  }

  function isMessagingPageV126(){
    return !!messagingRootV126();
  }

  function findDmListV126(root){
    return (
      root.querySelector('.messages-list') ||
      root.querySelector('.chat-list') ||
      root.querySelector('.conversation-list') ||
      root.querySelector('.dm-list') ||
      root.querySelector('.conversation-sidebar') ||
      root.querySelector('.messages-sidebar')
    );
  }

  function findChatAreaV126(root){
    return (
      root.querySelector('.chat-panel') ||
      root.querySelector('.message-thread') ||
      root.querySelector('.chat-messages')?.parentElement ||
      root.querySelector('.conversation-panel') ||
      root
    );
  }

  function hideOldSeparateGroupsV126(){
    document.querySelectorAll('#groupChatToolbarV125,#groupsPanelV125,#groupChatViewV125').forEach(el => {
      el.classList.add('hide-old-groups-v126');
    });
  }

  function collectLocalUsersV126(){
    const map = new Map();

    function addUser(u){
      if(!u) return;

      if(typeof u === 'string'){
        const username = cleanV126(u).replace(/^@/,'');
        if(username) map.set(username.toLowerCase(), {username, displayName: username});
        return;
      }

      const username = cleanV126(u.username || u.handle || u.name || u.displayName || '').replace(/^@/,'');
      if(!username) return;

      map.set(username.toLowerCase(), {
        id: u._id || u.id || username,
        username,
        displayName: u.displayName || u.name || username,
        avatar: u.avatar || u.photo || u.profilePhoto || ''
      });
    }

    addUser(currentUserV126());

    const arrays = [
      window.allUsers,
      window.users,
      window.searchUsers,
      window.followers,
      window.following,
      window.chatUsers,
      window.conversations,
      window.feedPosts
    ];

    arrays.forEach(arr => {
      if(!Array.isArray(arr)) return;

      arr.forEach(item => {
        addUser(item);

        if(item.author) addUser(item.author);
        if(item.user) addUser(item.user);
        if(item.sender) addUser(item.sender);
        if(item.receiver) addUser(item.receiver);
        if(item.participant) addUser(item.participant);

        if(Array.isArray(item.participants)) item.participants.forEach(addUser);
        if(Array.isArray(item.members)) item.members.forEach(addUser);

        if(Array.isArray(item.comments)){
          item.comments.forEach(c => addUser(c.author || c.user));
        }
      });
    });

    // Pull visible usernames from current UI as fallback.
    document.querySelectorAll('[data-username], .username, .user-name, .handle').forEach(el => {
      const u = cleanV126(el.dataset.username || el.textContent || '').replace(/^@/,'');
      if(u && u.length <= 32) addUser(u);
    });

    return Array.from(map.values());
  }

  async function backendUserSearchV126(query){
    const endpoints = [
      `/api/users/search?q=${encodeURIComponent(query)}`,
      `/api/search/users?q=${encodeURIComponent(query)}`,
      `/api/users?search=${encodeURIComponent(query)}`,
      `/api/profile/search?q=${encodeURIComponent(query)}`
    ];

    for(const url of endpoints){
      try{
        const res = await fetch(url, {
          headers: {
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
          }
        });

        if(!res.ok) continue;

        const data = await res.json();

        const arr =
          data.users ||
          data.results ||
          data.profiles ||
          data.data ||
          (Array.isArray(data) ? data : []);

        if(Array.isArray(arr) && arr.length){
          return arr.map(u => ({
            id: u._id || u.id || u.username,
            username: u.username || u.handle || u.name || u.displayName,
            displayName: u.displayName || u.name || u.username || u.handle,
            avatar: u.avatar || u.profilePhoto || u.photo || ''
          })).filter(u => u.username);
        }
      }catch{}
    }

    return [];
  }

  async function searchUsersV126(query){
    query = cleanV126(query).replace(/^@/,'').toLowerCase();

    const local = collectLocalUsersV126().filter(u => {
      const a = String(u.username || '').toLowerCase();
      const b = String(u.displayName || '').toLowerCase();
      return !query || a.includes(query) || b.includes(query);
    });

    const backend = query.length >= 1 ? await backendUserSearchV126(query) : [];

    const map = new Map();

    [...local, ...backend].forEach(u => {
      const username = cleanV126(u.username || '').replace(/^@/,'');
      if(!username) return;
      map.set(username.toLowerCase(), {
        id: u.id || username,
        username,
        displayName: u.displayName || username,
        avatar: u.avatar || ''
      });
    });

    return Array.from(map.values()).slice(0, 12);
  }

  function avatarCircleV126(user){
    const letter = (user.displayName || user.username || '?').slice(0,1).toUpperCase();
    return `<span class="group-user-avatar-v126">${letter}</span>`;
  }

  function renderSelectedMembersV126(){
    const box = document.getElementById('selectedMembersV126');
    if(!box) return;

    if(!selectedMembersV126.length){
      box.innerHTML = `<small>No members selected yet. Search and add members below.</small>`;
      return;
    }

    box.innerHTML = selectedMembersV126.map(user => `
      <button type="button" onclick="removeSelectedMemberV126('${user.username}')">
        ${avatarCircleV126(user)}
        <span>${user.displayName || user.username}</span>
        <b>×</b>
      </button>
    `).join('');
  }

  window.removeSelectedMemberV126 = function(username){
    selectedMembersV126 = selectedMembersV126.filter(u => u.username !== username);
    renderSelectedMembersV126();
  };

  window.addSelectedMemberV126 = function(username, displayName=''){
    username = cleanV126(username).replace(/^@/,'');
    displayName = cleanV126(displayName || username);

    if(!username) return;

    if(!selectedMembersV126.some(u => u.username.toLowerCase() === username.toLowerCase())){
      selectedMembersV126.push({username, displayName});
    }

    const input = document.getElementById('groupMemberSearchV126');
    if(input) input.value = '';

    const results = document.getElementById('memberSearchResultsV126');
    if(results) results.innerHTML = '';

    renderSelectedMembersV126();
  };

  async function updateMemberSearchResultsV126(){
    const input = document.getElementById('groupMemberSearchV126');
    const results = document.getElementById('memberSearchResultsV126');
    if(!input || !results) return;

    const q = input.value.trim();

    const users = await searchUsersV126(q);
    const selectedSet = new Set(selectedMembersV126.map(u => u.username.toLowerCase()));
    const me = usernameV126().toLowerCase();

    const filtered = users.filter(u => {
      const un = String(u.username || '').toLowerCase();
      return un && un !== me && !selectedSet.has(un);
    });

    if(!filtered.length){
      results.innerHTML = `
        <div class="member-no-result-v126">
          No profile found. You can still type exact username and press Add Manual.
        </div>
      `;
      return;
    }

    results.innerHTML = filtered.map(u => `
      <button type="button" onclick="addSelectedMemberV126('${u.username}','${String(u.displayName || u.username).replace(/'/g, "\\'")}')">
        ${avatarCircleV126(u)}
        <span>
          <b>${u.displayName || u.username}</b>
          <small>@${u.username}</small>
        </span>
        <em>Add</em>
      </button>
    `).join('');
  }

  window.addManualMemberV126 = function(){
    const input = document.getElementById('groupMemberSearchV126');
    const value = cleanV126(input?.value || '').replace(/^@/,'');
    if(!value) return;

    window.addSelectedMemberV126(value, value);
  };

  function ensureGroupModalV126(){
    let modal = document.getElementById('groupModalV126');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV126';
      modal.className = 'group-modal-v126 hidden';
      document.body.appendChild(modal);
    }

    return modal;
  }

  window.closeGroupModalV126 = function(){
    const modal = document.getElementById('groupModalV126');
    if(modal) modal.classList.add('hidden');
  };

  window.openCreateGroupV126 = function(){
    selectedMembersV126 = [];

    const modal = ensureGroupModalV126();

    modal.innerHTML = `
      <section class="group-card-v126">
        <div class="group-head-v126">
          <div>
            <p>DM Group</p>
            <h2>Create Group</h2>
            <span>Group chats will appear inside your normal DM list.</span>
          </div>
          <button type="button" onclick="closeGroupModalV126()">×</button>
        </div>

        <label class="group-field-v126">
          <span>Group name</span>
          <input id="groupNameV126" maxlength="40" placeholder="Example: Class Team">
        </label>

        <div class="group-field-v126">
          <span>Search profiles / usernames</span>
          <div class="member-search-row-v126">
            <input id="groupMemberSearchV126" placeholder="Search username or profile name">
            <button type="button" onclick="addManualMemberV126()">Add Manual</button>
          </div>
          <div id="memberSearchResultsV126" class="member-results-v126"></div>
        </div>

        <div id="selectedMembersV126" class="selected-members-v126"></div>

        <div class="group-options-v126">
          <label>
            <input id="adminOnlyV126" type="checkbox">
            <div>
              <b>Only admin can send messages</b>
              <small>Members can read. Only admin posts updates.</small>
            </div>
          </label>

          <label>
            <input id="inviteRequiredV126" type="checkbox" checked>
            <div>
              <b>Invite link required</b>
              <small>People join through invite message/link.</small>
            </div>
          </label>

          <label>
            <input id="openJoinV126" type="checkbox">
            <div>
              <b>Open join</b>
              <small>People can join by themselves without invite link.</small>
            </div>
          </label>
        </div>

        <div class="group-actions-v126">
          <button type="button" class="ghost-v126" onclick="closeGroupModalV126()">Cancel</button>
          <button type="button" class="primary-v126" onclick="createGroupFromModalV126()">Create Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
    renderSelectedMembersV126();

    setTimeout(() => {
      const input = document.getElementById('groupNameV126');
      if(input) input.focus();

      const search = document.getElementById('groupMemberSearchV126');
      if(search){
        search.addEventListener('input', function(){
          clearTimeout(searchTimerV126);
          searchTimerV126 = setTimeout(updateMemberSearchResultsV126, 160);
        });
      }

      updateMemberSearchResultsV126();
    }, 80);
  };

  window.createGroupFromModalV126 = function(){
    const name = safeV126(document.getElementById('groupNameV126')?.value || '', 40);

    if(!name){
      if(typeof toast === 'function') toast('Enter group name');
      return;
    }

    const me = usernameV126();

    const members = [
      me,
      ...selectedMembersV126.map(u => u.username)
    ].filter((value, index, arr) => {
      return value && arr.findIndex(x => x.toLowerCase() === value.toLowerCase()) === index;
    });

    const adminOnly = !!document.getElementById('adminOnlyV126')?.checked;
    const openJoin = !!document.getElementById('openJoinV126')?.checked;
    const inviteRequired = openJoin ? false : !!document.getElementById('inviteRequiredV126')?.checked;

    const group = {
      id: 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
      name,
      adminId: userIdV126(),
      adminUsername: me,
      members,
      adminOnly,
      openJoin,
      inviteRequired,
      messages: [],
      createdAt: new Date().toISOString()
    };

    const groups = loadGroupsV126();
    groups.unshift(group);
    saveGroupsV126(groups);

    activeGroupIdV126 = group.id;
    window.closeGroupModalV126();

    renderDmGroupsV126();
    openGroupDmV126(group.id);

    if(typeof toast === 'function') toast('Group created in DM');
  };

  function injectDmThreeDotMenuV126(){
    const root = messagingRootV126();
    if(!root) return;

    if(root.querySelector('#dmThreeDotV126')) return;

    const host =
      root.querySelector('.topbar') ||
      root.querySelector('.messages-header') ||
      root.querySelector('.chat-header') ||
      root.querySelector('.search-only-topbar-v63') ||
      root.firstElementChild ||
      root;

    const wrap = document.createElement('div');
    wrap.id = 'dmThreeDotV126';
    wrap.className = 'dm-three-wrap-v126';
    wrap.innerHTML = `
      <button type="button" class="dm-three-btn-v126" onclick="toggleDmMenuV126(event)">⋯</button>
      <div id="dmMenuV126" class="dm-menu-v126 hidden">
        <button type="button" onclick="openCreateGroupV126(); closeDmMenuV126();">＋ Create Group</button>
        <button type="button" onclick="renderDmGroupsV126(); closeDmMenuV126();">↻ Refresh Groups</button>
      </div>
    `;

    if(host === root){
      root.insertBefore(wrap, root.firstChild);
    }else{
      host.appendChild(wrap);
      host.classList.add('dm-header-host-v126');
    }
  }

  window.toggleDmMenuV126 = function(event){
    if(event) event.stopPropagation();
    const menu = document.getElementById('dmMenuV126');
    if(menu) menu.classList.toggle('hidden');
  };

  window.closeDmMenuV126 = function(){
    const menu = document.getElementById('dmMenuV126');
    if(menu) menu.classList.add('hidden');
  };

  function renderDmGroupsV126(){
    const root = messagingRootV126();
    if(!root) return;

    hideOldSeparateGroupsV126();

    const groups = loadGroupsV126();
    let list = findDmListV126(root);

    let groupsWrap = root.querySelector('#dmGroupsWrapV126');

    if(!groupsWrap){
      groupsWrap = document.createElement('div');
      groupsWrap.id = 'dmGroupsWrapV126';
      groupsWrap.className = 'dm-groups-wrap-v126';

      if(list){
        list.insertBefore(groupsWrap, list.firstChild);
      }else{
        const toolbar = root.querySelector('#dmThreeDotV126') || root.querySelector('.topbar') || root.firstChild;
        if(toolbar && toolbar.parentElement === root){
          root.insertBefore(groupsWrap, toolbar.nextSibling);
        }else{
          root.insertBefore(groupsWrap, root.firstChild);
        }
      }
    }

    if(!groups.length){
      groupsWrap.innerHTML = '';
      return;
    }

    groupsWrap.innerHTML = groups.map(group => {
      const last = group.messages && group.messages.length ? group.messages[group.messages.length - 1] : null;
      return `
        <button type="button" class="dm-group-row-v126 ${activeGroupIdV126 === group.id ? 'active' : ''}" onclick="openGroupDmV126('${group.id}')">
          <span>${safeV126(group.name,1).toUpperCase()}</span>
          <div>
            <b>${group.name}</b>
            <small>${last ? `${last.sender}: ${last.text}` : `${group.members.length} members • ${group.adminOnly ? 'Admin only' : 'Everyone can message'}`}</small>
          </div>
        </button>
      `;
    }).join('');
  }

  window.openGroupDmV126 = function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    activeGroupIdV126 = group.id;

    const root = messagingRootV126();
    if(!root) return;

    renderDmGroupsV126();

    const chatArea = findChatAreaV126(root);

    let view = root.querySelector('#groupDmViewV126');

    if(!view){
      view = document.createElement('section');
      view.id = 'groupDmViewV126';
      view.className = 'group-dm-view-v126 card';

      if(chatArea && chatArea !== root){
        chatArea.innerHTML = '';
        chatArea.appendChild(view);
      }else{
        root.appendChild(view);
      }
    }

    const isAdmin = String(group.adminId) === userIdV126() || group.adminUsername === usernameV126();
    const canSend = !group.adminOnly || isAdmin;

    view.innerHTML = `
      <div class="group-dm-head-v126">
        <div>
          <p>Group DM</p>
          <h3>${group.name}</h3>
          <span>${group.members.length} members • ${group.openJoin ? 'Open join' : group.inviteRequired ? 'Invite link required' : 'Private'}</span>
        </div>

        <div class="group-dm-actions-v126">
          <button type="button" onclick="showInviteLinkV126('${group.id}')">Invite</button>
          ${isAdmin ? `<button type="button" onclick="manageGroupV126('${group.id}')">Manage</button>` : ''}
          <button type="button" onclick="exitGroupV126('${group.id}')">Exit</button>
        </div>
      </div>

      <div class="group-rule-note-v126">
        ${group.adminOnly ? '🔒 Only admin can send messages.' : '💬 Everyone can send messages.'}
        ${group.openJoin ? ' People can join without invite.' : group.inviteRequired ? ' Invite link required.' : ''}
      </div>

      <div id="groupDmMessagesV126" class="group-dm-messages-v126">
        ${
          group.messages && group.messages.length
          ? group.messages.map(msg => `
              <div class="group-dm-msg-v126 ${msg.sender === usernameV126() ? 'mine' : ''}">
                <b>${msg.sender}</b>
                <p>${msg.text}</p>
                <small>${new Date(msg.time).toLocaleString()}</small>
              </div>
            `).join('')
          : `<div class="group-dm-empty-v126">No group messages yet.</div>`
        }
      </div>

      <div class="group-dm-send-v126 ${canSend ? '' : 'disabled'}">
        <input id="groupDmInputV126" ${canSend ? '' : 'disabled'} placeholder="${canSend ? 'Message this group...' : 'Only admin can send messages'}">
        <button type="button" ${canSend ? `onclick="sendGroupDmV126('${group.id}')"` : 'disabled'}>Send</button>
      </div>
    `;

    setTimeout(() => {
      const box = document.getElementById('groupDmMessagesV126');
      if(box) box.scrollTop = box.scrollHeight;
      const input = document.getElementById('groupDmInputV126');
      if(input && canSend) input.focus();
    }, 80);
  };

  window.sendGroupDmV126 = function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    const isAdmin = String(group.adminId) === userIdV126() || group.adminUsername === usernameV126();

    if(group.adminOnly && !isAdmin){
      if(typeof toast === 'function') toast('Only admin can send messages');
      return;
    }

    const input = document.getElementById('groupDmInputV126');
    const text = safeV126(input?.value || '', 800);
    if(!text) return;

    group.messages = group.messages || [];
    group.messages.push({
      id: 'msg_' + Date.now(),
      sender: usernameV126(),
      senderId: userIdV126(),
      text,
      time: new Date().toISOString()
    });

    saveGroupV126(group);
    if(input) input.value = '';

    window.openGroupDmV126(group.id);
  };

  window.showInviteLinkV126 = async function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    const link = inviteLinkV126(group);
    const modal = ensureGroupModalV126();

    modal.innerHTML = `
      <section class="group-card-v126 group-invite-card-v126">
        <div class="group-head-v126">
          <div>
            <p>Invite Link</p>
            <h2>${group.name}</h2>
            <span>Share this link through DM or anywhere.</span>
          </div>
          <button type="button" onclick="closeGroupModalV126()">×</button>
        </div>

        <div class="invite-link-box-v126">${link}</div>

        <div class="group-actions-v126">
          <button type="button" class="ghost-v126" onclick="closeGroupModalV126()">Close</button>
          <button type="button" class="primary-v126" onclick="copyInviteLinkV126('${group.id}')">Copy Link</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.copyInviteLinkV126 = async function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    const link = inviteLinkV126(group);

    try{
      await navigator.clipboard.writeText(link);
      if(typeof toast === 'function') toast('Invite link copied');
    }catch{
      prompt('Copy invite link:', link);
    }
  };

  window.manageGroupV126 = function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    selectedMembersV126 = group.members
      .filter(m => m.toLowerCase() !== usernameV126().toLowerCase())
      .map(m => ({username:m, displayName:m}));

    const modal = ensureGroupModalV126();

    modal.innerHTML = `
      <section class="group-card-v126">
        <div class="group-head-v126">
          <div>
            <p>Admin Manage</p>
            <h2>${group.name}</h2>
            <span>Add/remove members and control group permissions.</span>
          </div>
          <button type="button" onclick="closeGroupModalV126()">×</button>
        </div>

        <label class="group-field-v126">
          <span>Group name</span>
          <input id="groupNameV126" maxlength="40" value="${group.name}">
        </label>

        <div class="group-field-v126">
          <span>Search profiles / usernames</span>
          <div class="member-search-row-v126">
            <input id="groupMemberSearchV126" placeholder="Search username or profile name">
            <button type="button" onclick="addManualMemberV126()">Add Manual</button>
          </div>
          <div id="memberSearchResultsV126" class="member-results-v126"></div>
        </div>

        <div id="selectedMembersV126" class="selected-members-v126"></div>

        <div class="group-options-v126">
          <label>
            <input id="adminOnlyV126" type="checkbox" ${group.adminOnly ? 'checked' : ''}>
            <div>
              <b>Only admin can send messages</b>
              <small>Members can read. Only admin posts updates.</small>
            </div>
          </label>

          <label>
            <input id="inviteRequiredV126" type="checkbox" ${group.inviteRequired ? 'checked' : ''}>
            <div>
              <b>Invite link required</b>
              <small>People join through invite message/link.</small>
            </div>
          </label>

          <label>
            <input id="openJoinV126" type="checkbox" ${group.openJoin ? 'checked' : ''}>
            <div>
              <b>Open join</b>
              <small>People can join by themselves without invite link.</small>
            </div>
          </label>
        </div>

        <div class="group-actions-v126">
          <button type="button" class="ghost-v126" onclick="closeGroupModalV126()">Cancel</button>
          <button type="button" class="primary-v126" onclick="saveManagedGroupV126('${group.id}')">Save Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
    renderSelectedMembersV126();

    setTimeout(() => {
      const search = document.getElementById('groupMemberSearchV126');
      if(search){
        search.addEventListener('input', function(){
          clearTimeout(searchTimerV126);
          searchTimerV126 = setTimeout(updateMemberSearchResultsV126, 160);
        });
      }
      updateMemberSearchResultsV126();
    }, 100);
  };

  window.saveManagedGroupV126 = function(groupId){
    const group = getGroupV126(groupId);
    if(!group) return;

    group.name = safeV126(document.getElementById('groupNameV126')?.value || group.name, 40);
    group.members = [
      usernameV126(),
      ...selectedMembersV126.map(u => u.username)
    ].filter((value,index,arr) => value && arr.findIndex(x => x.toLowerCase() === value.toLowerCase()) === index);

    group.adminOnly = !!document.getElementById('adminOnlyV126')?.checked;
    group.openJoin = !!document.getElementById('openJoinV126')?.checked;
    group.inviteRequired = group.openJoin ? false : !!document.getElementById('inviteRequiredV126')?.checked;

    saveGroupV126(group);
    window.closeGroupModalV126();
    renderDmGroupsV126();
    window.openGroupDmV126(group.id);

    if(typeof toast === 'function') toast('Group updated');
  };

  window.exitGroupV126 = function(groupId){
    const groups = loadGroupsV126();
    const group = groups.find(g => g.id === groupId);
    if(!group) return;

    const me = usernameV126();
    const isAdmin = group.adminUsername === me || String(group.adminId) === userIdV126();

    if(isAdmin){
      if(!confirm('You are admin. Delete this local group?')) return;
      saveGroupsV126(groups.filter(g => g.id !== groupId));
    }else{
      group.members = group.members.filter(m => m.toLowerCase() !== me.toLowerCase());
      saveGroupV126(group);
    }

    activeGroupIdV126 = null;
    renderDmGroupsV126();

    const view = document.getElementById('groupDmViewV126');
    if(view) view.remove();

    if(typeof toast === 'function') toast('Exited group');
  };

  function handleInviteHashV126(){
    const match = String(location.hash || '').match(/join-group=([^&]+)/);
    if(!match) return;

    const groupId = decodeURIComponent(match[1]);
    const group = getGroupV126(groupId);
    if(!group) return;

    const me = usernameV126();

    if(!group.members.some(m => m.toLowerCase() === me.toLowerCase())){
      if(group.openJoin || group.inviteRequired){
        group.members.push(me);
        saveGroupV126(group);
        if(typeof toast === 'function') toast('Joined group');
      }
    }

    if(typeof switchView === 'function'){
      try{ switchView('messages'); }catch{}
    }

    setTimeout(() => {
      injectDmThreeDotMenuV126();
      renderDmGroupsV126();
      window.openGroupDmV126(group.id);
    }, 700);
  }

  function relabelClipsEverywhereV126(){
    const root = document.getElementById('mainContent') || document.body;

    root.querySelectorAll('button, span, small, b, strong, h1, h2, h3, p, label').forEach(el => {
      if(el.closest('textarea,input,.post-content,.caption,.message-text')) return;

      const text = String(el.textContent || '').trim();
      const lower = text.toLowerCase();

      if(lower === 'video') el.textContent = 'Clip';
      else if(lower === 'videos') el.textContent = 'Clips';
      else if(lower === 'video post') el.textContent = 'Clip';
      else if(lower === 'video posts') el.textContent = 'Clips';
      else if(lower === 'short video') el.textContent = 'Clip';
      else if(lower === 'short videos') el.textContent = 'Clips';
      else if(lower === 'video supported') el.textContent = 'Clips supported';
      else if(lower === 'total videos') el.textContent = 'Total Clips';
    });
  }

  document.addEventListener('click', function(event){
    if(!event.target.closest('#dmThreeDotV126')){
      window.closeDmMenuV126();
    }

    const modal = document.getElementById('groupModalV126');
    if(modal && !modal.classList.contains('hidden') && event.target === modal){
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') window.closeGroupModalV126();

    if(event.key === 'Enter' && document.activeElement?.id === 'groupDmInputV126'){
      if(activeGroupIdV126) window.sendGroupDmV126(activeGroupIdV126);
    }
  });

  function runV126(){
    hideOldSeparateGroupsV126();
    relabelClipsEverywhereV126();

    if(isMessagingPageV126()){
      injectDmThreeDotMenuV126();
      renderDmGroupsV126();
    }

    handleInviteHashV126();
  }

  setInterval(runV126, 1000);
  setTimeout(runV126, 250);
  setTimeout(runV126, 900);
  setTimeout(runV126, 2200);
})();


/* =========================================================
   V127 VERTICAL 3-DOT BESIDE OPEN BUTTON
   - Moves group menu from header to username chat row.
   - Uses vertical dots: ⋮
   - Places it beside the Open button near "Enter username to chat".
   - Keeps V126 group functions.
   ========================================================= */

(function(){
  function cleanV127(value=''){
    return String(value || '').replace(/\s+/g,' ').trim().toLowerCase();
  }

  function isMessagingV127(){
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return false;

    const text = cleanV127(main.textContent || '');
    return (
      text.includes('enter username') ||
      text.includes('username to chat') ||
      text.includes('message') ||
      text.includes('conversation') ||
      main.querySelector('.messages-list,.chat-list,.conversation-list,.dm-list,.message-thread,.chat-panel')
    );
  }

  function findUsernameChatInputV127(){
    const inputs = Array.from(document.querySelectorAll('input'));

    return inputs.find(input => {
      const ph = cleanV127(input.getAttribute('placeholder') || '');
      const aria = cleanV127(input.getAttribute('aria-label') || '');
      const val = cleanV127(input.value || '');

      return (
        ph.includes('username') ||
        ph.includes('enter username') ||
        ph.includes('chat') ||
        aria.includes('username') ||
        aria.includes('chat') ||
        val.includes('@')
      );
    });
  }

  function findOpenButtonNearInputV127(input){
    if(!input) return null;

    const candidates = [];

    let node = input.parentElement;
    for(let i = 0; i < 5 && node; i++){
      candidates.push(...Array.from(node.querySelectorAll('button')));
      node = node.parentElement;
    }

    return candidates.find(btn => {
      const text = cleanV127(btn.textContent || btn.title || btn.getAttribute('aria-label') || '');
      return (
        text === 'open' ||
        text.includes('open') ||
        text.includes('chat') ||
        text.includes('start')
      );
    }) || candidates[0] || null;
  }

  function createMenuV127(){
    let wrap = document.getElementById('dmThreeDotV127');

    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'dmThreeDotV127';
      wrap.className = 'dm-three-wrap-v127';
      wrap.innerHTML = `
        <button type="button" class="dm-three-btn-v127" onclick="toggleDmMenuV127(event)" title="More options" aria-label="More options">⋮</button>
        <div id="dmMenuV127" class="dm-menu-v127 hidden">
          <button type="button" onclick="openCreateGroupV126(); closeDmMenuV127();">＋ Create Group</button>
          <button type="button" onclick="renderDmGroupsV126 && renderDmGroupsV126(); closeDmMenuV127();">↻ Refresh Groups</button>
        </div>
      `;
    }

    return wrap;
  }

  window.toggleDmMenuV127 = function(event){
    if(event) event.stopPropagation();

    const menu = document.getElementById('dmMenuV127');
    if(menu) menu.classList.toggle('hidden');
  };

  window.closeDmMenuV127 = function(){
    const menu = document.getElementById('dmMenuV127');
    if(menu) menu.classList.add('hidden');
  };

  function placeMenuBesideOpenV127(){
    if(!isMessagingV127()) return;

    // Hide old V126 header dots to avoid duplicate.
    const old = document.getElementById('dmThreeDotV126');
    if(old) old.classList.add('hide-old-dots-v127');

    const input = findUsernameChatInputV127();
    const openBtn = findOpenButtonNearInputV127(input);

    if(!input || !openBtn) return;

    const wrap = createMenuV127();

    const row =
      openBtn.parentElement ||
      input.parentElement ||
      openBtn.closest('div,form,section');

    if(!row) return;

    row.classList.add('username-chat-row-v127');

    if(wrap.parentElement !== row || openBtn.nextSibling !== wrap){
      openBtn.insertAdjacentElement('afterend', wrap);
    }
  }

  document.addEventListener('click', function(event){
    if(!event.target.closest('#dmThreeDotV127')){
      window.closeDmMenuV127();
    }
  });

  function runV127(){
    placeMenuBesideOpenV127();
  }

  setInterval(runV127, 800);
  setTimeout(runV127, 200);
  setTimeout(runV127, 900);
  setTimeout(runV127, 2200);
})();


/* =========================================================
   V128 GROUP JOIN LINK + NO BLINK + MEMBER VIEW
   Safe add-on on top of V127:
   - Adds "Join Group with Invite Link" in vertical 3-dot menu.
   - Stops group DM row/icon blinking by using stable rows.
   - Clicking group name shows group members with Admin/User authority.
   - Keeps groups inside normal DM/Messaging.
   ========================================================= */

(function(){
  const GROUPS_KEY_V128 = 'reconnect_groups_v125';
  let activeGroupIdV128 = null;
  let lastGroupsHashV128 = '';

  function cleanV128(value=''){
    return String(value || '').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
  }

  function currentUserV128(){
    try { return window.currentUserData || currentUserData || {}; }
    catch { return {}; }
  }

  function usernameV128(){
    const u = currentUserV128();
    return u.username || u.displayName || 'you';
  }

  function userIdV128(){
    const u = currentUserV128();
    return String(u._id || u.id || u.username || 'me');
  }

  function loadGroupsV128(){
    try{
      const groups = JSON.parse(localStorage.getItem(GROUPS_KEY_V128) || '[]');
      return Array.isArray(groups) ? groups : [];
    }catch{
      return [];
    }
  }

  function saveGroupsV128(groups){
    localStorage.setItem(GROUPS_KEY_V128, JSON.stringify(groups));
  }

  function getGroupV128(id){
    return loadGroupsV128().find(g => g.id === id);
  }

  function saveGroupV128(group){
    const groups = loadGroupsV128();
    const index = groups.findIndex(g => g.id === group.id);
    if(index >= 0) groups[index] = group;
    else groups.unshift(group);
    saveGroupsV128(groups);
  }

  function inviteLinkV128(group){
    const url = new URL(location.href);
    url.hash = `join-group=${encodeURIComponent(group.id)}`;
    return url.toString();
  }

  function extractGroupIdFromInviteV128(value=''){
    value = cleanV128(value);

    if(!value) return '';

    try{
      const url = new URL(value, location.origin);
      const hash = url.hash || '';
      const match = hash.match(/join-group=([^&]+)/);
      if(match) return decodeURIComponent(match[1]);
    }catch{}

    const direct = value.match(/join-group=([^&]+)/);
    if(direct) return decodeURIComponent(direct[1]);

    if(value.startsWith('grp_')) return value;

    return '';
  }

  function messagingRootV128(){
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return null;

    const text = String(main.textContent || '').toLowerCase();

    const hasMessaging =
      text.includes('enter username') ||
      text.includes('username to chat') ||
      text.includes('message') ||
      text.includes('conversation') ||
      main.querySelector('.messages-list,.chat-list,.conversation-list,.dm-list,.message-thread,.chat-panel');

    return hasMessaging ? main : null;
  }

  function findDmListV128(root){
    return (
      root.querySelector('.messages-list') ||
      root.querySelector('.chat-list') ||
      root.querySelector('.conversation-list') ||
      root.querySelector('.dm-list') ||
      root.querySelector('.conversation-sidebar') ||
      root.querySelector('.messages-sidebar')
    );
  }

  function findChatAreaV128(root){
    return (
      root.querySelector('.chat-panel') ||
      root.querySelector('.message-thread') ||
      root.querySelector('.conversation-panel') ||
      root.querySelector('.chat-messages')?.parentElement ||
      root
    );
  }

  function memberAvatarV128(name='?'){
    const letter = cleanV128(name).slice(0,1).toUpperCase() || '?';
    return `<span class="member-avatar-v128">${letter}</span>`;
  }

  function hideBlinkingV126RowsV128(){
    // Old V126 rows are re-rendered frequently, which looks like blinking.
    document.querySelectorAll('#dmGroupsWrapV126,#groupsPanelV125,#groupChatToolbarV125').forEach(el => {
      el.classList.add('hide-blinking-groups-v128');
    });
  }

  function groupsHashV128(groups){
    return JSON.stringify(groups.map(g => ({
      id: g.id,
      name: g.name,
      members: g.members?.length || 0,
      messages: g.messages?.length || 0,
      last: g.messages?.length ? g.messages[g.messages.length - 1]?.text : '',
      adminOnly: !!g.adminOnly,
      openJoin: !!g.openJoin,
      inviteRequired: !!g.inviteRequired
    })));
  }

  function ensureStableGroupsWrapV128(){
    const root = messagingRootV128();
    if(!root) return null;

    let wrap = root.querySelector('#dmGroupsWrapV128');

    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'dmGroupsWrapV128';
      wrap.className = 'dm-groups-wrap-v128';

      const list = findDmListV128(root);
      if(list){
        list.insertBefore(wrap, list.firstChild);
      }else{
        const menu = root.querySelector('#dmThreeDotV127') || root.querySelector('#dmThreeDotV126') || root.firstChild;
        if(menu && menu.parentElement === root){
          root.insertBefore(wrap, menu.nextSibling);
        }else{
          root.insertBefore(wrap, root.firstChild);
        }
      }
    }

    return wrap;
  }

  function renderStableGroupsV128(force=false){
    const root = messagingRootV128();
    if(!root) return;

    hideBlinkingV126RowsV128();

    const groups = loadGroupsV128();
    const hash = groupsHashV128(groups);

    if(!force && hash === lastGroupsHashV128){
      // Only update active class without redrawing. This prevents blink.
      document.querySelectorAll('.dm-group-row-v128').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.groupId === activeGroupIdV128);
      });
      return;
    }

    lastGroupsHashV128 = hash;

    const wrap = ensureStableGroupsWrapV128();
    if(!wrap) return;

    if(!groups.length){
      wrap.innerHTML = '';
      return;
    }

    wrap.innerHTML = groups.map(group => {
      const last = group.messages && group.messages.length ? group.messages[group.messages.length - 1] : null;
      const subtitle = last
        ? `${last.sender}: ${last.text}`
        : `${(group.members || []).length} members • ${group.adminOnly ? 'Admin only' : 'Everyone can message'}`;

      return `
        <button type="button" data-group-id="${group.id}" class="dm-group-row-v128 ${activeGroupIdV128 === group.id ? 'active' : ''}" onclick="openGroupDmV128('${group.id}')">
          <span>${cleanV128(group.name).slice(0,1).toUpperCase()}</span>
          <div>
            <b>${group.name}</b>
            <small>${subtitle}</small>
          </div>
        </button>
      `;
    }).join('');
  }

  window.openGroupDmV128 = function(groupId){
    const group = getGroupV128(groupId);
    if(!group) return;

    activeGroupIdV128 = group.id;
    renderStableGroupsV128(true);

    const root = messagingRootV128();
    if(!root) return;

    // Hide old group view to avoid duplicate.
    const old = root.querySelector('#groupDmViewV126');
    if(old) old.classList.add('hide-blinking-groups-v128');

    const chatArea = findChatAreaV128(root);

    let view = root.querySelector('#groupDmViewV128');
    if(!view){
      view = document.createElement('section');
      view.id = 'groupDmViewV128';
      view.className = 'group-dm-view-v128 card';

      if(chatArea && chatArea !== root){
        chatArea.innerHTML = '';
        chatArea.appendChild(view);
      }else{
        root.appendChild(view);
      }
    }

    const isAdmin = String(group.adminId) === userIdV128() || group.adminUsername === usernameV128();
    const canSend = !group.adminOnly || isAdmin;

    view.innerHTML = `
      <div class="group-dm-head-v128">
        <button type="button" class="group-title-btn-v128" onclick="showGroupMembersV128('${group.id}')">
          <p>Group DM</p>
          <h3>${group.name}</h3>
          <span>${(group.members || []).length} members • click to see members</span>
        </button>

        <div class="group-dm-actions-v128">
          <button type="button" onclick="showInviteLinkV128('${group.id}')">Invite</button>
          ${isAdmin ? `<button type="button" onclick="if(typeof manageGroupV126==='function') manageGroupV126('${group.id}'); else showGroupMembersV128('${group.id}')">Manage</button>` : ''}
          <button type="button" onclick="if(typeof exitGroupV126==='function') exitGroupV126('${group.id}')">Exit</button>
        </div>
      </div>

      <div class="group-rule-note-v128">
        ${group.adminOnly ? '🔒 Only admin can send messages.' : '💬 Everyone can send messages.'}
        ${group.openJoin ? ' People can join without invite.' : group.inviteRequired ? ' Invite link required.' : ''}
      </div>

      <div id="groupDmMessagesV128" class="group-dm-messages-v128">
        ${
          group.messages && group.messages.length
          ? group.messages.map(msg => `
            <div class="group-dm-msg-v128 ${msg.sender === usernameV128() ? 'mine' : ''}">
              <b>${msg.sender}</b>
              <p>${msg.text}</p>
              <small>${new Date(msg.time).toLocaleString()}</small>
            </div>
          `).join('')
          : `<div class="group-dm-empty-v128">No group messages yet.</div>`
        }
      </div>

      <div class="group-dm-send-v128 ${canSend ? '' : 'disabled'}">
        <input id="groupDmInputV128" ${canSend ? '' : 'disabled'} placeholder="${canSend ? 'Message this group...' : 'Only admin can send messages'}">
        <button type="button" ${canSend ? `onclick="sendGroupDmV128('${group.id}')"` : 'disabled'}>Send</button>
      </div>
    `;

    setTimeout(() => {
      const box = document.getElementById('groupDmMessagesV128');
      if(box) box.scrollTop = box.scrollHeight;

      const input = document.getElementById('groupDmInputV128');
      if(input && canSend) input.focus();
    }, 80);
  };

  window.sendGroupDmV128 = function(groupId){
    const group = getGroupV128(groupId);
    if(!group) return;

    const isAdmin = String(group.adminId) === userIdV128() || group.adminUsername === usernameV128();

    if(group.adminOnly && !isAdmin){
      if(typeof toast === 'function') toast('Only admin can send messages');
      return;
    }

    const input = document.getElementById('groupDmInputV128');
    const text = cleanV128(input?.value || '').slice(0, 800);

    if(!text) return;

    group.messages = group.messages || [];
    group.messages.push({
      id: 'msg_' + Date.now(),
      sender: usernameV128(),
      senderId: userIdV128(),
      text,
      time: new Date().toISOString()
    });

    saveGroupV128(group);

    if(input) input.value = '';
    window.openGroupDmV128(group.id);
  };

  function ensureModalV128(){
    let modal = document.getElementById('groupModalV128');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV128';
      modal.className = 'group-modal-v128 hidden';
      document.body.appendChild(modal);
    }

    return modal;
  }

  window.closeGroupModalV128 = function(){
    const modal = document.getElementById('groupModalV128');
    if(modal) modal.classList.add('hidden');
  };

  window.openJoinGroupByLinkV128 = function(){
    const modal = ensureModalV128();

    modal.innerHTML = `
      <section class="group-card-v128">
        <div class="group-head-v128">
          <div>
            <p>Join Group</p>
            <h2>Join with Invite Link</h2>
            <span>Paste the invite link or group code here.</span>
          </div>
          <button type="button" onclick="closeGroupModalV128()">×</button>
        </div>

        <label class="group-field-v128">
          <span>Invite link / group code</span>
          <input id="joinGroupLinkInputV128" placeholder="Paste invite link or grp_ code">
        </label>

        <div class="group-actions-v128">
          <button type="button" class="ghost-v128" onclick="closeGroupModalV128()">Cancel</button>
          <button type="button" class="primary-v128" onclick="joinGroupFromLinkV128()">Join Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      const input = document.getElementById('joinGroupLinkInputV128');
      if(input) input.focus();
    }, 80);
  };

  window.joinGroupFromLinkV128 = function(){
    const input = document.getElementById('joinGroupLinkInputV128');
    const groupId = extractGroupIdFromInviteV128(input?.value || '');

    if(!groupId){
      if(typeof toast === 'function') toast('Invalid invite link');
      return;
    }

    const group = getGroupV128(groupId);

    if(!group){
      if(typeof toast === 'function') toast('Group not found on this device');
      return;
    }

    const me = usernameV128();

    if(!group.members.some(m => String(m).toLowerCase() === me.toLowerCase())){
      if(group.openJoin || group.inviteRequired){
        group.members.push(me);
        saveGroupV128(group);
      }
    }

    activeGroupIdV128 = group.id;
    window.closeGroupModalV128();
    renderStableGroupsV128(true);
    window.openGroupDmV128(group.id);

    if(typeof toast === 'function') toast('Joined group');
  };

  window.showInviteLinkV128 = async function(groupId){
    const group = getGroupV128(groupId);
    if(!group) return;

    const link = inviteLinkV128(group);
    const modal = ensureModalV128();

    modal.innerHTML = `
      <section class="group-card-v128 group-invite-card-v128">
        <div class="group-head-v128">
          <div>
            <p>Invite Link</p>
            <h2>${group.name}</h2>
            <span>Share this link through DM or anywhere.</span>
          </div>
          <button type="button" onclick="closeGroupModalV128()">×</button>
        </div>

        <div class="invite-link-box-v128">${link}</div>

        <div class="group-actions-v128">
          <button type="button" class="ghost-v128" onclick="closeGroupModalV128()">Close</button>
          <button type="button" class="primary-v128" onclick="copyInviteLinkV128('${group.id}')">Copy Link</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.copyInviteLinkV128 = async function(groupId){
    const group = getGroupV128(groupId);
    if(!group) return;

    const link = inviteLinkV128(group);

    try{
      await navigator.clipboard.writeText(link);
      if(typeof toast === 'function') toast('Invite link copied');
    }catch{
      prompt('Copy invite link:', link);
    }
  };

  window.showGroupMembersV128 = function(groupId){
    const group = getGroupV128(groupId);
    if(!group) return;

    const modal = ensureModalV128();

    const members = group.members || [];
    const adminName = group.adminUsername || '';

    modal.innerHTML = `
      <section class="group-card-v128">
        <div class="group-head-v128">
          <div>
            <p>Group Members</p>
            <h2>${group.name}</h2>
            <span>${members.length} members with authority role.</span>
          </div>
          <button type="button" onclick="closeGroupModalV128()">×</button>
        </div>

        <div class="members-list-v128">
          ${
            members.map(member => {
              const isAdmin = String(member).toLowerCase() === String(adminName).toLowerCase();
              return `
                <div class="member-row-v128">
                  ${memberAvatarV128(member)}
                  <div>
                    <b>@${member}</b>
                    <small>${isAdmin ? 'Group creator / controller' : 'Can participate according to group rules'}</small>
                  </div>
                  <span class="${isAdmin ? 'admin' : ''}">${isAdmin ? 'Admin' : 'User'}</span>
                </div>
              `;
            }).join('')
          }
        </div>

        <div class="group-actions-v128">
          <button type="button" class="ghost-v128" onclick="closeGroupModalV128()">Close</button>
          <button type="button" class="primary-v128" onclick="showInviteLinkV128('${group.id}')">Invite</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  function patchThreeDotMenuV128(){
    const menu = document.getElementById('dmMenuV127') || document.getElementById('dmMenuV126');
    if(!menu || menu.__v128Patched) return;

    menu.__v128Patched = true;

    const joinBtn = document.createElement('button');
    joinBtn.type = 'button';
    joinBtn.textContent = '🔗 Join Group with Invite Link';
    joinBtn.onclick = function(){
      if(typeof closeDmMenuV127 === 'function') closeDmMenuV127();
      if(typeof closeDmMenuV126 === 'function') closeDmMenuV126();
      window.openJoinGroupByLinkV128();
    };

    menu.appendChild(joinBtn);
  }

  function handleHashInviteV128(){
    const groupId = extractGroupIdFromInviteV128(location.hash || '');
    if(!groupId) return;

    const group = getGroupV128(groupId);
    if(!group) return;

    const me = usernameV128();

    if(!group.members.some(m => String(m).toLowerCase() === me.toLowerCase())){
      if(group.openJoin || group.inviteRequired){
        group.members.push(me);
        saveGroupV128(group);
      }
    }

    activeGroupIdV128 = group.id;
    renderStableGroupsV128(true);

    setTimeout(() => window.openGroupDmV128(group.id), 500);
  }

  document.addEventListener('click', function(event){
    const modal = document.getElementById('groupModalV128');
    if(modal && !modal.classList.contains('hidden') && event.target === modal){
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') window.closeGroupModalV128();

    if(event.key === 'Enter' && document.activeElement?.id === 'joinGroupLinkInputV128'){
      event.preventDefault();
      window.joinGroupFromLinkV128();
    }

    if(event.key === 'Enter' && document.activeElement?.id === 'groupDmInputV128'){
      event.preventDefault();
      if(activeGroupIdV128) window.sendGroupDmV128(activeGroupIdV128);
    }
  });

  function runV128(){
    if(messagingRootV128()){
      patchThreeDotMenuV128();
      renderStableGroupsV128(false);
    }

    hideBlinkingV126RowsV128();
    handleHashInviteV128();
  }

  setInterval(runV128, 1200);
  setTimeout(runV128, 250);
  setTimeout(runV128, 900);
  setTimeout(runV128, 2200);
})();


/* =========================================================
   V129 HARD STOP GROUP BLINK
   Stronger fix:
   - Hides/removes old interval-rendered group rows immediately.
   - Creates one stable group list inside DM.
   - Updates only when group data changes or user clicks refresh.
   - Keeps V128 join/members/invite functions.
   ========================================================= */

(function(){
  const GROUPS_KEY = 'reconnect_groups_v125';
  let lastStableHashV129 = '';
  let activeGroupIdV129 = null;
  let renderLockV129 = false;

  function cleanV129(v=''){
    return String(v || '').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
  }

  function loadGroupsV129(){
    try{
      const groups = JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
      return Array.isArray(groups) ? groups : [];
    }catch{
      return [];
    }
  }

  function saveGroupsV129(groups){
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  function getUserV129(){
    try { return window.currentUserData || currentUserData || {}; }
    catch { return {}; }
  }

  function usernameV129(){
    const u = getUserV129();
    return u.username || u.displayName || 'you';
  }

  function userIdV129(){
    const u = getUserV129();
    return String(u._id || u.id || u.username || 'me');
  }

  function getGroupV129(id){
    return loadGroupsV129().find(g => g.id === id);
  }

  function saveGroupV129(group){
    const groups = loadGroupsV129();
    const i = groups.findIndex(g => g.id === group.id);
    if(i >= 0) groups[i] = group;
    else groups.unshift(group);
    saveGroupsV129(groups);
  }

  function groupsHashV129(groups){
    return JSON.stringify(groups.map(g => ({
      id: g.id,
      name: g.name,
      members: (g.members || []).join('|'),
      messages: (g.messages || []).length,
      last: (g.messages || []).length ? g.messages[g.messages.length - 1].text : '',
      adminOnly: !!g.adminOnly,
      openJoin: !!g.openJoin,
      inviteRequired: !!g.inviteRequired
    })));
  }

  function messagingRootV129(){
    const main = document.getElementById('mainContent') || document.querySelector('.main');
    if(!main) return null;

    const text = String(main.textContent || '').toLowerCase();

    const isMessaging =
      text.includes('enter username') ||
      text.includes('username to chat') ||
      text.includes('message') ||
      text.includes('conversation') ||
      main.querySelector('.messages-list,.chat-list,.conversation-list,.dm-list,.message-thread,.chat-panel');

    return isMessaging ? main : null;
  }

  function findDmListV129(root){
    return (
      root.querySelector('.messages-list') ||
      root.querySelector('.chat-list') ||
      root.querySelector('.conversation-list') ||
      root.querySelector('.dm-list') ||
      root.querySelector('.conversation-sidebar') ||
      root.querySelector('.messages-sidebar')
    );
  }

  function findChatAreaV129(root){
    return (
      root.querySelector('.chat-panel') ||
      root.querySelector('.message-thread') ||
      root.querySelector('.conversation-panel') ||
      root.querySelector('.chat-messages')?.parentElement ||
      root
    );
  }

  function killOldBlinkRowsV129(){
    const oldSelectors = [
      '#groupChatToolbarV125',
      '#groupsPanelV125',
      '#groupChatViewV125',
      '#dmGroupsWrapV126',
      '#groupDmViewV126',
      '#dmGroupsWrapV128',
      '#groupDmViewV128'
    ];

    oldSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('force-remove-old-groups-v129');
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('opacity','0','important');
        el.style.setProperty('height','0','important');
        el.style.setProperty('max-height','0','important');
        el.style.setProperty('overflow','hidden','important');
      });
    });

    // Also hide old individual group row classes if they escaped parent wrappers.
    document.querySelectorAll('.dm-group-row-v126,.dm-group-row-v128,.group-row-v125').forEach(el => {
      if(!el.closest('#dmGroupsWrapV129')){
        el.classList.add('force-remove-old-groups-v129');
      }
    });
  }

  function ensureWrapV129(){
    const root = messagingRootV129();
    if(!root) return null;

    let wrap = root.querySelector('#dmGroupsWrapV129');
    if(wrap) return wrap;

    wrap = document.createElement('div');
    wrap.id = 'dmGroupsWrapV129';
    wrap.className = 'dm-groups-wrap-v129';

    const list = findDmListV129(root);

    if(list){
      list.insertBefore(wrap, list.firstChild);
    }else{
      const anchor =
        root.querySelector('#dmThreeDotV127') ||
        root.querySelector('#dmThreeDotV126') ||
        root.querySelector('.topbar') ||
        root.firstChild;

      if(anchor && anchor.parentElement === root){
        root.insertBefore(wrap, anchor.nextSibling);
      }else{
        root.insertBefore(wrap, root.firstChild);
      }
    }

    return wrap;
  }

  function renderStableGroupsV129(force=false){
    if(renderLockV129) return;

    const root = messagingRootV129();
    if(!root) return;

    killOldBlinkRowsV129();

    const groups = loadGroupsV129();
    const hash = groupsHashV129(groups);

    if(!force && hash === lastStableHashV129){
      document.querySelectorAll('#dmGroupsWrapV129 .dm-group-row-v129').forEach(row => {
        row.classList.toggle('active', row.dataset.groupId === activeGroupIdV129);
      });
      return;
    }

    renderLockV129 = true;
    lastStableHashV129 = hash;

    const wrap = ensureWrapV129();
    if(!wrap){
      renderLockV129 = false;
      return;
    }

    if(!groups.length){
      wrap.innerHTML = '';
      renderLockV129 = false;
      return;
    }

    const html = groups.map(group => {
      const messages = group.messages || [];
      const last = messages.length ? messages[messages.length - 1] : null;

      const subtitle = last
        ? `${last.sender}: ${last.text}`
        : `${(group.members || []).length} members • ${group.adminOnly ? 'Admin only' : 'Everyone can message'}`;

      const letter = cleanV129(group.name).slice(0,1).toUpperCase() || 'G';

      return `
        <button type="button" data-group-id="${group.id}" class="dm-group-row-v129 ${activeGroupIdV129 === group.id ? 'active' : ''}">
          <span>${letter}</span>
          <div>
            <b>${group.name}</b>
            <small>${subtitle}</small>
          </div>
        </button>
      `;
    }).join('');

    if(wrap.innerHTML !== html){
      wrap.innerHTML = html;
    }

    wrap.querySelectorAll('.dm-group-row-v129').forEach(row => {
      if(row.__v129ClickBound) return;
      row.__v129ClickBound = true;

      row.addEventListener('click', function(){
        openStableGroupDmV129(row.dataset.groupId);
      });
    });

    renderLockV129 = false;
  }

  function memberAvatarV129(name='?'){
    const letter = cleanV129(name).slice(0,1).toUpperCase() || '?';
    return `<span class="member-avatar-v129">${letter}</span>`;
  }

  function inviteLinkV129(group){
    const url = new URL(location.href);
    url.hash = `join-group=${encodeURIComponent(group.id)}`;
    return url.toString();
  }

  function ensureModalV129(){
    let modal = document.getElementById('groupModalV129');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV129';
      modal.className = 'group-modal-v129 hidden';
      document.body.appendChild(modal);
    }

    return modal;
  }

  window.closeGroupModalV129 = function(){
    const modal = document.getElementById('groupModalV129');
    if(modal) modal.classList.add('hidden');
  };

  function openStableGroupDmV129(groupId){
    const group = getGroupV129(groupId);
    if(!group) return;

    activeGroupIdV129 = group.id;
    window.__activeStableGroupV129 = group.id;

    renderStableGroupsV129(false);

    const root = messagingRootV129();
    if(!root) return;

    killOldBlinkRowsV129();

    const chatArea = findChatAreaV129(root);

    let view = root.querySelector('#groupDmViewV129');

    if(!view){
      view = document.createElement('section');
      view.id = 'groupDmViewV129';
      view.className = 'group-dm-view-v129 card';

      if(chatArea && chatArea !== root){
        chatArea.innerHTML = '';
        chatArea.appendChild(view);
      }else{
        root.appendChild(view);
      }
    }

    const isAdmin = String(group.adminId) === userIdV129() || group.adminUsername === usernameV129();
    const canSend = !group.adminOnly || isAdmin;

    view.innerHTML = `
      <div class="group-dm-head-v129">
        <button type="button" class="group-title-btn-v129" onclick="showMembersV129('${group.id}')">
          <p>Group DM</p>
          <h3>${group.name}</h3>
          <span>${(group.members || []).length} members • click to see members</span>
        </button>

        <div class="group-dm-actions-v129">
          <button type="button" onclick="showInviteV129('${group.id}')">Invite</button>
          ${isAdmin ? `<button type="button" onclick="if(typeof manageGroupV126==='function') manageGroupV126('${group.id}')">Manage</button>` : ''}
          <button type="button" onclick="exitStableGroupV129('${group.id}')">Exit</button>
        </div>
      </div>

      <div class="group-rule-note-v129">
        ${group.adminOnly ? '🔒 Only admin can send messages.' : '💬 Everyone can send messages.'}
        ${group.openJoin ? ' People can join without invite.' : group.inviteRequired ? ' Invite link required.' : ''}
      </div>

      <div id="groupDmMessagesV129" class="group-dm-messages-v129">
        ${
          group.messages && group.messages.length
          ? group.messages.map(msg => `
              <div class="group-dm-msg-v129 ${msg.sender === usernameV129() ? 'mine' : ''}">
                <b>${msg.sender}</b>
                <p>${msg.text}</p>
                <small>${new Date(msg.time).toLocaleString()}</small>
              </div>
            `).join('')
          : `<div class="group-dm-empty-v129">No group messages yet.</div>`
        }
      </div>

      <div class="group-dm-send-v129 ${canSend ? '' : 'disabled'}">
        <input id="groupDmInputV129" ${canSend ? '' : 'disabled'} placeholder="${canSend ? 'Message this group...' : 'Only admin can send messages'}">
        <button type="button" ${canSend ? `onclick="sendStableGroupMsgV129('${group.id}')"` : 'disabled'}>Send</button>
      </div>
    `;

    setTimeout(() => {
      const box = document.getElementById('groupDmMessagesV129');
      if(box) box.scrollTop = box.scrollHeight;

      const input = document.getElementById('groupDmInputV129');
      if(input && canSend) input.focus();
    }, 60);
  }

  window.openStableGroupDmV129 = openStableGroupDmV129;

  window.sendStableGroupMsgV129 = function(groupId){
    const group = getGroupV129(groupId);
    if(!group) return;

    const isAdmin = String(group.adminId) === userIdV129() || group.adminUsername === usernameV129();

    if(group.adminOnly && !isAdmin){
      if(typeof toast === 'function') toast('Only admin can send messages');
      return;
    }

    const input = document.getElementById('groupDmInputV129');
    const text = cleanV129(input?.value || '').slice(0, 800);

    if(!text) return;

    group.messages = group.messages || [];
    group.messages.push({
      id: 'msg_' + Date.now(),
      sender: usernameV129(),
      senderId: userIdV129(),
      text,
      time: new Date().toISOString()
    });

    saveGroupV129(group);

    lastStableHashV129 = '';
    openStableGroupDmV129(group.id);
  };

  window.showInviteV129 = function(groupId){
    const group = getGroupV129(groupId);
    if(!group) return;

    const link = inviteLinkV129(group);
    const modal = ensureModalV129();

    modal.innerHTML = `
      <section class="group-card-v129">
        <div class="group-head-v129">
          <div>
            <p>Invite Link</p>
            <h2>${group.name}</h2>
            <span>Share this link to let people join.</span>
          </div>
          <button type="button" onclick="closeGroupModalV129()">×</button>
        </div>

        <div class="invite-link-box-v129">${link}</div>

        <div class="group-actions-v129">
          <button type="button" class="ghost-v129" onclick="closeGroupModalV129()">Close</button>
          <button type="button" class="primary-v129" onclick="copyInviteV129('${group.id}')">Copy Link</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.copyInviteV129 = async function(groupId){
    const group = getGroupV129(groupId);
    if(!group) return;

    const link = inviteLinkV129(group);

    try{
      await navigator.clipboard.writeText(link);
      if(typeof toast === 'function') toast('Invite link copied');
    }catch{
      prompt('Copy invite link:', link);
    }
  };

  window.showMembersV129 = function(groupId){
    const group = getGroupV129(groupId);
    if(!group) return;

    const modal = ensureModalV129();

    const members = group.members || [];
    const adminName = group.adminUsername || '';

    modal.innerHTML = `
      <section class="group-card-v129">
        <div class="group-head-v129">
          <div>
            <p>Group Members</p>
            <h2>${group.name}</h2>
            <span>${members.length} members with authority role.</span>
          </div>
          <button type="button" onclick="closeGroupModalV129()">×</button>
        </div>

        <div class="members-list-v129">
          ${
            members.map(member => {
              const isAdmin = String(member).toLowerCase() === String(adminName).toLowerCase();
              return `
                <div class="member-row-v129">
                  ${memberAvatarV129(member)}
                  <div>
                    <b>@${member}</b>
                    <small>${isAdmin ? 'Group creator / controller' : 'Can participate according to group rules'}</small>
                  </div>
                  <span class="${isAdmin ? 'admin' : ''}">${isAdmin ? 'Admin' : 'User'}</span>
                </div>
              `;
            }).join('')
          }
        </div>

        <div class="group-actions-v129">
          <button type="button" class="ghost-v129" onclick="closeGroupModalV129()">Close</button>
          <button type="button" class="primary-v129" onclick="showInviteV129('${group.id}')">Invite</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.exitStableGroupV129 = function(groupId){
    const groups = loadGroupsV129();
    const group = groups.find(g => g.id === groupId);
    if(!group) return;

    const me = usernameV129();
    const isAdmin = group.adminUsername === me || String(group.adminId) === userIdV129();

    if(isAdmin){
      if(!confirm('You are admin. Delete this local group?')) return;
      saveGroupsV129(groups.filter(g => g.id !== groupId));
    }else{
      group.members = (group.members || []).filter(m => String(m).toLowerCase() !== me.toLowerCase());
      saveGroupV129(group);
    }

    activeGroupIdV129 = null;
    lastStableHashV129 = '';

    const view = document.getElementById('groupDmViewV129');
    if(view) view.remove();

    renderStableGroupsV129(true);

    if(typeof toast === 'function') toast('Exited group');
  };

  function patchMenuJoinV129(){
    const menu = document.getElementById('dmMenuV127') || document.getElementById('dmMenuV126');
    if(!menu || menu.__v129Patched) return;

    menu.__v129Patched = true;

    const join = document.createElement('button');
    join.type = 'button';
    join.textContent = '🔗 Join Group with Invite Link';
    join.onclick = function(){
      if(typeof closeDmMenuV127 === 'function') closeDmMenuV127();
      if(typeof closeDmMenuV126 === 'function') closeDmMenuV126();
      if(typeof openJoinGroupByLinkV128 === 'function') openJoinGroupByLinkV128();
    };

    menu.appendChild(join);
  }

  // Patch old open functions to use stable V129 view.
  window.openGroupDmV126 = openStableGroupDmV129;
  window.openGroupDmV128 = openStableGroupDmV129;

  function runV129(){
    const root = messagingRootV129();

    if(root){
      killOldBlinkRowsV129();
      patchMenuJoinV129();
      renderStableGroupsV129(false);

      const active = activeGroupIdV129 || window.__activeStableGroupV129;
      if(active && !document.getElementById('groupDmViewV129')){
        openStableGroupDmV129(active);
      }
    }
  }

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') window.closeGroupModalV129();

    if(event.key === 'Enter' && document.activeElement?.id === 'groupDmInputV129'){
      event.preventDefault();
      const active = activeGroupIdV129 || window.__activeStableGroupV129;
      if(active) window.sendStableGroupMsgV129(active);
    }
  });

  document.addEventListener('click', function(event){
    const modal = document.getElementById('groupModalV129');
    if(modal && !modal.classList.contains('hidden') && event.target === modal){
      modal.classList.add('hidden');
    }
  });

  // Use requestAnimationFrame loop only to kill old flicker, but no redraw.
  function hardHideLoopV129(){
    killOldBlinkRowsV129();
    requestAnimationFrame(hardHideLoopV129);
  }
  requestAnimationFrame(hardHideLoopV129);

  setInterval(runV129, 900);
  setTimeout(runV129, 200);
  setTimeout(runV129, 700);
  setTimeout(runV129, 1800);
})();


/* =========================================================
   V130 PORTABLE GROUP INVITE LINK FIX
   Problem fixed:
   - Old invite link only had group ID.
   - Another account/browser could not find that group because groups are local.
   New fix:
   - Invite link carries safe group metadata inside the link.
   - Another account can paste the link and create a joined local copy.
   - Existing V129 group UI is preserved.
   ========================================================= */

(function(){
  const GROUPS_KEY = 'reconnect_groups_v125';

  function cleanV130(v=''){
    return String(v || '').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
  }

  function currentUserV130(){
    try { return window.currentUserData || currentUserData || {}; }
    catch { return {}; }
  }

  function usernameV130(){
    const u = currentUserV130();
    return u.username || u.displayName || 'you';
  }

  function userIdV130(){
    const u = currentUserV130();
    return String(u._id || u.id || u.username || 'me');
  }

  function loadGroupsV130(){
    try{
      const groups = JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
      return Array.isArray(groups) ? groups : [];
    }catch{
      return [];
    }
  }

  function saveGroupsV130(groups){
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }

  function getGroupV130(id){
    return loadGroupsV130().find(g => g.id === id);
  }

  function saveGroupV130(group){
    const groups = loadGroupsV130();
    const index = groups.findIndex(g => g.id === group.id);
    if(index >= 0) groups[index] = group;
    else groups.unshift(group);
    saveGroupsV130(groups);
  }

  function encodePayloadV130(obj){
    const json = JSON.stringify(obj);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodePayloadV130(payload){
    try{
      payload = String(payload || '').replace(/-/g, '+').replace(/_/g, '/');
      while(payload.length % 4) payload += '=';
      const json = decodeURIComponent(escape(atob(payload)));
      return JSON.parse(json);
    }catch(error){
      console.warn('V130 invite decode failed', error);
      return null;
    }
  }

  function groupPayloadV130(group){
    return {
      version: 130,
      id: group.id,
      name: group.name,
      adminId: group.adminId,
      adminUsername: group.adminUsername,
      members: Array.isArray(group.members) ? group.members.slice(0, 80) : [],
      adminOnly: !!group.adminOnly,
      openJoin: !!group.openJoin,
      inviteRequired: !!group.inviteRequired,
      createdAt: group.createdAt || new Date().toISOString()
    };
  }

  function portableInviteLinkV130(group){
    const url = new URL(location.href);
    const payload = encodePayloadV130(groupPayloadV130(group));
    url.hash = `join-group-v130=${payload}`;
    return url.toString();
  }

  function parseInviteV130(value=''){
    value = cleanV130(value);

    if(!value) return { groupId:'', payload:null, type:'empty' };

    let hash = '';

    try{
      const url = new URL(value, location.origin);
      hash = url.hash || '';
    }catch{
      hash = value.startsWith('#') ? value : `#${value}`;
    }

    let match = hash.match(/join-group-v130=([^&]+)/);
    if(match){
      const payload = decodePayloadV130(decodeURIComponent(match[1]));
      return {
        groupId: payload?.id || '',
        payload,
        type: 'portable'
      };
    }

    match = hash.match(/join-group=([^&]+)/);
    if(match){
      return {
        groupId: decodeURIComponent(match[1]),
        payload: null,
        type: 'old-id-only'
      };
    }

    if(value.startsWith('grp_')){
      return {
        groupId: value,
        payload: null,
        type: 'old-id-only'
      };
    }

    return { groupId:'', payload:null, type:'invalid' };
  }

  function joinOrCreateFromPayloadV130(payload){
    if(!payload || !payload.id || !payload.name) return null;

    const me = usernameV130();
    let group = getGroupV130(payload.id);

    if(group){
      group.members = Array.isArray(group.members) ? group.members : [];

      if(!group.members.some(m => String(m).toLowerCase() === me.toLowerCase())){
        group.members.push(me);
      }

      saveGroupV130(group);
      return group;
    }

    const members = Array.isArray(payload.members) ? payload.members : [];
    const finalMembers = [...members];

    if(!finalMembers.some(m => String(m).toLowerCase() === me.toLowerCase())){
      finalMembers.push(me);
    }

    group = {
      id: payload.id,
      name: payload.name,
      adminId: payload.adminId || '',
      adminUsername: payload.adminUsername || 'admin',
      members: finalMembers.filter((m, i, arr) => {
        return m && arr.findIndex(x => String(x).toLowerCase() === String(m).toLowerCase()) === i;
      }),
      adminOnly: !!payload.adminOnly,
      openJoin: !!payload.openJoin,
      inviteRequired: payload.openJoin ? false : !!payload.inviteRequired,
      messages: [],
      createdAt: payload.createdAt || new Date().toISOString(),
      joinedFromInvite: true
    };

    saveGroupV130(group);
    return group;
  }

  function openGroupAfterJoinV130(group){
    if(!group) return;

    if(typeof switchView === 'function'){
      try{ switchView('messages'); }catch{}
    }

    setTimeout(() => {
      if(typeof window.openStableGroupDmV129 === 'function'){
        window.openStableGroupDmV129(group.id);
      }else if(typeof window.openGroupDmV128 === 'function'){
        window.openGroupDmV128(group.id);
      }else if(typeof window.openGroupDmV126 === 'function'){
        window.openGroupDmV126(group.id);
      }
    }, 650);
  }

  window.showInviteV129 = function(groupId){
    const group = getGroupV130(groupId);
    if(!group) return;

    const link = portableInviteLinkV130(group);

    let modal = document.getElementById('groupModalV129') || document.getElementById('groupModalV128');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV129';
      modal.className = 'group-modal-v129 hidden';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <section class="group-card-v129">
        <div class="group-head-v129">
          <div>
            <p>Portable Invite Link</p>
            <h2>${group.name}</h2>
            <span>This link can be pasted from another account/browser.</span>
          </div>
          <button type="button" onclick="closePortableInviteModalV130()">×</button>
        </div>

        <div class="invite-link-box-v129">${link}</div>

        <div class="portable-note-v130">
          Fresh V130 invite links include group data. Old links with only group ID cannot work on another browser/account.
        </div>

        <div class="group-actions-v129">
          <button type="button" class="ghost-v129" onclick="closePortableInviteModalV130()">Close</button>
          <button type="button" class="primary-v129" onclick="copyInviteV129('${group.id}')">Copy Link</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');
  };

  window.copyInviteV129 = async function(groupId){
    const group = getGroupV130(groupId);
    if(!group) return;

    const link = portableInviteLinkV130(group);

    try{
      await navigator.clipboard.writeText(link);
      if(typeof toast === 'function') toast('Portable invite link copied');
    }catch{
      prompt('Copy invite link:', link);
    }
  };

  window.showInviteLinkV128 = window.showInviteV129;
  window.copyInviteLinkV128 = window.copyInviteV129;
  window.showInviteLinkV126 = window.showInviteV129;
  window.copyInviteLinkV126 = window.copyInviteV129;

  window.closePortableInviteModalV130 = function(){
    const modal =
      document.getElementById('groupModalV129') ||
      document.getElementById('groupModalV128') ||
      document.getElementById('groupModalV126');

    if(modal) modal.classList.add('hidden');
  };

  window.openJoinGroupByLinkV130 = function(){
    let modal = document.getElementById('groupModalV129') || document.getElementById('groupModalV128');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'groupModalV129';
      modal.className = 'group-modal-v129 hidden';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <section class="group-card-v129">
        <div class="group-head-v129">
          <div>
            <p>Join Group</p>
            <h2>Join with Invite Link</h2>
            <span>Paste a fresh V130 group invite link here.</span>
          </div>
          <button type="button" onclick="closePortableInviteModalV130()">×</button>
        </div>

        <label class="group-field-v130">
          <span>Invite link</span>
          <input id="joinGroupLinkInputV130" placeholder="Paste invite link here">
        </label>

        <div class="portable-note-v130">
          If the link was generated before this update, ask the admin to copy a new invite link.
        </div>

        <div class="group-actions-v129">
          <button type="button" class="ghost-v129" onclick="closePortableInviteModalV130()">Cancel</button>
          <button type="button" class="primary-v129" onclick="joinGroupFromLinkV130()">Join Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      const input = document.getElementById('joinGroupLinkInputV130');
      if(input) input.focus();
    }, 80);
  };

  window.openJoinGroupByLinkV128 = window.openJoinGroupByLinkV130;

  window.joinGroupFromLinkV130 = function(){
    const input =
      document.getElementById('joinGroupLinkInputV130') ||
      document.getElementById('joinGroupLinkInputV128');

    const parsed = parseInviteV130(input?.value || '');

    if(!parsed.groupId){
      if(typeof toast === 'function') toast('Invalid invite link');
      return;
    }

    let group = null;

    if(parsed.payload){
      group = joinOrCreateFromPayloadV130(parsed.payload);
    }else{
      group = getGroupV130(parsed.groupId);

      if(!group){
        if(typeof toast === 'function') {
          toast('Old invite link. Ask admin for new V130 invite link.');
        }
        return;
      }

      const me = usernameV130();
      group.members = Array.isArray(group.members) ? group.members : [];

      if(!group.members.some(m => String(m).toLowerCase() === me.toLowerCase())){
        group.members.push(me);
      }

      saveGroupV130(group);
    }

    window.closePortableInviteModalV130();

    if(typeof toast === 'function') toast('Joined group');
    openGroupAfterJoinV130(group);
  };

  window.joinGroupFromLinkV128 = window.joinGroupFromLinkV130;

  function patchJoinMenuV130(){
    const menus = [
      document.getElementById('dmMenuV127'),
      document.getElementById('dmMenuV126')
    ].filter(Boolean);

    menus.forEach(menu => {
      let btn = Array.from(menu.querySelectorAll('button')).find(b => {
        return String(b.textContent || '').toLowerCase().includes('join group');
      });

      if(!btn){
        btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '🔗 Join Group with Invite Link';
        menu.appendChild(btn);
      }

      btn.onclick = function(){
        if(typeof closeDmMenuV127 === 'function') closeDmMenuV127();
        if(typeof closeDmMenuV126 === 'function') closeDmMenuV126();
        window.openJoinGroupByLinkV130();
      };
    });
  }

  function handleHashV130(){
    const parsed = parseInviteV130(location.href);
    if(!parsed.groupId) return;

    let group = null;

    if(parsed.payload){
      group = joinOrCreateFromPayloadV130(parsed.payload);
    }else{
      group = getGroupV130(parsed.groupId);
      if(!group) return;
    }

    openGroupAfterJoinV130(group);
  }

  document.addEventListener('keydown', function(event){
    if(event.key === 'Enter' && document.activeElement?.id === 'joinGroupLinkInputV130'){
      event.preventDefault();
      window.joinGroupFromLinkV130();
    }
  });

  function runV130(){
    patchJoinMenuV130();
    handleHashV130();
  }

  setInterval(runV130, 1200);
  setTimeout(runV130, 250);
  setTimeout(runV130, 900);
  setTimeout(runV130, 2200);
})();


/* =========================================================
   V135 REAL BACKEND GROUP CHAT
   Safe functional patch on top of V134 stable.
   Requires backend files included in this package:
   - src/models/Group.js
   - src/routes/group.routes.js
   - server.js with /api/groups mounted

   Goals:
   - Groups are stored in MongoDB.
   - Invite links work across accounts.
   - Group messages sync for all members.
   - 1-1 DM remains separate and untouched.
   ========================================================= */

(function(){
  let activeGroupIdV135 = '';
  let lastGroupConvoHashV135 = '';
  let creatingGroupV135 = false;

  function safeTextV135(value=''){
    return String(value || '').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
  }

  function escapeV135(value=''){
    if(typeof escapeHTML === 'function'){
      try { return escapeHTML(value); } catch {}
    }
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function toastV135(message){
    if(typeof toast === 'function'){
      try { toast(message); return; } catch {}
    }
    console.log(message);
  }

  function apiGroupsV135(path=''){
    return `/api/groups${path}`;
  }

  function currentUserV135(){
    try { return window.currentUserData || currentUserData || {}; }
    catch { return {}; }
  }

  function currentUserIdV135(){
    const u=currentUserV135();
    return String(u._id || u.id || u.userId || '');
  }

  function currentUsernameV135(){
    const u=currentUserV135();
    return String(u.username || u.displayName || 'me').toLowerCase();
  }

  function appReadyV135(){
    const auth=document.getElementById('authScreen');
    const shell=document.getElementById('appShell');
    return (
      document.body.classList.contains('app-mode') ||
      (shell && !shell.classList.contains('hidden')) ||
      (auth && auth.classList.contains('hidden'))
    );
  }

  function isMessagesViewV135(){
    try{
      return activeView === 'messages';
    }catch{
      return !!document.getElementById('conversationList');
    }
  }

  async function groupApiFetchV135(path, options={}){
    if(typeof apiFetch === 'function'){
      return await apiFetch(apiGroupsV135(path), options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = localStorage.getItem('token') || localStorage.getItem('reconnect_token') || '';
    if(token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(apiGroupsV135(path), {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if(!res.ok || data.success === false){
      throw new Error(data.message || 'Group request failed');
    }
    return data;
  }

  function groupInitialV135(group){
    const name=String(group?.name || 'G');
    return name.slice(0,1).toUpperCase();
  }

  function memberRoleV135(group, user){
    const id=String(user?._id || user?.id || user || '');
    const username=String(user?.username || '').toLowerCase();
    const adminId=String(group?.admin?._id || group?.admin || '');
    const adminUsername=String(group?.admin?.username || group?.adminUsername || '').toLowerCase();

    if(id && adminId && id === adminId) return 'Admin';
    if(username && adminUsername && username === adminUsername) return 'Admin';
    return 'User';
  }

  function mediaPayloadV135(){
    try{
      if(typeof pendingChatMedia !== 'undefined' && Array.isArray(pendingChatMedia)){
        return pendingChatMedia.map(item => ({
          url: item.src || item.url || '',
          type: item.type || 'file',
          name: item.name || 'Attachment',
          size: item.size || 0
        }));
      }
    }catch{}
    return [];
  }

  function clearMediaV135(){
    try{
      if(typeof clearChatPendingMedia === 'function') clearChatPendingMedia();
      else if(typeof pendingChatMedia !== 'undefined') pendingChatMedia = [];
    }catch{}
  }

  function mediaTypeV135(media=[]){
    const first = media[0] || {};
    const type = String(first.type || '').toLowerCase();
    if(type.startsWith('image/')) return 'image';
    if(type.startsWith('video/')) return 'video';
    if(type.startsWith('audio/')) return 'audio';
    if(media.length) return 'file';
    return 'text';
  }

  function renderMediaV135(media=[]){
    if(!Array.isArray(media) || !media.length) return '';

    return `<div class="group-media-v135">` + media.map(item => {
      const url = item.url || item.src || '';
      const type = String(item.type || '');
      const name = escapeV135(item.name || 'Attachment');

      if(type.startsWith('image/')) return `<img src="${url}" alt="${name}">`;
      if(type.startsWith('video/')) return `<video controls src="${url}"></video><small>Clip</small>`;
      if(type.startsWith('audio/')) return `<audio controls src="${url}"></audio>`;
      return `<a href="${url}" target="_blank">📎 ${name}</a>`;
    }).join('') + `</div>`;
  }

  function isMineGroupMsgV135(msg){
    const meId=currentUserIdV135();
    const meUsername=currentUsernameV135();
    const senderId=String(msg.sender?._id || msg.sender || msg.senderId || '');
    const senderUsername=String(msg.sender?.username || msg.senderUsername || '').toLowerCase();

    return (meId && senderId && meId === senderId) || (meUsername && senderUsername && meUsername === senderUsername);
  }

  function renderGroupBubbleV135(msg){
    const mine=isMineGroupMsgV135(msg);
    const sender=msg.sender || {};
    const senderName=sender.displayName || sender.username || msg.senderUsername || 'User';
    const body=msg.body || '';
    const time=msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';

    return `
      <div class="chat-bubble group-bubble-v135 ${mine ? 'mine' : 'theirs'}">
        ${mine ? '' : `<b class="group-msg-author-v135">${escapeV135(senderName)}</b>`}
        ${body ? `<p>${escapeV135(body)}</p>` : ''}
        ${renderMediaV135(msg.media || [])}
        <span class="group-msg-time-v135">${escapeV135(time)} ${mine ? '✓' : ''}</span>
      </div>
    `;
  }

  function stopDmPollingV135(){
    try{
      if(typeof stopChatPolling === 'function') stopChatPolling();
      else if(typeof chatPollTimer !== 'undefined' && chatPollTimer){
        clearInterval(chatPollTimer);
        chatPollTimer=null;
      }
    }catch{}
  }

  function startGroupPollingV135(){
    try{
      if(typeof chatPollTimer !== 'undefined' && chatPollTimer){
        clearInterval(chatPollTimer);
      }
      chatPollTimer = setInterval(() => {
        if(activeGroupIdV135 && isMessagesViewV135()){
          loadGroupThreadV135(activeGroupIdV135, true);
          loadConversationsV135(true);
        }
      }, 3500);
    }catch{
      setInterval(() => {
        if(activeGroupIdV135 && isMessagesViewV135()){
          loadGroupThreadV135(activeGroupIdV135, true);
          loadConversationsV135(true);
        }
      }, 3500);
    }
  }

  async function loadGroupsV135(){
    const data = await groupApiFetchV135('');
    return data.groups || [];
  }

  function groupConvoHashV135(groups=[]){
    return JSON.stringify(groups.map(g => ({
      id:g._id || g.id,
      name:g.name,
      last:g.lastMessage?.body || '',
      count:g.messageCount || 0,
      members:g.memberCount || (g.members || []).length,
      unread:g.unreadCount || 0,
      adminOnly:!!(g.settings?.adminOnlyMessages || g.adminOnly)
    })));
  }

  async function appendGroupsToConversationsV135(silent=false){
    const box=document.getElementById('conversationList');
    if(!box || !appReadyV135()) return;

    let groups=[];
    try{
      groups=await loadGroupsV135();
    }catch(error){
      if(!silent){
        const old=box.querySelector('.backend-group-error-v135');
        if(!old){
          box.insertAdjacentHTML('beforeend', `<div class="backend-group-error-v135">Backend groups unavailable: ${escapeV135(error.message)}</div>`);
        }
      }
      return;
    }

    const hash=groupConvoHashV135(groups);
    if(silent && hash===lastGroupConvoHashV135) return;
    lastGroupConvoHashV135=hash;

    box.querySelectorAll('.group-section-v135,.backend-group-error-v135').forEach(el => el.remove());

    if(!groups.length){
      box.insertAdjacentHTML('beforeend', `
        <div class="group-section-v135">
          <div class="group-section-title-v135">Group Chats</div>
          <div class="collection-empty group-empty-v135">No groups yet. Use ⋮ to create or join a group.</div>
        </div>
      `);
      return;
    }

    const html=`
      <div class="group-section-v135">
        <div class="group-section-title-v135">Group Chats</div>
        ${groups.map(group => {
          const id=group._id || group.id;
          const active=id===activeGroupIdV135;
          const last=group.lastMessage?.body || `${group.memberCount || (group.members || []).length} members`;
          return `
            <button class="conversation-card backend-group-row-v135 ${active ? 'active' : ''}" onclick="openGroupChatV135('${id}')">
              <div class="avatar sm backend-group-avatar-v135">👥</div>
              <div>
                <strong>${escapeV135(group.name || 'Group')}</strong>
                <span>${group.settings?.adminOnlyMessages ? 'Admin only' : 'Everyone can message'}</span>
                <p>${escapeV135(last)}</p>
              </div>
              ${group.unreadCount ? `<b>${group.unreadCount}</b>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;

    box.insertAdjacentHTML('beforeend', html);
  }

  async function loadConversationsV135(silent=false){
    if(typeof __oldLoadConversationsV135 === 'function'){
      await __oldLoadConversationsV135();
    }
    await appendGroupsToConversationsV135(silent);
  }

  async function openGroupChatV135(groupId){
    activeGroupIdV135=groupId;
    try{ activeChatUsername=''; }catch{}

    stopDmPollingV135();
    await loadGroupThreadV135(groupId, false);
    await loadConversationsV135(true);
    startGroupPollingV135();

    const input=document.getElementById('chatMessageInput');
    if(input) input.focus();
  }

  async function loadGroupThreadV135(groupId=activeGroupIdV135, silent=false){
    if(!groupId) return;

    let data;
    try{
      data=await groupApiFetchV135(`/${encodeURIComponent(groupId)}`);
    }catch(error){
      toastV135(error.message);
      return;
    }

    const group=data.group;
    const messages=data.messages || [];

    activeGroupIdV135=String(group._id || group.id || groupId);

    const header=document.getElementById('chatThreadHeader');
    if(header){
      const memberCount=group.memberCount || (group.members || []).length || 0;
      header.innerHTML=`
        <div class="chat-user-head group-head-v135" onclick="showGroupMembersV135('${activeGroupIdV135}')">
          <div class="avatar sm backend-group-avatar-v135">👥</div>
          <div>
            <h2>${escapeV135(group.name)}</h2>
            <p>${memberCount} members • ${group.settings?.adminOnlyMessages ? 'Only admin can send' : 'Everyone can send'} • click for members</p>
          </div>
        </div>

        <div class="group-header-actions-v135">
          <button onclick="copyGroupInviteV135('${activeGroupIdV135}')">Invite</button>
          ${group.isAdmin ? `<button onclick="openGroupAccessV135('${activeGroupIdV135}')">Manage</button>` : ''}
          <button onclick="leaveGroupV135('${activeGroupIdV135}')">Leave</button>
        </div>
      `;
    }

    const box=document.getElementById('chatMessages');
    if(box){
      const shouldStick = box.scrollHeight - box.scrollTop - box.clientHeight < 120;

      if(!messages.length){
        box.innerHTML='<div class="collection-empty">No group messages yet. Start the conversation.</div>';
      }else{
        box.innerHTML=messages.map(renderGroupBubbleV135).join('');
        if(!silent || shouldStick) box.scrollTop=box.scrollHeight;
      }
    }

    const input=document.getElementById('chatMessageInput');
    const send=document.querySelector('.pro-chat-send');
    const canSend=Boolean(group.canSend);

    if(input){
      input.disabled=!canSend;
      input.placeholder=canSend ? 'Message this group...' : 'Only admin can send messages';
    }
    if(send) send.disabled=!canSend;

    if(!silent){
      try{ await groupApiFetchV135(`/${encodeURIComponent(activeGroupIdV135)}/read`, { method:'PATCH' }); }catch{}
    }
  }

  async function sendGroupMessageV135(){
    const input=document.getElementById('chatMessageInput');
    const body=safeTextV135(input?.value || '');
    const media=mediaPayloadV135();

    if(!activeGroupIdV135){
      toastV135('Open a group first');
      return;
    }

    if(!body && !media.length){
      toastV135('Write a message or attach media');
      return;
    }

    try{
      await groupApiFetchV135(`/${encodeURIComponent(activeGroupIdV135)}/messages`, {
        method:'POST',
        body:JSON.stringify({
          body,
          type: mediaTypeV135(media),
          media
        })
      });

      if(input) input.value='';
      clearMediaV135();
      await loadGroupThreadV135(activeGroupIdV135, false);
      await loadConversationsV135(false);
    }catch(error){
      toastV135(error.message);
    }
  }

  function ensureModalV135(){
    let modal=document.getElementById('backendGroupModalV135');
    if(!modal){
      modal=document.createElement('div');
      modal.id='backendGroupModalV135';
      modal.className='backend-group-modal-v135 hidden';
      document.body.appendChild(modal);
    }
    return modal;
  }

  function closeModalV135(){
    const modal=document.getElementById('backendGroupModalV135');
    if(modal) modal.classList.add('hidden');
  }

  function memberInputHelpV135(){
    return '<small>Enter usernames separated by comma. Example: rahul, aarya, saru</small>';
  }

  function openCreateGroupV135(){
    const modal=ensureModalV135();
    modal.innerHTML=`
      <section class="backend-group-card-v135">
        <div class="backend-modal-head-v135">
          <div>
            <p>Real Backend Group</p>
            <h2>Create Group Chat</h2>
            <span>Saved in MongoDB. Works across accounts.</span>
          </div>
          <button onclick="closeGroupModalV135()">×</button>
        </div>

        <label class="backend-field-v135">
          <span>Group name</span>
          <input id="groupNameBackendV135" maxlength="50" placeholder="Example: Startup Team">
        </label>

        <label class="backend-field-v135">
          <span>Add members by username</span>
          <input id="groupMembersBackendV135" placeholder="rahul, aarya">
          ${memberInputHelpV135()}
        </label>

        <div class="backend-options-v135">
          <label>
            <input type="checkbox" id="groupAdminOnlyBackendV135">
            <div><b>Only admin can send messages</b><small>Best for announcement groups.</small></div>
          </label>
          <label>
            <input type="checkbox" id="groupOpenJoinBackendV135">
            <div><b>Open join</b><small>People can join with group invite link.</small></div>
          </label>
        </div>

        <div class="backend-actions-v135">
          <button class="ghost" onclick="closeGroupModalV135()">Cancel</button>
          <button onclick="createBackendGroupV135()">Create Group</button>
        </div>
      </section>
    `;
    modal.classList.remove('hidden');
    setTimeout(()=>document.getElementById('groupNameBackendV135')?.focus(),80);
  }

  async function createBackendGroupV135(){
    if(creatingGroupV135) return;
    creatingGroupV135=true;

    const name=safeTextV135(document.getElementById('groupNameBackendV135')?.value || '');
    const raw=safeTextV135(document.getElementById('groupMembersBackendV135')?.value || '');
    const memberUsernames=raw ? raw.split(',').map(v=>safeTextV135(v).replace('@','').toLowerCase()).filter(Boolean) : [];
    const adminOnly=!!document.getElementById('groupAdminOnlyBackendV135')?.checked;
    const openJoin=!!document.getElementById('groupOpenJoinBackendV135')?.checked;

    if(!name){
      toastV135('Group name required');
      creatingGroupV135=false;
      return;
    }

    try{
      const data=await groupApiFetchV135('',{
        method:'POST',
        body:JSON.stringify({
          name,
          memberUsernames,
          adminOnlyMessages: adminOnly,
          openJoin,
          inviteRequired: !openJoin
        })
      });

      closeModalV135();
      toastV135('Group created');
      await loadConversationsV135(false);
      await openGroupChatV135(data.group._id || data.group.id);
    }catch(error){
      toastV135(error.message);
    }finally{
      creatingGroupV135=false;
    }
  }

  function openJoinGroupV135(){
    const modal=ensureModalV135();
    modal.innerHTML=`
      <section class="backend-group-card-v135">
        <div class="backend-modal-head-v135">
          <div>
            <p>Join Group</p>
            <h2>Join with Invite Link</h2>
            <span>Paste a backend group invite link.</span>
          </div>
          <button onclick="closeGroupModalV135()">×</button>
        </div>

        <label class="backend-field-v135">
          <span>Invite link / token</span>
          <input id="joinGroupBackendV135" placeholder="Paste invite link here">
        </label>

        <div class="backend-actions-v135">
          <button class="ghost" onclick="closeGroupModalV135()">Cancel</button>
          <button onclick="joinBackendGroupV135()">Join Group</button>
        </div>
      </section>
    `;
    modal.classList.remove('hidden');
    setTimeout(()=>document.getElementById('joinGroupBackendV135')?.focus(),80);
  }

  function extractInviteTokenV135(value=''){
    value=safeTextV135(value);
    if(!value) return '';

    try{
      const url=new URL(value, location.origin);
      const hash=url.hash || '';
      let m=hash.match(/join-backend-group=([^&]+)/);
      if(m) return decodeURIComponent(m[1]);

      m=hash.match(/groupInvite=([^&]+)/);
      if(m) return decodeURIComponent(m[1]);

      if(url.searchParams.get('groupInvite')) return url.searchParams.get('groupInvite');
    }catch{}

    const m=value.match(/join-backend-group=([^&]+)/);
    if(m) return decodeURIComponent(m[1]);

    if(value.length >= 20) return value;
    return '';
  }

  async function joinBackendGroupV135(){
    const raw=document.getElementById('joinGroupBackendV135')?.value || '';
    const inviteToken=extractInviteTokenV135(raw);

    if(!inviteToken){
      toastV135('Invalid invite link');
      return;
    }

    try{
      const data=await groupApiFetchV135('/join',{
        method:'POST',
        body:JSON.stringify({ inviteToken })
      });

      closeModalV135();
      toastV135('Joined group');
      await loadConversationsV135(false);
      await openGroupChatV135(data.group._id || data.group.id);
    }catch(error){
      toastV135(error.message);
    }
  }

  async function copyGroupInviteV135(groupId){
    try{
      const data=await groupApiFetchV135(`/${encodeURIComponent(groupId)}/invite`,{ method:'POST' });
      const token=data.inviteToken;
      const url=new URL(location.href);
      url.hash=`join-backend-group=${encodeURIComponent(token)}`;
      const link=url.toString();

      await navigator.clipboard.writeText(link);
      toastV135('Backend invite link copied');
    }catch(error){
      toastV135(error.message);
    }
  }

  async function showGroupMembersV135(groupId){
    try{
      const data=await groupApiFetchV135(`/${encodeURIComponent(groupId)}`);
      const group=data.group;
      const members=group.members || [];

      const modal=ensureModalV135();
      modal.innerHTML=`
        <section class="backend-group-card-v135">
          <div class="backend-modal-head-v135">
            <div>
              <p>Group Access</p>
              <h2>${escapeV135(group.name)}</h2>
              <span>${members.length} members with roles.</span>
            </div>
            <button onclick="closeGroupModalV135()">×</button>
          </div>

          <div class="backend-members-v135">
            ${members.map(user=>{
              const role=memberRoleV135(group,user);
              const username=user.username || 'user';
              const name=user.displayName || username;
              return `
                <div class="backend-member-row-v135">
                  <div class="avatar sm">${typeof renderAvatarHTML==='function'?renderAvatarHTML(user.avatar||'👤','👤'):escapeV135(user.avatar||'👤')}</div>
                  <div>
                    <b>${escapeV135(name)}</b>
                    <small>@${escapeV135(username)}</small>
                  </div>
                  <span class="${role==='Admin'?'admin':''}">${role}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="backend-actions-v135">
            <button class="ghost" onclick="closeGroupModalV135()">Close</button>
            <button onclick="copyGroupInviteV135('${groupId}')">Invite</button>
          </div>
        </section>
      `;
      modal.classList.remove('hidden');
    }catch(error){
      toastV135(error.message);
    }
  }

  async function openGroupAccessV135(groupId){
    try{
      const data=await groupApiFetchV135(`/${encodeURIComponent(groupId)}`);
      const group=data.group;
      const members=(group.members||[]).map(u=>u.username).join(', ');
      const modal=ensureModalV135();

      modal.innerHTML=`
        <section class="backend-group-card-v135">
          <div class="backend-modal-head-v135">
            <div>
              <p>Admin Controls</p>
              <h2>${escapeV135(group.name)}</h2>
              <span>Manage members and access.</span>
            </div>
            <button onclick="closeGroupModalV135()">×</button>
          </div>

          <label class="backend-field-v135">
            <span>Group name</span>
            <input id="editGroupNameBackendV135" value="${escapeV135(group.name)}">
          </label>

          <label class="backend-field-v135">
            <span>Members usernames</span>
            <input id="editGroupMembersBackendV135" value="${escapeV135(members)}">
            ${memberInputHelpV135()}
          </label>

          <div class="backend-options-v135">
            <label>
              <input type="checkbox" id="editGroupAdminOnlyBackendV135" ${group.settings?.adminOnlyMessages?'checked':''}>
              <div><b>Only admin can send messages</b><small>Controls who can post in group.</small></div>
            </label>
            <label>
              <input type="checkbox" id="editGroupOpenJoinBackendV135" ${group.settings?.openJoin?'checked':''}>
              <div><b>Open join</b><small>Invite link can add people.</small></div>
            </label>
          </div>

          <div class="backend-actions-v135">
            <button class="ghost" onclick="closeGroupModalV135()">Cancel</button>
            <button onclick="saveGroupAccessV135('${groupId}')">Save</button>
          </div>
        </section>
      `;

      modal.classList.remove('hidden');
    }catch(error){
      toastV135(error.message);
    }
  }

  async function saveGroupAccessV135(groupId){
    const name=safeTextV135(document.getElementById('editGroupNameBackendV135')?.value || '');
    const raw=safeTextV135(document.getElementById('editGroupMembersBackendV135')?.value || '');
    const memberUsernames=raw ? raw.split(',').map(v=>safeTextV135(v).replace('@','').toLowerCase()).filter(Boolean) : [];
    const adminOnlyMessages=!!document.getElementById('editGroupAdminOnlyBackendV135')?.checked;
    const openJoin=!!document.getElementById('editGroupOpenJoinBackendV135')?.checked;

    try{
      await groupApiFetchV135(`/${encodeURIComponent(groupId)}`,{
        method:'PATCH',
        body:JSON.stringify({
          name,
          memberUsernames,
          adminOnlyMessages,
          openJoin,
          inviteRequired: !openJoin
        })
      });

      closeModalV135();
      toastV135('Group access updated');
      await loadConversationsV135(false);
      await loadGroupThreadV135(groupId,false);
    }catch(error){
      toastV135(error.message);
    }
  }

  async function leaveGroupV135(groupId){
    if(!confirm('Leave this group?')) return;

    try{
      await groupApiFetchV135(`/${encodeURIComponent(groupId)}/leave`,{ method:'POST' });
      activeGroupIdV135='';
      toastV135('Left group');
      await loadConversationsV135(false);

      const header=document.getElementById('chatThreadHeader');
      const box=document.getElementById('chatMessages');
      if(header) header.innerHTML='<div><h2>Select a conversation</h2><p>Open a DM or group.</p></div>';
      if(box) box.innerHTML='<div class="collection-empty no-chat-selected-box">No chat selected.</div>';
    }catch(error){
      toastV135(error.message);
    }
  }

  function addGroupMenuButtonV135(){
    const start=document.querySelector('.chat-start');
    if(!start || start.querySelector('#groupMenuV135')) return;

    const wrap=document.createElement('div');
    wrap.id='groupMenuV135';
    wrap.className='group-menu-wrap-v135';
    wrap.innerHTML=`
      <button class="group-menu-dot-v135" onclick="toggleGroupMenuV135(event)">⋮</button>
      <div id="groupMenuPopupV135" class="group-menu-popup-v135 hidden">
        <button onclick="openCreateGroupV135(); closeGroupMenuV135();">＋ Create Group</button>
        <button onclick="openJoinGroupV135(); closeGroupMenuV135();">🔗 Join Group</button>
        <button onclick="loadConversationsV135(false); closeGroupMenuV135();">↻ Refresh Groups</button>
      </div>
    `;

    start.appendChild(wrap);
  }

  function toggleGroupMenuV135(event){
    if(event) event.stopPropagation();
    const menu=document.getElementById('groupMenuPopupV135');
    if(menu) menu.classList.toggle('hidden');
  }

  function closeGroupMenuV135(){
    const menu=document.getElementById('groupMenuPopupV135');
    if(menu) menu.classList.add('hidden');
  }

  function handleInviteHashV135(){
    const hash=String(location.hash || '');
    const m=hash.match(/join-backend-group=([^&]+)/);
    if(!m) return;

    const token=decodeURIComponent(m[1]);
    if(!token || window.__handledBackendInviteV135===token) return;
    window.__handledBackendInviteV135=token;

    setTimeout(async ()=>{
      try{
        const data=await groupApiFetchV135('/join',{
          method:'POST',
          body:JSON.stringify({ inviteToken: token })
        });
        toastV135('Joined group');
        if(typeof switchView==='function') switchView('messages');
        setTimeout(()=>openGroupChatV135(data.group._id || data.group.id),700);
      }catch(error){
        toastV135(error.message);
      }
    },800);
  }

  function patchV135(){
    if(window.__realBackendGroupsV135Patched) return;
    if(!appReadyV135()) return;

    window.__realBackendGroupsV135Patched=true;

    window.__oldLoadConversationsV135 = typeof loadConversations === 'function' ? loadConversations : null;
    window.__oldOpenChatV135 = typeof openChat === 'function' ? openChat : null;
    window.__oldSendChatMessageV135 = typeof sendChatMessage === 'function' ? sendChatMessage : null;
    window.__oldLoadChatThreadV135 = typeof loadChatThread === 'function' ? loadChatThread : null;
    window.__oldRenderMessagesV135 = typeof renderMessages === 'function' ? renderMessages : null;

    if(window.__oldLoadConversationsV135){
      loadConversations = loadConversationsV135;
      window.loadConversations = loadConversationsV135;
    }

    if(window.__oldOpenChatV135){
      openChat = async function(username){
        activeGroupIdV135='';
        return await window.__oldOpenChatV135(username);
      };
      window.openChat = openChat;
    }

    if(window.__oldLoadChatThreadV135){
      loadChatThread = async function(){
        if(activeGroupIdV135) return await loadGroupThreadV135(activeGroupIdV135,true);
        return await window.__oldLoadChatThreadV135();
      };
      window.loadChatThread = loadChatThread;
    }

    if(window.__oldSendChatMessageV135){
      sendChatMessage = async function(){
        if(activeGroupIdV135) return await sendGroupMessageV135();
        return await window.__oldSendChatMessageV135();
      };
      window.sendChatMessage = sendChatMessage;
    }

    if(window.__oldRenderMessagesV135){
      renderMessages = function(){
        activeGroupIdV135='';
        const result=window.__oldRenderMessagesV135();
        setTimeout(()=> {
          addGroupMenuButtonV135();
          loadConversationsV135(false);
        },250);
        return result;
      };
      window.renderMessages = renderMessages;
    }

    window.openGroupChatV135=openGroupChatV135;
    window.loadGroupThreadV135=loadGroupThreadV135;
    window.sendGroupMessageV135=sendGroupMessageV135;
    window.openCreateGroupV135=openCreateGroupV135;
    window.openJoinGroupV135=openJoinGroupV135;
    window.createBackendGroupV135=createBackendGroupV135;
    window.joinBackendGroupV135=joinBackendGroupV135;
    window.copyGroupInviteV135=copyGroupInviteV135;
    window.showGroupMembersV135=showGroupMembersV135;
    window.openGroupAccessV135=openGroupAccessV135;
    window.saveGroupAccessV135=saveGroupAccessV135;
    window.leaveGroupV135=leaveGroupV135;
    window.closeGroupModalV135=closeModalV135;
    window.toggleGroupMenuV135=toggleGroupMenuV135;
    window.closeGroupMenuV135=closeGroupMenuV135;
    window.loadConversationsV135=loadConversationsV135;
  }

  document.addEventListener('click', function(event){
    if(!event.target.closest('#groupMenuV135')) closeGroupMenuV135();

    const modal=document.getElementById('backendGroupModalV135');
    if(modal && !modal.classList.contains('hidden') && event.target===modal){
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', function(event){
    if(event.key==='Escape') closeModalV135();
    if(event.key==='Enter' && document.activeElement?.id==='joinGroupBackendV135'){
      event.preventDefault();
      joinBackendGroupV135();
    }
  });

  function runV135(){
    patchV135();
    if(appReadyV135() && isMessagesViewV135()){
      addGroupMenuButtonV135();
      appendGroupsToConversationsV135(true);
    }
    handleInviteHashV135();
  }

  setInterval(runV135,1300);
  setTimeout(runV135,300);
  setTimeout(runV135,1200);
  setTimeout(runV135,2600);
})();


/* =========================================================
   V136 MESSAGING UI CLEANUP
   Fixes red-circled issues:
   - Removes duplicate 3-dot buttons beside Open.
   - Keeps only V135 backend group menu.
   - Makes "No groups yet" compact and professional.
   - Does not touch backend routes or group chat logic.
   ========================================================= */

(function(){
  function cleanupDuplicateDotsV136(){
    // Old frontend/local group menus from V126/V127 cause duplicate ⋮ buttons.
    document.querySelectorAll(
      '#dmThreeDotV127,' +
      '#dmThreeDotV126,' +
      '.dm-three-wrap-v127,' +
      '.dm-three-wrap-v126,' +
      '.three-dot-menu:not(#groupMenuV135)'
    ).forEach(el => {
      if(el.id === 'groupMenuV135') return;
      el.classList.add('v136-hide-duplicate-dot');
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('width', '0', 'important');
      el.style.setProperty('min-width', '0', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('padding', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    });

    // Make sure the correct V135 menu remains cleanly beside Open.
    const start = document.querySelector('.chat-start');
    const groupMenu = document.getElementById('groupMenuV135');

    if(start && groupMenu && groupMenu.parentElement !== start){
      start.appendChild(groupMenu);
    }

    if(groupMenu){
      groupMenu.classList.add('v136-main-group-menu');
      groupMenu.style.removeProperty('display');
      groupMenu.style.removeProperty('visibility');
      groupMenu.style.removeProperty('opacity');
      groupMenu.style.removeProperty('width');
      groupMenu.style.removeProperty('min-width');
      groupMenu.style.removeProperty('margin');
      groupMenu.style.removeProperty('padding');
      groupMenu.style.removeProperty('pointer-events');
    }
  }

  function polishNoGroupsBoxV136(){
    document.querySelectorAll('.group-empty-v135').forEach(box => {
      box.classList.add('v136-compact-empty-group');
      box.innerHTML = `
        <span class="v136-empty-dot">＋</span>
        <span>No groups yet</span>
        <small>Use ⋮ to create or join.</small>
      `;
    });

    document.querySelectorAll('.group-section-title-v135').forEach(title => {
      title.classList.add('v136-group-title-clean');
    });
  }

  function alignChatStartV136(){
    const start = document.querySelector('.chat-start');
    if(!start) return;

    start.classList.add('v136-chat-start-clean');

    const input = start.querySelector('input');
    if(input){
      input.classList.add('v136-chat-username-input');
    }

    const openBtn = Array.from(start.querySelectorAll('button')).find(btn => {
      const t = String(btn.textContent || '').trim().toLowerCase();
      return t.includes('open');
    });

    if(openBtn){
      openBtn.classList.add('v136-open-button-clean');
    }
  }

  function runV136(){
    cleanupDuplicateDotsV136();
    polishNoGroupsBoxV136();
    alignChatStartV136();
  }

  setInterval(runV136, 700);
  setTimeout(runV136, 100);
  setTimeout(runV136, 500);
  setTimeout(runV136, 1500);
})();


/* =========================================================
   V139 STABLE GROUP MEMBER PICKER
   Direct fix for the problem seen in the screen recording:
   - Replaces Create Group popup with professional member search.
   - Replaces Manage Group popup with professional member search.
   - Uses backend /api/groups/users/search.
   - Uses existing V135 create/save backend functions.
   - Does not touch normal 1-1 DM send/open logic.
   ========================================================= */

(function(){
  let pickerMembersV139 = [];
  let pickerTimerV139 = null;
  let patchDoneV139 = false;

  function cleanV139(value=''){
    return String(value || '').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();
  }

  function escapeV139(value=''){
    return String(value || '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function toastV139(message){
    if(typeof toast === 'function'){
      try{ toast(message); return; }catch{}
    }
    console.log(message);
  }

  function tokenV139(){
    return localStorage.getItem('token') || localStorage.getItem('reconnect_token') || '';
  }

  async function fetchJsonV139(url, options={}){
    if(typeof apiFetch === 'function'){
      return await apiFetch(url, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = tokenV139();
    if(token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if(!res.ok || data.success === false){
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  function currentUsernameV139(){
    try{
      const u = window.currentUserData || currentUserData || {};
      return cleanV139(u.username || u.displayName || 'me').replace(/^@/,'').toLowerCase();
    }catch{
      return 'me';
    }
  }

  function ensureBackendModalV139(){
    let modal = document.getElementById('backendGroupModalV135');

    if(!modal){
      modal = document.createElement('div');
      modal.id = 'backendGroupModalV135';
      modal.className = 'backend-group-modal-v135 hidden';
      document.body.appendChild(modal);
    }

    return modal;
  }

  function avatarV139(user){
    const fallback = (user.displayName || user.username || '?').slice(0,1).toUpperCase();
    const avatar = user.avatar || user.profilePhoto || user.photo || '';

    if(avatar && typeof renderAvatarHTML === 'function'){
      try{
        return renderAvatarHTML(avatar, fallback);
      }catch{}
    }

    return `<span class="member-avatar-v139">${escapeV139(fallback)}</span>`;
  }

  async function searchUsersV139(query){
    query = cleanV139(query).replace(/^@/,'');
    if(!query) return [];

    const endpoints = [
      `/api/groups/users/search?q=${encodeURIComponent(query)}`,
      `/api/users/search?q=${encodeURIComponent(query)}`,
      `/api/users?search=${encodeURIComponent(query)}`
    ];

    for(const endpoint of endpoints){
      try{
        const data = await fetchJsonV139(endpoint);
        const arr =
          data.users ||
          data.results ||
          data.data ||
          (Array.isArray(data) ? data : []);

        if(Array.isArray(arr) && arr.length){
          return arr.map(user => ({
            id: user._id || user.id || user.username,
            username: cleanV139(user.username || user.handle || user.name || '').replace(/^@/,''),
            displayName: cleanV139(user.displayName || user.name || user.username || ''),
            avatar: user.avatar || user.profilePhoto || user.photo || '',
            bio: cleanV139(user.bio || user.email || '')
          })).filter(u => u.username).slice(0, 12);
        }
      }catch{}
    }

    return [];
  }

  function uniqueMembersV139(){
    const me = currentUsernameV139();

    return pickerMembersV139
      .filter(u => u.username && u.username.toLowerCase() !== me)
      .filter((u, i, arr) => arr.findIndex(x => x.username.toLowerCase() === u.username.toLowerCase()) === i);
  }

  function syncHiddenMembersV139(){
    const usernames = uniqueMembersV139().map(u => u.username).join(', ');

    const createHidden = document.getElementById('groupMembersBackendV135');
    const editHidden = document.getElementById('editGroupMembersBackendV135');

    if(createHidden) createHidden.value = usernames;
    if(editHidden) editHidden.value = usernames;
  }

  function renderSelectedV139(){
    const box = document.getElementById('selectedMembersV139');
    syncHiddenMembersV139();

    if(!box) return;

    const members = uniqueMembersV139();

    if(!members.length){
      box.innerHTML = `
        <div class="selected-empty-v139">
          <b>No members selected</b>
          <small>Search profile and click Add.</small>
        </div>
      `;
      return;
    }

    box.innerHTML = members.map(user => `
      <button type="button" class="selected-chip-v139" onclick="removePickerMemberV139('${escapeV139(user.username)}')">
        ${avatarV139(user)}
        <span>@${escapeV139(user.username)}</span>
        <b>×</b>
      </button>
    `).join('');
  }

  window.removePickerMemberV139 = function(username){
    pickerMembersV139 = pickerMembersV139.filter(u => u.username.toLowerCase() !== String(username).toLowerCase());
    renderSelectedV139();
  };

  window.addPickerMemberV139 = function(username, displayName='', avatar='', bio=''){
    username = cleanV139(username).replace(/^@/,'');
    displayName = cleanV139(displayName || username);

    if(!username) return;

    if(username.toLowerCase() === currentUsernameV139()){
      toastV139('You are already included as admin');
      return;
    }

    if(!pickerMembersV139.some(u => u.username.toLowerCase() === username.toLowerCase())){
      pickerMembersV139.push({username, displayName, avatar, bio});
    }

    const input = document.getElementById('memberSearchInputV139');
    const results = document.getElementById('memberSearchResultsV139');

    if(input) input.value = '';
    if(results) results.innerHTML = `<div class="member-result-hint-v139">Search another profile.</div>`;

    renderSelectedV139();
  };

  async function updateResultsV139(){
    const input = document.getElementById('memberSearchInputV139');
    const results = document.getElementById('memberSearchResultsV139');

    if(!input || !results) return;

    const q = input.value.trim();

    if(!q){
      results.innerHTML = `<div class="member-result-hint-v139">Type username or profile name.</div>`;
      return;
    }

    results.innerHTML = `<div class="member-result-hint-v139">Searching profiles...</div>`;

    let users = [];

    try{
      users = await searchUsersV139(q);
    }catch(error){
      results.innerHTML = `
        <div class="member-result-empty-v139">
          <b>Search failed</b>
          <small>${escapeV139(error.message)}</small>
        </div>
      `;
      return;
    }

    const selected = new Set(uniqueMembersV139().map(u => u.username.toLowerCase()));
    const me = currentUsernameV139();

    users = users.filter(u => {
      const username = String(u.username || '').toLowerCase();
      return username && username !== me && !selected.has(username);
    });

    if(!users.length){
      results.innerHTML = `
        <div class="member-result-empty-v139">
          <b>No profile found</b>
          <small>Only registered users in MongoDB appear here.</small>
        </div>
      `;
      return;
    }

    results.innerHTML = users.map(user => `
      <button type="button" class="member-result-card-v139"
        onclick="addPickerMemberV139('${escapeV139(user.username)}','${escapeV139(user.displayName)}','${escapeV139(user.avatar)}','${escapeV139(user.bio)}')">
        ${avatarV139(user)}
        <div>
          <b>${escapeV139(user.displayName || user.username)}</b>
          <small>@${escapeV139(user.username)}${user.bio ? ' • ' + escapeV139(user.bio).slice(0, 44) : ''}</small>
        </div>
        <em>Add</em>
      </button>
    `).join('');
  }

  function bindSearchV139(){
    const input = document.getElementById('memberSearchInputV139');
    if(!input || input.__v139Bound) return;

    input.__v139Bound = true;

    input.addEventListener('input', () => {
      clearTimeout(pickerTimerV139);
      pickerTimerV139 = setTimeout(updateResultsV139, 180);
    });

    input.addEventListener('keydown', event => {
      if(event.key === 'Enter'){
        event.preventDefault();
        updateResultsV139();
      }
    });

    setTimeout(updateResultsV139, 80);
  }

  function memberPickerHTMLV139(){
    return `
      <input type="hidden" id="groupMembersBackendV135">
      <input type="hidden" id="editGroupMembersBackendV135">

      <div class="backend-field-v135">
        <span>Add members by profile search</span>
        <div class="member-search-shell-v139">
          <input id="memberSearchInputV139" placeholder="Search username or profile name">
        </div>
        <div id="memberSearchResultsV139" class="member-search-results-v139"></div>
      </div>

      <div class="backend-field-v135">
        <span>Selected members</span>
        <div id="selectedMembersV139" class="selected-members-v139"></div>
      </div>
    `;
  }

  window.openCreateGroupV135 = function(){
    pickerMembersV139 = [];

    const modal = ensureBackendModalV139();

    modal.innerHTML = `
      <section class="backend-group-card-v135">
        <div class="backend-modal-head-v135">
          <div>
            <p>Real Backend Group</p>
            <h2>Create Group Chat</h2>
            <span>Search profiles, click Add, then create group.</span>
          </div>
          <button onclick="closeGroupModalV135()">×</button>
        </div>

        <label class="backend-field-v135">
          <span>Group name</span>
          <input id="groupNameBackendV135" maxlength="50" placeholder="Example: Startup Team">
        </label>

        ${memberPickerHTMLV139()}

        <div class="backend-options-v135">
          <label>
            <input type="checkbox" id="groupAdminOnlyBackendV135">
            <div><b>Only admin can send messages</b><small>Best for announcement groups.</small></div>
          </label>
          <label>
            <input type="checkbox" id="groupOpenJoinBackendV135">
            <div><b>Open join</b><small>People can join with group invite link.</small></div>
          </label>
        </div>

        <div class="backend-actions-v135">
          <button class="ghost" onclick="closeGroupModalV135()">Cancel</button>
          <button onclick="createBackendGroupV135()">Create Group</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('groupNameBackendV135')?.focus();
      bindSearchV139();
      renderSelectedV139();
    }, 80);
  };

  window.openCreateGroupStableV139 = window.openCreateGroupV135;

  async function getGroupForManageV139(groupId){
    const data = await fetchJsonV139(`/api/groups/${encodeURIComponent(groupId)}`);
    return data.group;
  }

  window.openGroupAccessV135 = async function(groupId){
    let group;

    try{
      group = await getGroupForManageV139(groupId);
    }catch(error){
      toastV139(error.message);
      return;
    }

    pickerMembersV139 = (group.members || [])
      .map(user => ({
        id: user._id || user.id || user.username,
        username: cleanV139(user.username || '').replace(/^@/,''),
        displayName: cleanV139(user.displayName || user.name || user.username || ''),
        avatar: user.avatar || user.profilePhoto || user.photo || '',
        bio: user.bio || ''
      }))
      .filter(user => user.username && user.username.toLowerCase() !== currentUsernameV139());

    const modal = ensureBackendModalV139();

    modal.innerHTML = `
      <section class="backend-group-card-v135">
        <div class="backend-modal-head-v135">
          <div>
            <p>Admin Controls</p>
            <h2>${escapeV139(group.name)}</h2>
            <span>Search and manage members professionally.</span>
          </div>
          <button onclick="closeGroupModalV135()">×</button>
        </div>

        <label class="backend-field-v135">
          <span>Group name</span>
          <input id="editGroupNameBackendV135" value="${escapeV139(group.name)}">
        </label>

        ${memberPickerHTMLV139()}

        <div class="backend-options-v135">
          <label>
            <input type="checkbox" id="editGroupAdminOnlyBackendV135" ${group.settings?.adminOnlyMessages ? 'checked' : ''}>
            <div><b>Only admin can send messages</b><small>Controls who can post in group.</small></div>
          </label>
          <label>
            <input type="checkbox" id="editGroupOpenJoinBackendV135" ${group.settings?.openJoin ? 'checked' : ''}>
            <div><b>Open join</b><small>Invite link can add people.</small></div>
          </label>
        </div>

        <div class="backend-actions-v135">
          <button class="ghost" onclick="closeGroupModalV135()">Cancel</button>
          <button onclick="saveGroupAccessV135('${groupId}')">Save</button>
        </div>
      </section>
    `;

    modal.classList.remove('hidden');

    setTimeout(() => {
      bindSearchV139();
      renderSelectedV139();
    }, 80);
  };

  window.openGroupAccessStableV139 = window.openGroupAccessV135;

  function patchMenuV139(){
    // Ensure Create Group menu uses the stable V139 modal.
    document.querySelectorAll('#groupMenuPopupV135 button').forEach(btn => {
      const text = String(btn.textContent || '').toLowerCase();

      if(text.includes('create group')){
        btn.onclick = function(){
          window.openCreateGroupV135();
          if(typeof closeGroupMenuV135 === 'function') closeGroupMenuV135();
        };
      }
    });
  }

  function patchSaveAndCreateV139(){
    if(!window.__v139CreateBackendPatch && typeof window.createBackendGroupV135 === 'function'){
      window.__v139CreateBackendPatch = true;
      const oldCreate = window.createBackendGroupV135;

      window.createBackendGroupV135 = async function(){
        syncHiddenMembersV139();
        return await oldCreate();
      };
    }

    if(!window.__v139SaveBackendPatch && typeof window.saveGroupAccessV135 === 'function'){
      window.__v139SaveBackendPatch = true;
      const oldSave = window.saveGroupAccessV135;

      window.saveGroupAccessV135 = async function(groupId){
        syncHiddenMembersV139();
        return await oldSave(groupId);
      };
    }
  }

  function runV139(){
    patchMenuV139();
    patchSaveAndCreateV139();
  }

  setInterval(runV139, 500);
  setTimeout(runV139, 120);
  setTimeout(runV139, 500);
  setTimeout(runV139, 1400);
})();
