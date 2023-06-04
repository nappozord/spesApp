#!/bin/bash -eu

uwsgi --master --https 0.0.0.0:8444,/etc/uwsgi/ssl/uwsgi.cert,/etc/uwsgi/ssl/uwsgi.key --wsgi-file ./spesApp_server/wsgi.py --enable-thread --processes=5