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
    temp = 23.4
    value = (temp, time_ms)

    mycursor.execute(
        "INSERT INTO readings(temp, time_ms) VALUES (%s, %s)", value)
    MYDB.commit()


store_data(50.3)
# print(read_sensor(PATH))
