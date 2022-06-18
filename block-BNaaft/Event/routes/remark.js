var express = require('express');
const { route } = require('.');
const { events } = require('../modals/event');
var router = express.Router();
var Event = require('../modals/event')
var Remark = require('../modals/remark')


router.get('/:id/edit',(req,res,next)=>{
    var id = req.params.id;
    Remark.findById(id,(err,updateremark)=>{
        console.log(updateremark);
        if(err) return next(err);
        res.render('remarksupdate',{updateremark:updateremark})
    })
})


router.post('/:id',(req,res,next)=>{
    var id = req.params.id;
    Remark.findByIdAndUpdate(id,req.body,(err,update)=>{
        if(err) return next(err);
        res.redirect('/event/' +update.eventID)
      })
})
router.get('/:id/delete',(req,res,next)=>{
    var id = req.params.id;
    Remark.findByIdAndRemove(id,(err,deletecomment)=>{
        if(err) return next(err);
        // Remark.deleteMany({remarksID:deletecomment.id},(err,info)=>{
            // Event.findByIdAndUpdate(deletecomment.eventID,{$pull:{remarksID:deletecomment._id}})
            res.redirect('/event/'+deletecomment.eventID) 
        // })
      
    })
})

// router.get('/:id/delete',(req,res,next)=>{
//     // var id = req.params.id;
//     Remark.findByIdAndDelete(req.params.id,(err,deleteuser)=>{
//       if(err) return next(err);
//       res.redirect('/event')
//     })
//   })



router.get('/:id/like',(req,res,next)=>{
    var id = req.params.id;
    Remark.findByIdAndUpdate(id,{$inc:{likes:1}},(err,event)=>{
      // if(err) return next(err);
      // res.redirect('/users/' + id)
      // if(blog.likes==0){
      //   likes +=1
      // }else{
      //   likes =0
      // }
      res.redirect('/event/'+event.eventID)
  
    })
  })
  router.get('/:id/dislike',(req,res,next)=>{
    var id = req.params.id;
    Remark.findByIdAndUpdate(id,{$inc:{likes:-1}},(err,event)=>{
      // if(err) return next(err);
      // res.redirect('/users/' + id)
      // if(blog.likes==0){
      //   likes +=1
      // }else{
      //   likes =0
      // }
      res.redirect('/event/'+event.eventID )
  
    })
  })

module.exports = router;