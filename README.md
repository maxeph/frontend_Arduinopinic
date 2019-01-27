# Arduinopinic

Arduinopinic is a front-end which will allow you to manage all your Aquaponic system.

This front-end is based on Django server and designed with Bootstrap 4.

The front-end is communicating with the various sensors through the Arduinopinic daemon. This daemon is not included in this repository because its developpment is based in another [repository](https://github.com/maxeph/Arduinopinic_pi/). Nevertheless, its inclusion is very simple (see beloz installation steps).

## Installation

```bash
sudo apt-get update
sudo apt-get upgrade
git clone https://github.com/maxeph/Arduinopinic.git
cd Arduinopinic
mkvirtualenv djangoAPNC(cf virtualenvwrapper installation)
pip install django
./manager.py runserver PI_IP_ADDRESS:8000
```

README STILL UNDER DEVELOPMENT
