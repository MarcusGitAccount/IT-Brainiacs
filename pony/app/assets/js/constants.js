
function limits(high, low) {
  this.low  = low;
  this.high = high;
}

export default function units() {
  this.temperature = new limits(5, 25); // °C
  this.windspeed = new limits(0, 5); // km / h
  this.pp = new limits(0, 5); // mm
  this.visibity = new limits(0.25, 10);
  this.pressure = new limits(1010, 1020); // milibars 1014 mb ~ 760 mmcolHg
  this.clouds = new limits(0, 50); // cloud coverage percentage
  this.snow = new limits(0.1, 100); // cm
}