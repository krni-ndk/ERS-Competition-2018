# ERS-Competition-2018

### SSH with public key:
First generate keys with PuttyGen. Then save the private key and public key (both).  
##### Putty:
  - Session -> Hostname + Port
  - Connection -> Data -> Auto-login username: pi
  - Connection -> Data -> SSH -> Auth -> Add private key file
#### Linux:
  - Copy public key into: /home/pi/.ssh/authorized_keys
  - Change permisions: chmod 600 /home/pi/.ssh/authorized_keys
  - Change ownership: chown -R pi:pi /home/pi/.ssh/authorized_keys
