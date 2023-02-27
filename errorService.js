const Queue = require('./queue')

function ErrorService (errFunc, queueSize, alarmTimeSpan, alarmFunc) {
    this.q = new Queue(queueSize, []); 
    this.lastAlarm = new Date(new Date().getTime() - (alarmTimeSpan * 1000));
    this.errFunc = errFunc;
    this.alarmTimeSpan = alarmTimeSpan;
    this.queueSize = queueSize;
    this.alarmFunc = alarmFunc;
    this.logError = ( error ) => { 
      this.errFunc(error)

      const newer = new Date();
      this.q.send(newer);
      this.q = new Queue(this.queueSize, this.q.q.filter((errDate) => this.difference(newer,errDate) < this.alarmTimeSpan));
      console.log('Queue size: '+this.q.getSize());
      const oldest = this.q.getOldest();

      if(this.q.getSize() >= this.queueSize){
          console.log('Newest: '+newer);
          console.log('Oldest: '+oldest);
          console.log('Last Alarm at: '+this.lastAlarm);
          console.log('dif: '+ ((newer - this.lastAlarm) / 1000) + ' secs.');
          if((this.difference(newer, this.lastAlarm) > this.alarmTimeSpan)){
            alarmFunc(error);
            this.lastAlarm = newer;
          }
          this.q.receive();
        }
        else if(this.difference(newer,oldest) > this.alarmTimeSpan){
          this.q.receive();
          console.log('Alarm range excedeed deleting entry');
        }
    };
    this.difference = (n, o) => (n - o) / 1000;
}

module.exports = ErrorService