function Queue(max, vals) {
    this.q = vals;
    this.maxSize = max;
    this.send = ( item ) => {
        if(this.q.length >= this.maxSize){
            this.q.shift();
        } 
        this.q.push( item ); 
    };
    this.receive = () => this.q.shift(); 
    this.getOldest = () => this.q[0];
    this.getNewer = () => this.q[this.q.length-1];
    this.getSize = () => this.q.length;
  }

  module.exports = Queue