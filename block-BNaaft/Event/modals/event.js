var mongoose = require('mongoose');
var moment = require('moment')
var Schema = mongoose.Schema;



var eventSchema = new Schema({
    title:String,
    summary:String,
    host:String,
    startdate:{type:Date},
    endDate:{type:Date},
    eventcategory:String,
    location:String,
    likes:{type:Number,default:0},
    remarksID:[{type:Schema.Types.ObjectId, ref:"Remark"}]
},{timestamps:true})

var Event = mongoose.model('Event', eventSchema);
module.exports=Event;
