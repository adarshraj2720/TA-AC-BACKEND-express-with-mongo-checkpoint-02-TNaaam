var express = require('express');

var moment = require('moment')
const { route } = require('.');
var router = express.Router();
var Event = require('../modals/event');
const { events, find } = require('../modals/remark');
var Remark = require('../modals/remark')


// var date = moment().format('L')

/* GET users listing. */
router.get('/new', function (req, res, next) {
  // res.send('respond with a resource');
  res.render('eventform');
});



router.post('/', (req, res, next) => {
  //req.body.startdate = moment(req.body.startdate).format()

  //console.log(moment(req.body.startdate).format().slice(0,10))
  Event.create(req.body, (err, event) => {
    if (err) return next(err);
    console.log(event)
    res.redirect('/event/new')
  })
})

router.get('/', (req, res, next) => {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    Event.distinct("eventcategory", (err, eve) => {
      console.log(eve);
      Event.distinct('location', (err, even) => {
        Event.distinct('startdate', (err, date) => {
          console.log(date)
          res.render('events', { events, eve, even, date });
        })

      })

    })
  })
})








router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, updateevent) => {
    var start = moment(updateevent.startdate).format().slice(0, 10);
    var end = moment(updateevent.endDate).format().slice(0, 10);
    // console.log(edit.slice(0,6));
    console.log(updateevent)
    if (err) return next(err);

    res.render('editeventform', { updateevent, start, end })
  })
})





router.get('/filter',(req,res,next)=>{
  
  let category = req.query.eventcategory
  let location = req.query.location
  let startdate = req.query.startdate;
  let endDate = req.query.endDate
    console.log(category,"category")
  if(category){
    Event.find({eventcategory:category}, (err, events) => {
      console.log(events);
      Event.distinct('eventcategory', (err, eve) => {
        console.log(eve);
        Event.distinct('location', (err, even) => {
          console.log(even);
           Event.distinct('startdate', (err, date) => {
            res.render('events', { events, eve, even, date})
           })
  
        })
  
      })
  
    })
  }else if(location){
    Event.find({location:location}, (err, events) => {
          console.log(events);
          Event.distinct('eventcategory', (err, eve) => {
            console.log(eve);
            Event.distinct('location', (err, even) => {
              console.log(even);
             Event.distinct('startdate', (err, date) => {
               res.render('events', { events, eve, even, date })
             })
      
           })
      
         })
      
        })
  }else if( startdate && endDate){
      Event.find({ 'startdate': { $gte: startdate, $lt: endDate } }, (err, events) => {
    console.log(events);
    Event.distinct('eventcategory', (err, eve) => {
      console.log(eve);
      Event.distinct('location', (err, even) => {
        console.log(even);

        res.render('events', { events, eve, even })
      })

    })
  })
  }

})
router.get('/:id', (req, res, next) => {
  var id = req.params.id
  Event.findById(id).populate('remarksID').exec((err,event) => {
    console.log(err, event)
    var startdate = moment(event.startdate).format('DD/MM/YYYY').slice(0, 10);
    var enddate = moment(event.enddate).format('DD/MM/YYYY').slice(0, 10);
   if (err) return next(err)
    res.render('eventdetails', { event,startdate,enddate })
  })
})





router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, update) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  })
})

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, update) => {
    if (err) return next(err);
    res.redirect('/event/');
  })
})

router.post('/:id/remark', (req, res, next) => {
  var id = req.params.id;
  req.body.eventID = id;
  Remark.create(req.body, (err, remark) => {
    console.log(err, remark)
    if (err) return next(err)
    Event.findByIdAndUpdate(id, { $push: { remarksID: remark.id } }, (err, remarks) => {
      console.log(remarks)
      if (err) return next(err)
      res.redirect('/event/' + id)
    })
  })
})




router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    // if(err) return next(err);
    // res.redirect('/users/' + id)
    // if(blog.likes==0){
    //   likes +=1
    // }else{
    //   likes =0
    // }
    // if(err) return next(err)
    res.redirect('/event/' + id)

  })
})

router.get("/:id/dislike", (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    if (event.likes > 0) {
      Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
        console.log(event);
        if (err) return next(err);
        res.redirect("/event/" + id);
      });
    } else {
      res.redirect("/event/" + id);
    }
  });
});







module.exports = router;
