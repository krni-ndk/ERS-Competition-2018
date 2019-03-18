# ERS-Competition-2018

### SSH with public key:
First generate keys with PuttyGen. Then save the private key and public key (both). 
##### Making Putty public key compatible with OpenSSH:
  - Remove 'BEGIN' and 'END'
  - Make it all one line
  - Add 'ssh-rsa' and a space at the start
  - Add a space and text in the comment at the end (e.g. rsa-key-20190317)
##### Putty:
  - Session -> Hostname + Port
  - Connection -> Data -> Auto-login username
  - Connection -> Data -> SSH -> Auth -> Add private key file
#### Linux:
  - Copy public key into: /home/pi/.ssh/authorized_keys
  - Change permisions: chmod 600 /home/pi/.ssh/authorized_keys
  - Change ownership: chown -R user:user /home/pi/.ssh/authorized_keys

### Convert MySQL timestamp to javascript date:
  ```javascript
  var mysql_timestamp = "2010-06-09 13:12:01";
  var ts = timestamp.split(/[- :]/);
  var time = new Date(Date.UTC(ts[0], ts[1], ts[2], ts[3], ts[4], ts[5])).toLocaleTimeString('sl-SI');
  console.log(time); // 15:12:01
  ```
