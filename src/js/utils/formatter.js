module.exports = {
  formatDate: function(str){
    console.log(str);
    var dateText;
    var date = new Date(str);
    var now = new Date();
    if (date.toDateString() === now.toDateString()){ // Updated sometime today, display time
      dateText = "Today at " + date.toLocaleTimeString('en-US');
    } else {
      dateText = Date(str).toDateString();
    }
    return dateText;
  }
}
