#!/bin/bash
# update system packages
sudo echo "install postgres"

# enable repository to install postgresql
sudo amazon-linux-extras enable postgresql15

# Install PostgreSQL server and initialize the database 
# cluster for this server
sudo yum -y install postgresql-server postgresql-devel
sudo /usr/bin/postgresql-setup --initdb

# Backup PostgreSQL authentication config file
sudo mv /var/lib/pgsql/data/pg_hba.conf /var/lib/pgsql/data/pg_hba.conf.bak

# Create our new PostgreSQL authentication config file
sudo cat <<'EOF' > /var/lib/pgsql/data/pg_hba.conf
${pg_hba_file}
EOF

# Update the IPs of the address to listen from PostgreSQL config
sudo sed -i "59i listen_addresses = '*'" /var/lib/pgsql/data/postgresql.conf

# Start the db service
sudo systemctl enable postgresql
sudo systemctl start postgresql


