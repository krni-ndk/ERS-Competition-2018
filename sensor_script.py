""" Script for reading data from DS1822 and storing it in a database """
import re
import os
import time as time_
import mysql.connector as mariadb

PATH = "/sys/bus/w1/devices/28-051693ac7dff/w1_slave"

MYDB = mariadb.connect(
    host="localhost",
    user="user",
    passwd="pass",
    database="sensor_v1"
)


def store_data(temp):
    """ Stores sensor data and time stamp into database """
    mycursor = MYDB.cursor()
    time_ms = int(round(time_.time() * 1000))
    value = (temp, time_ms)

    mycursor.execute(
        "INSERT INTO readings(temp, time_ms) VALUES (%s, %s)", value)
    MYDB.commit()


def read_sensor(sensor_path):
    """ Reads and parsers sensor file """
    value = "U"
    try:
        sensor_file = open(sensor_path, "r")
        line = sensor_file.readline()
        if re.match(r"([0-9a-f]{2} ){9}: crc=[0-9a-f]{2} YES", line):
            line = sensor_file.readline()
            match = re.match(r"([0-9a-f]{2} ){9}t=([+-]?[0-9]+)", line)
            if match:
                value = str(float(match.group(2)) / 1000.0)
        sensor_file.close()
    except (IOError) as exception:
        print(time_.strftime("%x %X"), "Error reading",
              sensor_path, ": ", exception)
    return value


print(read_sensor(PATH))
store_data(read_sensor(PATH))
