import dayjs from 'dayjs'
import moment from 'moment'

export const toServerDate = (date) => {
    
    return dayjs(date).format("YYYY-MM-DD")
} 


const getMonth = (m,mode='long') => {
    const MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    if(mode === 'short'){
        return 'JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC'.slice(3*(m),3*(m)+3)
    }else if(mode === 'long'){
        return MONTHS[m]
    }else{
        throw('Invailid Mode :', mode);
    }
}

export const dateDecompose = (date,mode='long') => {
    if(date){
        let c = date.slice(0,10).split('-') 
        return {year:c[0],month:getMonth(c[1]-1,mode),date:c[2]}    
    }else{
        return {year:"", month:"",date:""}
    }
}

export const TimeOptions = [
    {time:"12:00 AM"},
    {time:"12:30 AM"},
    {time:"01:00 AM"},
    {time:"01:30 AM"},
    {time:"02:00 AM"},
    {time:"02:30 AM"},
    {time:"03:00 AM"},
    {time:"03:30 AM"},
    {time:"04:00 AM"},
    {time:"04:30 AM"},
    {time:"05:00 AM"},
    {time:"05:30 AM"},
    {time:"06:00 AM"},
    {time:"06:30 AM"},  
    {time:"07:00 AM"},
    {time:"07:30 AM"},
    {time:"08:00 AM"},
    {time:"08:30 AM"},
    {time:"09:00 AM"},
    {time:"09:30 AM"},
    {time:"10:00 AM"},
    {time:"10:30 AM"},
    {time:"11:00 AM"},
    {time:"11:30 AM"},
    {time:"12:00 PM"},
    {time:"12:30 PM"},
    {time:"01:00 PM"},
    {time:"01:30 PM"},
    {time:"02:00 PM"},
    {time:"02:30 PM"},
    {time:"03:00 PM"},
    {time:"03:30 PM"},
    {time:"04:00 PM"},
    {time:"04:30 PM"},
    {time:"05:00 PM"},
    {time:"05:30 PM"},
    {time:"06:00 PM"},
    {time:"06:30 PM"},  
    {time:"07:00 PM"},
    {time:"07:30 PM"},
    {time:"08:00 PM"},
    {time:"08:30 PM"},
    {time:"09:00 PM"},
    {time:"09:30 PM"},
    {time:"10:00 PM"},
    {time:"10:30 PM"},
    {time:"11:00 PM"},
    {time:"11:30 PM"},
  ]


  export const READABLE_DATE_FORMAT = "DD MMM, YYYY"
  export const READABLE_DATETIME_FORMAT = "DD MMM, YYYY hh:mm a"

  export const toReadableDate = (date) => {
      return moment(date).isValid() ? moment(date).format(READABLE_DATE_FORMAT) : ""
  }