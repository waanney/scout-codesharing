export function formatMillisecondsToDate(milliseconds) {
  let date = new Date(milliseconds);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return day + '/' + month + '/' + year; // Định dạng dd/mm/yyyy
}


export function formattedError(error){
  return error.toString().replace(/\./g, ".\n" );
  
}
