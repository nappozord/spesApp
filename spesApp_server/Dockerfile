FROM python:3.8-slim-buster

RUN mkdir -p /opt/oracle

COPY instantclient_21_1 /opt/oracle/instantclient_21_1

RUN apt-get update && \
    apt-get install -y build-essential python vim net-tools libssl-dev && \
    apt-get install libaio1

RUN sh -c "echo /opt/oracle/instantclient_21_1 > /etc/ld.so.conf.d/oracle-instantclient.conf"

RUN ldconfig

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_1:$LD_LIBRARY_PATH

# Create project directory (workdir)
WORKDIR /app

# Add requirements.txt to WORKDIR and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

RUN pip install cx_Oracle --upgrade

# Add source code files to WORKDIR
ADD . .

# Container start command
# It is also possible to override this in devspace.yaml via images.*.cmd
ENTRYPOINT ["./docker-entrypoint.sh"]
