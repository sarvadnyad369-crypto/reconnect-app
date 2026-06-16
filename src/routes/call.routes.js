const express = require('express');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
const calls = new Map();

function uid(req){ return String(req.user._id || req.user.id || req.user.userId); }
function pub(u){ return { id:u._id, _id:u._id, displayName:u.displayName, username:u.username, avatar:u.avatar||'👤' }; }
function clean(c){ return { id:c.id,type:c.type,status:c.status,caller:c.callerPublic,receiver:c.receiverPublic,offer:c.offer,answer:c.answer||null,createdAt:c.createdAt,updatedAt:c.updatedAt,endedAt:c.endedAt||null }; }
function participant(c,req){ const id=uid(req); return c && (String(c.callerId)===id || String(c.receiverId)===id); }
function side(c,req){ const id=uid(req); if(String(c.callerId)===id) return 'caller'; if(String(c.receiverId)===id) return 'receiver'; return ''; }
function other(s){ return s==='caller'?'receiver':'caller'; }

router.post('/start', auth, async (req,res)=>{
  try{
    const from=await User.findById(uid(req)).select('_id displayName username avatar');
    const toUsername=String(req.body.toUsername||'').toLowerCase().trim();
    const type=req.body.type==='video'?'video':'audio';
    const offer=req.body.offer;
    if(!from) return res.status(401).json({success:false,message:'Login required'});
    if(!toUsername) return res.status(400).json({success:false,message:'Receiver username required'});
    if(!offer) return res.status(400).json({success:false,message:'Call offer required'});
    const to=await User.findOne({username:toUsername}).select('_id displayName username avatar');
    if(!to) return res.status(404).json({success:false,message:'User not found'});
    if(String(to._id)===String(from._id)) return res.status(400).json({success:false,message:'You cannot call yourself'});
    const id=crypto.randomBytes(10).toString('hex');
    const now=new Date().toISOString();
    const call={id,type,status:'ringing',callerId:String(from._id),receiverId:String(to._id),callerPublic:pub(from),receiverPublic:pub(to),offer,answer:null,candidates:[],createdAt:now,updatedAt:now,endedAt:null};
    calls.set(id,call);
    res.status(201).json({success:true,call:clean(call)});
  }catch(e){ console.error(e); res.status(500).json({success:false,message:'Could not start call'}); }
});

router.get('/incoming', auth, async (req,res)=>{
  try{
    const id=uid(req);
    const incoming=Array.from(calls.values()).filter(c=>String(c.receiverId)===id && c.status==='ringing').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(clean);
    res.json({success:true,calls:incoming});
  }catch(e){ res.status(500).json({success:false,message:'Could not load incoming calls'}); }
});

router.get('/:callId', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  res.json({success:true,call:clean(c),side:side(c,req)});
});

router.post('/:callId/answer', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  if(side(c,req)!=='receiver') return res.status(403).json({success:false,message:'Only receiver can answer'});
  if(!req.body.answer) return res.status(400).json({success:false,message:'Answer required'});
  c.answer=req.body.answer; c.status='connected'; c.updatedAt=new Date().toISOString();
  res.json({success:true,call:clean(c)});
});

router.post('/:callId/decline', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  c.status='declined'; c.endedAt=new Date().toISOString(); c.updatedAt=c.endedAt;
  res.json({success:true,call:clean(c)});
});

router.post('/:callId/end', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  c.status='ended'; c.endedAt=new Date().toISOString(); c.updatedAt=c.endedAt;
  res.json({success:true,call:clean(c)});
});

router.post('/:callId/candidate', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  if(!req.body.candidate) return res.status(400).json({success:false,message:'Candidate required'});
  c.candidates.push({from:side(c,req),candidate:req.body.candidate,at:new Date().toISOString()});
  c.updatedAt=new Date().toISOString();
  res.json({success:true,index:c.candidates.length-1});
});

router.get('/:callId/candidates', auth, async (req,res)=>{
  const c=calls.get(req.params.callId);
  if(!c || !participant(c,req)) return res.status(404).json({success:false,message:'Call not found'});
  const remote=other(side(c,req));
  const after=Number(req.query.after||-1);
  const candidates=c.candidates.map((x,i)=>({...x,index:i})).filter(x=>x.from===remote && x.index>after);
  res.json({success:true,candidates});
});

module.exports = router;
